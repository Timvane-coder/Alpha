const { Alpha, mode, getNotes, saveNote, deleteNoteById, deleteAllNotes } = require("../lib")

Alpha({
    pattern: "note",
    desc: 'Save a new note and return its ID',
    type: "note",
    fromMe: mode
  }, async (message, match) => {
    const note = match || message.reply_message.text;
    if (!note) return await message.reply('_Please provide a new text note to save_');
    
    try {
      const noteId = await saveNote(note);
      return await message.reply(`Note saved successfully with ID: ${noteId}`);
    } catch (error) {
      return await message.reply('Failed to save note.');
    }
  });
  
  Alpha({
    pattern: "getnotes",
    desc: 'Get a note by ID or all notes',
    type: "note",
    fromMe: mode
  }, async (message, match) => {
    const noteId = parseInt(match || message.reply_message.text, 10);
    
    try {
      const notes = isNaN(noteId) ? await getNotes() : [await getNotes(noteId)];
      
      if (notes.length === 0 || !notes[0]) return await message.reply('No notes found.');
      
      const notesText = notes.map(note => `ID: ${note.id}\nNote: ${note.note}`).join('\n\n');
      return await message.reply(notesText);
    } catch (error) {
      return await message.reply('Failed to retrieve notes.');
    }
  });
  
  Alpha({
    pattern: "dnoteid",
    desc: 'Delete a note by ID',
    type: "note",
    fromMe: mode
  }, async (message, match) => {
    const noteId = parseInt(match || message.reply_message.text, 10);
    if (isNaN(noteId)) return await message.reply('_Please provide a valid note ID to delete_');
  
    try {
      const result = await deleteNoteById(noteId);
      if (result === 0) return await message.reply('Note not found.');
      
      return await message.reply('Note deleted successfully.');
    } catch (error) {
      return await message.reply('Failed to delete note.');
    }
  });
  
  Alpha({
    pattern: "dallnotes",
    desc: 'Delete all notes',
    type: "note",
    fromMe: mode
  }, async (message) => {
    try {
      await deleteAllNotes();
      return await message.reply('All notes deleted successfully.');
    } catch (error) {
      return await message.reply('Failed to delete all notes.');
    }
  });