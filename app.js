const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

//config
require('dotenv/config');

//import routes
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');

//middleware & static files
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));

//routes
app.get('/', (req, res) => {
  res.send('Home page');
});
app.use(`/api/${process.env.VERSION}/products`, productRoute);
app.use(`/api/${process.env.VERSION}/carts`, cartRoute);
app.use(`/api/${process.env.VERSION}/orders`, orderRoute);

//Connect to DB
const dbURI = process.env.DB_CONNECTION;
mongoose.connect(
  dbURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    app.listen(process.env.PORT);
    console.log('Connected to DB');
  }
);
