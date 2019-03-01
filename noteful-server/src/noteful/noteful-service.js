const NotefulService = {
  getAllFolders(knex) {
    return knex('folders').select('*');
  },

  getFolderById(knex, id) {
    return knex('folders')
      .select('*')
      .where('id', id)
      .first();
  },
  insertFolders(knex, newFolders) {
    return knex('folders')
      .insert(newFolders)
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  deleteFolder(knex, id){
    return knex('folders')
      .where({ id })
      .delete()
  },
  getAllNotes(knex) {
    return knex('notes').select('*');
  },
  getNoteById(knex, id) {
    return knex('notes')
      .select('*')
      .where('id', id)
      .first();
  },
  insertNotes(knex, newNote){
    return knex('notes')
      .insert(newNote)
      .returning('*')
      .then(rows =>{
        return rows[0];
      });
  },
  deleteNote(knex, id){
    return knex('notes')
      .where({ id })
      .delete()
  }
};

module.exports = NotefulService;
