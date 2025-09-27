  import React, { useState, useEffect } from 'react';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '', category: 'personal', priority: 'normal' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, noteId: null });

  const categories = {
    personal: { name: 'Personal', color: 'bg-blue-500', lightColor: 'bg-blue-100 text-blue-800' },
    work: { name: 'Work', color: 'bg-green-500', lightColor: 'bg-green-100 text-green-800' },
    ideas: { name: 'Ideas', color: 'bg-purple-500', lightColor: 'bg-purple-100 text-purple-800' },
    todo: { name: 'To-Do', color: 'bg-orange-500', lightColor: 'bg-orange-100 text-orange-800' },
    important: { name: 'Important', color: 'bg-red-500', lightColor: 'bg-red-100 text-red-800' }
  };

  const priorities = {
    low: { name: 'Low', color: 'text-gray-400' },
    normal: { name: 'Normal', color: 'text-gray-300' },
    high: { name: 'High', color: 'text-yellow-400' },
    urgent: { name: 'Urgent', color: 'text-red-400' }
  };

  
  useEffect(() => {
    const storedNotes = localStorage.getItem('hardNotes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  // Save notes to local storage whenever the notes state changes
  useEffect(() => {
    localStorage.setItem('hardNotes', JSON.stringify(notes));
  }, [notes]);

  const handleAddOrUpdateNote = () => {
    if (currentNote.title.trim() === '' && currentNote.content.trim() === '') {
      return;
    }

    if (currentNote.id) {
      // Update existing note
      const updatedNotes = notes.map(note =>
        note.id === currentNote.id
          ? { 
              ...note, 
              title: currentNote.title, 
              content: currentNote.content, 
              category: currentNote.category,
              priority: currentNote.priority,
              timestamp: new Date().toISOString() 
            }
          : note
      );
      setNotes(updatedNotes);
    } else {
      // Add new note
      const newNote = {
        id: Date.now(),
        title: currentNote.title,
        content: currentNote.content,
        category: currentNote.category,
        priority: currentNote.priority,
        timestamp: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
    }
    setCurrentNote({ id: null, title: '', content: '', category: 'personal', priority: 'normal' });
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    // If the note being deleted is the one in the editor, clear the editor
    if (currentNote.id === id) {
      setCurrentNote({ id: null, title: '', content: '', category: 'personal', priority: 'normal' });
    }
    setDeleteConfirmation({ show: false, noteId: null });
  };

  const confirmDelete = (id) => {
    setDeleteConfirmation({ show: true, noteId: id });
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'oldest':
        return new Date(a.timestamp) - new Date(b.timestamp);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'priority': {
        const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
        return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
      }
      default:
        return 0;
    }
  });
  
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Notes
            </h1>
            <p className="text-gray-400 mt-1">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
          </div>
          
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full sm:w-64"
              />
            </div>
            
            <button 
              onClick={() => setCurrentNote({ id: null, title: '', content: '', category: 'personal', priority: 'normal' })} 
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              title="Create new note"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === 'all' 
                ? 'bg-white text-gray-900 shadow-lg' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            All Notes
          </button>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === key 
                  ? `${category.color} text-white shadow-lg` 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
              {category.name}
            </button>
          ))}
        </div>

        {/* Sort and View Options */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="text-xs text-gray-500">
            {filteredNotes.length} of {notes.length} notes shown
          </div>
        </div>

        {/* Note Editor Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              placeholder="What's on your mind? Give it a title..."
              className="flex-1 text-2xl font-bold bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-blue-500 placeholder-gray-500 transition-colors"
            />
            
            <div className="flex gap-3">
              <select
                value={currentNote.category}
                onChange={(e) => setCurrentNote({ ...currentNote, category: e.target.value })}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              >
                {Object.entries(categories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
              
              <select
                value={currentNote.priority}
                onChange={(e) => setCurrentNote({ ...currentNote, priority: e.target.value })}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px]"
              >
                {Object.entries(priorities).map(([key, priority]) => (
                  <option key={key} value={key}>{priority.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <textarea
            value={currentNote.content}
            onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
            placeholder="Start writing your thoughts..."
            rows="6"
            className="w-full text-gray-300 bg-transparent focus:outline-none resize-none placeholder-gray-500 leading-relaxed"
          ></textarea>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">
                {currentNote.title.length + currentNote.content.length} characters
              </span>
              <span className="text-xs text-gray-500">
                {currentNote.content.split(' ').filter(word => word.length > 0).length} words
              </span>
            </div>
            <button
              onClick={handleAddOrUpdateNote}
              disabled={currentNote.title.trim() === '' && currentNote.content.trim() === ''}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium text-white hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {currentNote.id ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </div>

      {/* Notes List Section - Enhanced Grid Layout */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">
            <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xl text-gray-400 mb-2">No notes yet</p>
          <p className="text-gray-500">Create your first note to get started</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="break-inside-avoid bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-700/50 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/20 transform hover:-translate-y-1 group"
              onClick={() => handleEditNote(note)}
            >
              {/* Category indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${categories[note.category]?.lightColor || 'bg-gray-100 text-gray-800'}`}>
                  {categories[note.category]?.name || 'Uncategorized'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all duration-200 p-1 rounded-full hover:bg-red-500/10"
                  title="Delete note"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Note title */}
              <h3 className="font-semibold text-lg mb-2 text-gray-100 line-clamp-2">
                {note.title || 'Untitled Note'}
              </h3>

              {/* Note content preview */}
              <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-4">
                {note.content || 'No content'}
              </p>

              {/* Timestamp and word count */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{formatTimestamp(note.timestamp)}</span>
                <span>{note.content.split(' ').filter(word => word.length > 0).length} words</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="text-red-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Delete Note</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmation({ show: false, noteId: null })}
                  className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteNote(deleteConfirmation.noteId)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default App;
