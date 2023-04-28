const db = require('../db')

class UserController{
  async createUser(req, res) {
    const {name, email, password} = req.body
    const newPerson = await db.query(
      'INSERT INTO person (name, email, password) values ($1, $2, $3) RETURNING *',
      [name, email, password])
    res.json(newPerson.rows[0])
  }

  async getUser(req, res) {
    const newPerson = await db.query('SELECT * FROM person')
    res.json(newPerson.rows)
  }

  async getOneUser(req, res) {
    const id = req.params.id
    const user = await db.query(
      'SELECT * FROM person WHERE id = $1',
      [id])
    res.json(user.rows[0])
  }

  async updateUser(req, res) {
    const { id, email, password } = req.body
    const user = await db.query(
      'UPDATE person set email = $1, password = $2 WHERE id = $3 RETURNING *',
      [email, password, id])
    res.json(user.rows[0])
  }

  async deleteUser(req, res) {
    const id = req.params.id
    const user = await db.query(
      'DELETE FROM person WHERE id = $1',
      [id])
    res.json(user.rows[0])
  }
}

module.exports = new UserController()
