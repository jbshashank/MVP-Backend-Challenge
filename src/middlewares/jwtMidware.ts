import { Router } from "express";
import jwt from "jsonwebtoken";

const log = console.log;

// get the user info from a JWT
const getUser = (token: string) => {
  if (token) {
    try {
      // return the user information from the token
      return { error: false, msg: jwt.verify(token, process.env.JWT_SECRET) };
    } catch (err) {
      // if there's a problem with the token, throw an error
      return { error: true, auth: true, msg: "Session invalid" };
    }
  }
};

function jwtAuth(req, res, next) {
  const { method, url } = req;
  const excludeApis = [
    {
      method: "POST",
      url: "/users",
    },
    {
      method: "POST",
      url: "/users/login",
    },
  ];
  const isApiAuth = excludeApis.find(
    (callbackFn) =>
      callbackFn.method.toLocaleLowerCase() === method.toLocaleLowerCase() &&
      callbackFn.url === url
  );
  if (!isApiAuth) {
    if (req.headers && req.headers.authorization) {
      const auth = req.headers.authorization;

      const parts = auth.split(" ");
      const bearer = parts[0];
      const token = parts[1];
      if (bearer == "Bearer") {
        const user = getUser(token);
        if (!user.error) {
          req.user = user.msg;
          next();
        } else {
          res.send(user);
        }
      } else {
        res.send({ error: true, auth: true, msg: "Auth required" });
      }
    } else {
      res.send({ error: true, auth: true, msg: "Auth required" });
    }
  } else next();
}

export default function (router: Router) {
  router.use(jwtAuth);
}
