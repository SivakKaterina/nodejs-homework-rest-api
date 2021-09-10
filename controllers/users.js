const { findById,
  findByEmail,
  create,
  updateToken,} = require('../repositories/users');
const { HttpCode } = require('../helpers/constants');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
  try {
    const user = await findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email in use',
      });
    }
    const { email, subscription } = await create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      user: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
     const user = await findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }
    const { email, subscription } = user;
    const id = user.id;
    const payloload = { id, test: 'Hellow mamkin hacker' };
    const token = jwt.sign(payloload, SECRET_KEY, { expiresIn: '4h' });
    await updateToken(id, token);
    return res
      .status(HttpCode.OK)
      .json({
        status: 'success',
        code: HttpCode.OK,
        data: { token, user: { email, subscription } },
      });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
     const id = req.user.id;
    await updateToken(id, null);
    return res
      .status(HttpCode.NO_CONTENT)
      .json({});
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
   try {
    const { email, subscription } = req.user;
     return res
       .status(HttpCode.OK)
       .json({
      status: 'success',
      code: HttpCode.OK,
      user: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  current,
  register,
  login,
  logout,
}