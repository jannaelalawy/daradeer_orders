require('dotenv').config();
const express = require('express');
const axios = require('axios');
const uuid = require("uuidv4");
const { mongoClient } = require('./mongo');
const bodyParser = require('body-parser')


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/orders', async (req,res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send('Systems Unavailable');

  /*
    amount,
    product_id
  */
  const amount = req.body.amount;

  // 0. call payments microservice
  const { data: paymentsResponse } = await axios.post('', {
    amount
  });

  if (!paymentsResponse.id) {
    return res.send("Could not complete your order");
  }

  // 1. create unique order id - use UUID V4 package
  const order_id = uuid();
 
  // create an orders document and insert to data
  const order = {
    order_id,
    amount,
    stripe_payment_id: paymentsResponse.id
  };
  await db.collection('orders').insertOne(order); 
  
  // 2. call /inventory microservice and pass the order_id
  const { data: inventoryResponse } = await axios.post('https://goweather.herokuapp.com/weather/california/', {
    product_id
  });
  // 3. call /shipments microservice and pass the order_id
  const { data: shipmentsResponse } = await axios.post('https://goweather.herokuapp.com/weather/california/', {
    order_id,
    product_id
  });

  // 4. call /notifications microservice and pass the order_id
  const { data: notificationResponse } = await axios.post('https://goweather.herokuapp.com/weather/california/', {
    order_id,
    product_id
  });

  // return the unique order id to client so they can check on status later
  return res.send({
    order_id
  });
});

app.listen(3000);
