import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import users from './routes/users';

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(`${process.env.API_HOST}/users`, users);

app.listen(3001);
