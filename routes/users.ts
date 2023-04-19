import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ users });
  } catch (error) {
    res.status(500).json(error);
  }

});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { fullname, email, picture, password } = req.body;
    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        picture
      },
    });

    if (!user) {
      res.status(400).send({ error: 'The user could not be created' });
    }

    res.json({
      data: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
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
  const { fullname, email, picture } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        fullname,
        email,
        picture,
      },
    });
    res.send({ data: updatedUser });
  } catch (error) {
    res.send({ error });
  }
});

export default router;
