import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// the cost of processing the salting data, 10 is the default
const saltOrRounds = 10;

// function for hashing and salting
export const passwordEncrypt = async (password) => {
  return await bcrypt.hash(password, saltOrRounds);
};

// generate a JWT that stores a user id
export const generateJWT = async (user) => {
  const signedJwt = await jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return signedJwt;
};

// validate the JWT
export const validateJWT = async (token: string) => {
  return await jwt.verify(token, process.env.JWT_SECRET);
};

export const hashPassword = async (password: string | Buffer) => {
  // hash the password
  const hashed = await bcrypt.hash(password, saltOrRounds);
  return hashed;
};
