import express from 'express';
import bodyParser from 'body-parser';
import users from './routes/users';

const app = express();
app.use(bodyParser.json());
app.use('/api/users', users);

app.listen(3001);
