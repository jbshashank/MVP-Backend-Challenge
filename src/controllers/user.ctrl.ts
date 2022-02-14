import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hashPassword } from "./../utils";
import prisma from "../db";

const userCtrl = {
  checkUser: async (req, res, next) => {
    var { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { username },
    });

    // if no user is found, throw an authentication error
    if (!user) {
      res.send({ error: true, msg: "User not found." });
    } else {
      // if the passwords don't match, throw an authentication error
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.send({ error: true, msg: "Password does not match." });
      } else {
        // check whether to see if the user is already looged in.
        if (process.env.NODE_ENV === "test") {
          res.send({
            user,
            token: jwt.sign(
              { id: user.id, role: user.role },
              process.env.JWTSECRET
            ),
          });
        } else if (user.loggedIn === 0) {
          await prisma.user.update({
            data: {
              loggedIn: 1,
            },
            where: {
              id: user.id,
            },
          });
          // create and return the json web token
          res.send({
            user,
            token: jwt.sign(
              { id: user.id, role: user.role },
              process.env.JWTSECRET
            ),
          });
        } else
          res.send({
            error: true,
            actionRoute: "/logoutall",
            msg: "There is already an active session using your account",
          });
      }
    }
    next();
  },

  getUserMe: async (req, res, next) => {
    try {
      const user = req.user;
      const _user = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });
      return res.send(_user);
    } catch (error) {
      res.status(500).send({
        error: true,
        msg: error,
      });
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: req.params.id,
        },
      });
      return res.send(user);
    } catch (error) {
      res.status(500).send({
        error: true,
        msg: error,
      });
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await prisma.user.findMany({});
      return res.send(users);
    } catch (error) {
      res.status(500).send({
        error: true,
        msg: error,
      });
    }
  },

  editUser: async (req, res, next) => {
    // auth
    // edit user

    var { username, deposit, role, id } = req.body;
    try {
      const user = await prisma.user.update({
        data: { username, deposit, role },
        where: {
          id: req.params.id,
        },
      });
      return res.send(user);
    } catch (err) {
      return res.send({ error: err });
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const user = await prisma.user.delete({
        where: {
          id: req.params.id,
        },
      });
      res.send({
        user,
        msg: "User deleted.",
      });
      next();
    } catch (error) {
      res.status(500).semd({
        error: true,
        msg: error,
      });
    }
  },

  getUserByUsername: async (req, res, next) => {
    var username = req.params.username;
    try {
      const _user = await prisma.user.findFirst({
        where: {
          username,
        },
      });
      res.send({
        user: _user,
      });
    } catch (error) {
      res.status(500).send({
        error: true,
        msg: error,
      });
    }
  },

  registerUser: async (req, res, next) => {
    const { username, password, deposit, role } = req.body;
    const hashed = await hashPassword(password);

    try {
      const user = await prisma.user.create({
        data: {
          username,
          password: hashed,
          deposit: +deposit,
          role,
          loggedIn: 1,
        },
      });
      // create and return the json web token
      res.send({
        user,
        token: jwt.sign({ id: user.id, role }, process.env.JWT_SECRET),
      });
    } catch (err) {
      res.status(500).send({ error: true, msg: err });
      // if there's a problem creating the account, throw an error
      // throw new Error('Error creating account');
    }
    next();
  },
  logOutAll: async function (req, res, next) {
    const { password, username } = req.body;
    try {
      const user = await prisma.user.findFirst({
        where: { username },
      });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.send({ error: true, msg: "Password does not match." });
      } else {
        await prisma.user.update({
          data: {
            loggedIn: 0,
          },
          where: {
            id: user.id,
          },
        });
        res.send({
          msg: "All users logged out.",
        });
      }
    } catch (error) {
      res.status(500).send({ error: true, msg: error });
    }
  },
  logOut: async function (req, res, next) {
    const { id } = req.body;
    console.log(req.user);
    try {
      const user = req.user;
      if (id === user.id) {
        await prisma.user.update({
          data: {
            loggedIn: 0,
          },
          where: {
            id: +user.id,
          },
        });
        res.send({
          msg: "User logged out.",
        });
      } else {
        res.send({
          error: true,
          msg: "Id mismatch.",
        });
      }
    } catch (error) {
      // console.log(error);
      res.status(500).send({ error: true, msg: error });
    }
  },
};

export default userCtrl;
