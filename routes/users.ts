import express, { Request, Response } from 'express';

import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, avatar, password } = req.body;
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        avatar,
        password,
      },
    });
    res.json({
      data: user,
    });
  } catch (error) {
    res.send(error);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });
    res.send({
      data: deletedUser,
    });
  } catch (error) {
    res.send(error);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstname, lastname, email, avatar } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstname,
        lastname,
        email,
        avatar,
      },
    });
    res.send({ data: updatedUser });
  } catch (error) {
    res.send({ error });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) res.json({ error: 'No user found' });

    res.json({
      data: user,
    });
  } catch (error) {
    res.send(error);
  }
});

export default router;
