require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { mongoClient } = require('./mongo');

const app = express();

app.post('/orders', async (req,res) => {
  // const db = await mongoClient();
  // if (!db) res.status(500).send('Systems Unavailable');

  const { amount } = req.body;

  // 0. call payments microservice
  const { dataPayments } = await axios.post('', {
    data: { order_id }
  });

  if (!data.id) {
    return res.send("Could not complete your order");
  }
  // 1. create unique order id - use UUID V4 package
  const order_id = require("uuid/v4")
  order_id()
  
  // 2. call /inventory microservice and pass the order_id
  const { datainventory } = await axios.get('https://goweather.herokuapp.com/weather/california/', {
    data: { order_id }
  });
  // 3. call /shipments microservice and pass the order_id
  const { datashipments } = await axios.get('https://goweather.herokuapp.com/weather/california/', {
    data: { order_id }
  });

  // 4. call /notifications microservice and pass the order_id
  const { datanotification } = await axios.get('https://goweather.herokuapp.com/weather/california/', {
    data: { order_id }
  });

  // create an orders document and insert to data
  const order = {
    order_id,
    amount,
    stripe_payment_id: data.id
  };
  await db.collection('orders').insertOne(order);

  // return the unique order id to client so they can check on status later
  return res.send({
    order_id
  });
});

app.listen(3000);
