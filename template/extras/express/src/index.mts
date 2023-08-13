import express from 'express';
import ExampleRouter from './routes/example-router.mjs';

const PORT = process.env.PORT || 5454;

const Main = async () => {
  const App = express();
  App.use(express.json());

  App.use('/', ExampleRouter);

  App.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
};

Main().catch((error) => {
  console.error(error);
  process.exit(1);
});
