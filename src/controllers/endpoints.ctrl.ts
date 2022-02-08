// Implement /deposit endpoint so users with a “buyer” role
// can deposit only 5, 10, 20,
// 50 and 100 cent coins into their vending machine account

import prisma from "../db";

// Implement /buy endpoint (accepts productId,
// amount of products) so users with a
// “buyer” role can buy products with the money they’ve
// deposited. API should return total they’ve spent,
// products they’ve purchased and their change
// if there’s any (in an array of 5, 10, 20, 50 and 100 cent coins)

// Implement /reset endpoint so users with a “buyer” role
// can reset their deposit back to 0

const endpointsCtrl = {
  deposit: async (req, res, next) => {
    const user = req.user;
    const { amount } = req.body;
    if (user.role === "buyer") {
      const newUser = await prisma.user.update({
        data: {
          deposit: amount,
        },
        where: {
          id: user.id,
        },
      });
      res.send(newUser);
    } else {
      res.send({
        error: true,
        msg: "User must be a buyer.",
      });
    }
  },
  buy: async (req, res, next) => {
    const user = req.user;
    const { productId, amountOfProducts } = req.body;
    try {
      if (user.role === "buyer") {
        const userData = await prisma.user.findFirst({
          where: {
            id: +user.id,
          },
        });
        const product = await prisma.product.findFirst({
          where: {
            id: +productId,
          },
        });
        const totalCost = +product?.cost * +amountOfProducts;

        if (userData?.deposit > totalCost) {
          await prisma.user.update({
            data: {
              deposit: +userData?.deposit - totalCost,
            },
            where: {
              id: +user.id,
            },
          });
          await prisma.product.update({
            data: {
              amountAvailable: +product.amountAvailable - amountOfProducts,
            },
            where: {
              id: +product.id,
            },
          });
        }

        res.send({
          totalSpent: totalCost,
          product,
          change: +userData?.deposit - totalCost,
        });
      } else {
        res.send({
          error: true,
          msg: "User must be a buyer.",
        });
      }
    } catch (error) {
      res.status(500).send({ error: true, msg: error });
    }
  },
  reset: async (req, res, next) => {
    const user = req.user;
    if (user.role === "buyer") {
      const newUser = await prisma.user.update({
        data: {
          deposit: 0,
        },
        where: {
          id: user.id,
        },
      });
      res.send(newUser);
    } else {
      res.send({
        error: true,
        msg: "User must be a buyer.",
      });
    }
  },
};

export default endpointsCtrl;
