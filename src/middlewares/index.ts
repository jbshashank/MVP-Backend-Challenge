import { Router } from "express";

import jwtMidWare from "./jwtMidware";

export default (router: Router) => {
  jwtMidWare(router);
};
