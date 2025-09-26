import React from 'react';
import { Card, CardContent, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';

const NoteEditor = ({ currentNote, categories, priorities, onChange, onSave }) => {
  return (
    <Card sx={{ mb: 4, boxShadow: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              value={currentNote.title}
              onChange={e => onChange({ ...currentNote, title: e.target.value })}
              variant="standard"
              InputProps={{ style: { fontWeight: 700, fontSize: 22 } }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth variant="standard">
              <InputLabel>Category</InputLabel>
              <Select
                value={currentNote.category}
                onChange={e => onChange({ ...currentNote, category: e.target.value })}
              >
                {Object.entries(categories).map(([key, category]) => (
                  <MenuItem key={key} value={key}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth variant="standard">
              <InputLabel>Priority</InputLabel>
              <Select
                value={currentNote.priority}
                onChange={e => onChange({ ...currentNote, priority: e.target.value })}
              >
                {Object.entries(priorities).map(([key, priority]) => (
                  <MenuItem key={key} value={key}>{priority.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TextField
          fullWidth
          multiline
          minRows={5}
          label="Content"
          value={currentNote.content}
          onChange={e => onChange({ ...currentNote, content: e.target.value })}
          variant="outlined"
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <span style={{ color: '#888', fontSize: 12 }}>
            {currentNote.title.length + currentNote.content.length} characters | {currentNote.content.split(' ').filter(word => word.length > 0).length} words
          </span>
          <Button
            onClick={onSave}
            disabled={currentNote.title.trim() === '' && currentNote.content.trim() === ''}
            variant="contained"
            color="primary"
          >
            {currentNote.id ? 'Save Changes' : 'Create Note'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NoteEditor;
