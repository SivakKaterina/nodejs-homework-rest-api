const { findById,
  findByEmail,
  create,
  updateToken,
  updateAvatar,
  updateTokenVerify,
  findByVerifyToken,
} = require('../repositories/users');
const { HttpCode } = require('../helpers/constants');
const jwt = require('jsonwebtoken');
const UploadAvatarService = require('../services/local-upload');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const EmailService = require('../services/email');
const CreateSenderNodemailer = require('../services/email-sender');

const register = async (req, res, next) => {
  try {
    const user = await findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email in use',
      });
    };
    const { email, subscription, avatar, verifyToken } = await create(req.body);
    try {
       const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderNodemailer(),
      );
      await emailService.sendVerifyEmail(verifyToken, email);
    } catch (error) {
      res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        error: error.message,
     })
      console.log(error.message);
    };

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      user: { email, subscription, avatar },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
     const user = await findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);

    if (!user || !isValidPassword  || !user.verify) {
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
const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS);
    const avatarUrl = await uploads.saveAvatar({ idUser: id, file: req.file });
    try {
      await fs.unlink(
        path.join(process.env.AVATAR_OF_USERS, req.user.avatarURL),
      );
    } catch (error) {
      console.log(error.message);
    }
    await updateAvatar(id, avatarUrl);
    res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarURL: avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
try {
  const user = await findByVerifyToken(req.params.verifyToken)
  console.log(user);
  if (user) {
    await updateTokenVerify(user._id, true, null);
     return res
       .status(HttpCode.OK)
       .json({
      status: 'success',
      code: HttpCode.OK,
     data: { message: 'Verification successful'},
    });
  }
  return res
   .status(HttpCode.NOT_FOUND)
   .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'User not found' });
} catch (error) {
   next(error);
  };
};

const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await findByEmail(req.body.email);
    if (user) {
      const {email, verify, verifyToken } = user;
      if (!verify) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNodemailer(),
        );
        await emailService.sendVerifyEmail(verifyToken, email);
        return res.status(HttpCode.OK).json({
          status: 'success',
          code: HttpCode.OK,
          data: { message: 'Verification email sent' },
        });
      }
      return res.statusHttpCode(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Verification has already been passed',
      });
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  current,
  register,
  login,
  logout,
  avatars,
  verify,
repeatEmailVerification,
};