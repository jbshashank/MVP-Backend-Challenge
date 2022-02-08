import user from "./user";
import products from "./products";
import midWares from "./../middlewares/jwtMidware";
import endpointsRoutes from "./endpoints";
import { Router } from "express";

const routes = (router: Router) => {
  midWares(router), user(router), products(router), endpointsRoutes(router);
};

export default routes;
