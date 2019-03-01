const NotefulService = {
  getAllFolders(knex) {
    return knex('folders').select('*');
  },

  getById(knex) {
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
  }
};

module.exports = NotefulService;
