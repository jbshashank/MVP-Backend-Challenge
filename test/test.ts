import server from "../src/app";
import supertest from "supertest";
const requestWithSupertest = supertest(server);

describe("Test /deposit Endpoint", () => {
  it("POST /deposit should not allow an unauthenticated user to deposit a coin", async () => {
    const res = await requestWithSupertest.post("/api/deposit");

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBeTruthy();
  });
  it("POST /deposit should allow an authenticated user to deposit a coin", async () => {
    const _res = await requestWithSupertest.post("/api/users/login").send({
      username: "nnamdi",
      password: "nnamdi",
    });
    const token = _res.body.token;
    const res = await requestWithSupertest
      .post("/api/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 10,
      });

    expect(res.status).toEqual(200);
    expect(res.body.deposit).toBe(10);
  });
});

describe("Test /buy Endpoint", () => {
  it("POST The user must be a 'buyer' before the user can buy a product", async () => {
    const _res = await requestWithSupertest.post("/api/users/login").send({
      username: "chidume",
      password: "chidume",
    });
    const token = _res.body.token;
    const res = await requestWithSupertest
      .post("/api/buy")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: 10,
        amountOfProducts: 2,
      });

    expect(res.status).toEqual(200);
    expect(res.body.error).toBeTruthy();
    expect(res.body.msg).toBe("User must be a buyer.");
  });
  it("POST The user with a 'buyer' role can buy a product", async () => {
    const userRes = await requestWithSupertest.post("/api/users/login").send({
      username: "chidume",
      password: "chidume",
    });

    const __res = await requestWithSupertest
      .post("/api/products")
      .set("Authorization", `Bearer ${userRes.body.token}`)
      .send({
        productName: "Apple",
        amountAvailable: 100,
        cost: 4,
        sellerId: +userRes.body.token,
      });

    const product = __res.body.product;

    const _res = await requestWithSupertest.post("/api/users/login").send({
      username: "nnamdi",
      password: "nnamdi",
    });
    const token = _res.body.token;

    const res = await requestWithSupertest
      .post("/api/buy")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: product.id,
        amountOfProducts: 2,
      });

    expect(res.body.totalSpent).toBe(8);
  });
});

describe("Test /product Endpoint", () => {
  it("POST Create a new product", async () => {
    const userRes = await requestWithSupertest.post("/api/users/login").send({
      username: "chidume",
      password: "chidume",
    });

    const res = await requestWithSupertest
      .post("/api/products")
      .set("Authorization", `Bearer ${userRes.body.token}`)
      .send({
        productName: "Apple",
        amountAvailable: 100,
        cost: 4,
        sellerId: 23,
      });
    const product = res.body.product;

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(product.amountAvailable).toBe(100);
    expect(product.cost).toBe(4);
    expect(product.productName).toBe("Apple");
  });
});
