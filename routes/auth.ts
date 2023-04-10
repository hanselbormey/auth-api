import express, { Request, Response } from 'express';
const url = require('url');
import jwt from 'jsonwebtoken';
import oauth2Client from '../lib/googleConfig';
import { COOKIE_NAME, JWT_SECRET, CLIENT_APP_URL } from '../config/constants';

const router = express.Router();

router.get('/google', async (req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    include_granted_scopes: true,
  });
  res.redirect(url);
});

router.get('/google/oauth2callback', async (req, res) => {
  // Receive the callback from Google's OAuth 2.0 server.
  if (req.url.startsWith('/google/oauth2callback')) {
    // Handle the OAuth 2.0 server response
    let q = url.parse(req.url, true).query;

    const { tokens } = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(tokens);

    const jwtGoogle = tokens.id_token || '';

    const idTokenGoogle = await oauth2Client.verifyIdToken({
      idToken: jwtGoogle as string,
    });

    const payload = idTokenGoogle.getPayload();

    const user = {
      name: payload?.name,
      email: payload?.email,
      picture: payload?.picture,
    };

    const token = jwt.sign({ data: user }, JWT_SECRET);

    res
      .cookie(COOKIE_NAME, token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
      })
      .redirect(CLIENT_APP_URL);
  }
});

router.get('/logout', async (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.send({
    msg: 'Logout successfuly',
  });
});

router.get('/session', async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);

    res.send(decoded);
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'The user is no authenticated.',
      },
    });
  }
});

export default router;
