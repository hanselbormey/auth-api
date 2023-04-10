import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import users from './routes/users';
import auth from './routes/auth';

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CLIENT_APP_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use('/api/users', users);
app.use('/api/auth', auth);

app.listen(3001);
