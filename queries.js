const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_API,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
// get all users
const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};
// get user by id
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);
  // $ is a placeholder below instead of * in other systems
  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};
// create new user
const createUser = (request, response) => {
  const { name, email } = request.body;
  pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json(`User ${results.rows[0].id} added`);
    }
  );
};
// update user by id
// put is idempotent, meaning it can be called multiple times without changing the data unlike post
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;
  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User ${id} updated`);
    }
  );
};
// delete user by id
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User ${id} deleted`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
