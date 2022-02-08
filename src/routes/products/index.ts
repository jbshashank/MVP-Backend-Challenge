import { Router } from "express";

import productsCtrl from "../../controllers/products.ctrl";

const productRoutes = (router: Router) => {
  router.route("/products").post(productsCtrl.createProduct);
  router.route("/products").get(productsCtrl.getProducts);
  router.route("/products/:id").get(productsCtrl.getProduct);
  router.route("/products/:id").put(productsCtrl.editProduct);
  router.route("/products/:id").delete(productsCtrl.deleteProduct);
};

export default productRoutes;
