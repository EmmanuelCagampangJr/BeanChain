import React from 'react';
import { Grid, Card, CardContent, Chip, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const NoteList = ({ notes, categories, onEdit, onDelete, formatTimestamp }) => (
  <Grid container spacing={2}>
    {notes.map((note) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
        <Card sx={{ cursor: 'pointer', boxShadow: 2 }} onClick={() => onEdit(note)}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Chip label={categories[note.category]?.name || 'Uncategorized'} color="secondary" size="small" />
              <IconButton size="small" onClick={e => { e.stopPropagation(); onDelete(note.id); }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h6" fontWeight={600} gutterBottom noWrap>{note.title || 'Untitled Note'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>{note.content || 'No content'}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">{formatTimestamp(note.timestamp)}</Typography>
              <Typography variant="caption" color="text.secondary">{note.content.split(' ').filter(word => word.length > 0).length} words</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default NoteList;
