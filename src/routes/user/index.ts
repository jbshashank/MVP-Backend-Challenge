import { Router } from "express";
import userCtrl from "../../controllers/user.ctrl";

const userRoutes = (router: Router) => {
  /**
   * create a user
   */
  router.route("/users").post(userCtrl.registerUser);

  /**
   * get all users
   */
  router.route("/users").get(userCtrl.getUsers);

  /**
   * get me
   */
  router.route("/users/me").get(userCtrl.getUserMe);

  /**
   * get a user
   */
  router.route("/users/:id").get(userCtrl.getUser);

  /**
   * edit user
   */
  router.route("/users/:id").put(userCtrl.editUser);

  // delete a user
  router.route("/users/:id").delete(userCtrl.deleteUser);

  /**
   * login a user
   */
  router.route("/users/login").post(userCtrl.checkUser);

  /**
   * logout all
   */
  router.route("/users/logout/all").post(userCtrl.logOutAll);

  /**
   * logout user
   */
  router.route("/users/logout").post(userCtrl.logOut);
};

export default userRoutes;
