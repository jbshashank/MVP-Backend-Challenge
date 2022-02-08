import prisma from "../db";

const productsCtrl = {
  createProduct: async (req, res, next) => {
    // auth
    const { amountAvailable, cost, productName, sellerId } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        amountAvailable: +amountAvailable,
        cost: +cost,
        productName,
        sellerId: +sellerId,
      },
    });
    return res.json({ product: newProduct });
  },
  getProducts: async (req, res, next) => {
    // get products
    const products = await prisma.product.findMany({});
    res.json({ products });
    next();
  },
  getProduct: async (req, res, next) => {
    // get product
    const product = await prisma.product.findFirst({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ product });
    next();
  },
  editProduct: async (req, res, next) => {
    // auth
    // edit product
    const { amountAvailable, cost, productName, sellerId } = req.body;
    try {
      const newProduct = await prisma.product.update({
        data: {
          amountAvailable: +amountAvailable,
          cost: +cost,
          productName,
          sellerId: +sellerId,
        },
        where: {
          id: req.params.id,
        },
      });
      return res.send(newProduct);
    } catch (error) {
      return res.send({ error });
    }
  },
  deleteProduct: async (req, res, next) => {
    // auth
    // delete product
    const product = await prisma.product.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.send(product);
  },
};

export default productsCtrl;
