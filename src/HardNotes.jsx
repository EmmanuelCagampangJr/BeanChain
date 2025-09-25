import React, { useState, useEffect } from 'react';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });

  // Load notes from local storage on initial render
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
          ? { ...note, title: currentNote.title, content: currentNote.content, timestamp: new Date().toISOString() }
          : note
      );
      setNotes(updatedNotes);
    } else {
      // Add new note
      const newNote = {
        id: Date.now(),
        title: currentNote.title,
        content: currentNote.content,
        timestamp: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
    }
    setCurrentNote({ id: null, title: '', content: '' });
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    // If the note being deleted is the one in the editor, clear the editor
    if (currentNote.id === id) {
      setCurrentNote({ id: null, title: '', content: '' });
    }
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      {/* Top Bar - Inspired by Samsung Notes */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All notes</h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => setCurrentNote({ id: null, title: '', content: '' })} className="text-gray-400 hover:text-white transition-colors">
            {/* New Note Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <div className="relative">
            <input type="text" placeholder="Search" className="bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* Note Editor Section */}
      <div className="p-4 bg-gray-800 rounded-xl mb-6 shadow-lg">
        <input
          type="text"
          value={currentNote.title}
          onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
          placeholder="Title"
          className="w-full text-xl font-bold bg-gray-800 border-b border-gray-700 py-2 mb-2 focus:outline-none placeholder-gray-500"
        />
        <textarea
          value={currentNote.content}
          onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
          placeholder="Note content"
          rows="5"
          className="w-full text-md bg-gray-800 focus:outline-none resize-none placeholder-gray-500"
        ></textarea>
        <button
          onClick={handleAddOrUpdateNote}
          className="w-full mt-4 px-4 py-2 bg-blue-600 rounded-lg font-bold text-white hover:bg-blue-700 transition-colors"
        >
          {currentNote.id ? 'Save Changes' : 'Add Note'}
        </button>
      </div>

      {/* Notes List Section - Masonry Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <div
            key={note.id}
            className="note-card bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => handleEditNote(note)}
          >
            {/* Note Title */}
            <h3 className="font-semibold text-lg mb-2 truncate">{note.title || 'Untitled'}</h3>
            {/* Note Content */}
            <p className="text-sm text-gray-400 flex-grow overflow-hidden line-clamp-5">{note.content}</p>
            {/* Timestamp */}
            <p className="text-xs text-gray-500 mt-2">{formatTimestamp(note.timestamp)}</p>
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents the card's click event
                handleDeleteNote(note.id);
              }}
              className="mt-4 text-xs font-bold text-red-400 hover:text-red-300 transition-colors self-end"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
