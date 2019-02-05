// Imports
import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import swagger from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import ordersRoute from './API/routes/orders';
import itemsRoute from './API/routes/foodItems';
import usersRoute from './API/routes/users';

const apiDocs = YAML.load('./server/API/api_docs.yaml');

dotenv.config();
// port declaration
const port = process.env.PORT || process.env.SV_PORT;

// Instantiate Express
const app = express();

// initialize connection message
const message = () => {
  // eslint-disable-next-line no-console
  console.log(`server running on port ${port}`);
};

// instanciate imported middlewares
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors());
app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('client/public'));
app.use('/api/v1/api-docs', swagger.serve, swagger.setup(apiDocs));
app.use('/api/v1', ordersRoute);
app.use('/api/v1', itemsRoute);
app.use('/api/v1', usersRoute);

app.get('/api/v1', (req, res) => res.status(404).send({
  status: 'connection successful',
  message: 'Welcome to Fast Food Fast!',
}));

// / catch 404 and forward to error handler
app.all('*', (req, res) => {
  res.status(404).send({
    message: 'The page you are looking for is not found',
  });
});

// Set listener to port for API queries
app.listen(port, message());

// export app for testing purpose
export default app;
