import endpointsCtrl from "../../controllers/endpoints.ctrl";
import { Router } from "express";

const endpointsRoutes = (router: Router) => {
  router.route("/deposit").post(endpointsCtrl.deposit);
  router.route("/buy").post(endpointsCtrl.buy);
  router.route("/reset").post(endpointsCtrl.reset);
};

export default endpointsRoutes;
