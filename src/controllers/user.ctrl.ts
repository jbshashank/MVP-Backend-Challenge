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
        // create and return the json web token
        res.send({
          user,
          token: jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWTSECRET
          ),
        });
      }
    }
    next();
  },

  getUserMe: async (req, res, next) => {
    const user = req.user;
    const _user = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });
    return res.send(_user);
  },

  getUser: async (req, res, next) => {
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
      },
    });
    return res.send(user);
  },

  getUsers: async (req, res, next) => {
    const users = await prisma.user.findMany({});
    return res.send(users);
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
    return await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
  },

  getUserByUsername: async (req, res, next) => {
    var username = req.params.username;
    if (req.user) {
      var user = req.user;
    }

    await prisma.user.findFirst({});
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
      res.status(500).send({ error: err });
      // if there's a problem creating the account, throw an error
      // throw new Error('Error creating account');
    }
    next();
  },
};

export default userCtrl;
