import { Router } from 'express';

const ExampleRouter = Router();

ExampleRouter.get('/', (_req, res) => {
  res.send('Hello World!');
});

export default ExampleRouter;
