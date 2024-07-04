const { Router } = require("express");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const TodoModel = require("../../database/models/TodoModel");
const UserModel = require("../../database/models/UserModel");
const AccessTokens = require("../../services/auth/AccessToken");
const bcrypt = require("bcrypt");

const AuthRouter = Router();

// POST REQUESTS

AuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    return;
  }

  const user = await UserModel.scope("allData").findOne({ where: { email } });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
  }
  user.password = null;

  const myToken = AccessTokens.createAccessToken(user.id);
  // set Token in Response Header
  res.cookie("token", myToken, {
    httpOnly: true,
    // secure: true,
    // maxAge: 100000,
    // signed: True,
  });

  res.status(StatusCodes.OK).json({ user, tokens: { accessToken: myToken } });
});

AuthRouter.post("/signup", async (req, res) => {
  // const { email, password, name, profileImgUrl } = req.body;
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      name,
    });
    newUser.password = null;
    const myToken = AccessTokens.createAccessToken(newUser.id);

    res.cookie("token", myToken, {
      // set Token in Response Header
      httpOnly: true,
      // secure: true,
      // maxAge: 100000,
      // signed: True,
    });
    res
      .status(StatusCodes.OK)
      .json({ newUser, tokens: { accessToken: myToken } });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.CONFLICT).send(ReasonPhrases.CONFLICT);
    return;
  }
});

module.exports = { AuthRouter };
