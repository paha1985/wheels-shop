const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("../db");

const generateJwt = (id, login, role) => {
  return jwt.sign({ id, login, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class userController {
  async createUser(req, res, next) {
    try {
      const { login, password, staff_id } = req.body;

      if (!login || !password) {
        return next(
          ApiError.badRequest("Некорректный пользователь или пароль")
        );
      }

      const checkUser = await db.query("select * from users where login = $1", [
        login,
      ]);

      if (checkUser.rows[0]) {
        return next(
          ApiError.badRequest("Пользователь с таким логиом уже существует")
        );
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await db.query(
        "INSERT INTO users (login, password, staff_id) VALUES ($1, $2, $3) RETURNING *",
        [login, hashPassword, staff_id]
      );

      const token = generateJwt(
        newUser.rows[0]["user_id"],
        newUser.rows[0]["login"],
        newUser.rows[0]["staff_id"]
      );
      return res.json({ token });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await db.query("SELECT * FROM users");
      res.json(users.rows);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getOneUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await db.query("SELECT * FROM users where user_id = $1", [
        id,
      ]);
      return res.json(user.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async updateUser(req, res, next) {
    try {
      const id = req.params.id;
      const { role_id } = req.body;
      const user = await db.query(
        "UPDATE users set staff_id = $1 where user_id = $2",
        [role_id, id]
      );
      return res.json(user.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async deleteUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await db.query("DELETE FROM users where user_id = $1", [id]);
      return res.json(user.rows[0]);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const { login, password } = req.body;

      const usr = await db.query("SELECT * FROM users where login = $1", [
        login,
      ]);

      if (usr.rows[0] === undefined) {
        return next(ApiError.internal("Пользователь не найден"));
      }

      const checkPass = await db.query(
        "SELECT * FROM users where login = $1 and password = $2",
        [login, password]
      );

      let comparePassword = bcrypt.compareSync(password, usr.rows[0].password);

      if (!comparePassword) {
        return next(ApiError.internal("Неверный пароль"));
      }

      const token = generateJwt(
        usr.rows[0]["user_id"],
        usr.rows[0]["login"],
        usr.rows[0]["staff_id"]
      );
      return res.json({ token });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async check(req, res, next) {
    try {
      const token = generateJwt(req.user.id, req.user.login, req.user.role);
      return res.json({ token });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new userController();
