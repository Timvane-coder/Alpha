const config = require('../../config');
const { DataTypes } = require('sequelize');

const NotesDB = config.DATABASE.define('notes', {
  note: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

async function getNotes(noteId = null) {
  if (noteId) {
    return await NotesDB.findByPk(noteId);
  }
  return await NotesDB.findAll();
}

async function saveNote(note) {
  const savedNote = await NotesDB.create({ note });
  return savedNote.id;
}

async function deleteNoteById(noteId) {
  return await NotesDB.destroy({
    where: { id: noteId }
  });
}

async function deleteAllNotes() {
  return await NotesDB.destroy({
    where: {},
    truncate: true
  });
}

module.exports = {
  NotesDB,
  getNotes,
  saveNote,
  deleteNoteById,
  deleteAllNotes
};
