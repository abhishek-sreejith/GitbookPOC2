const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const CART_TABLE = process.env.CART_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.post("/api/cart/add", async function (req, res) {
  const { userId, productId } = req.body;
  if (typeof userId !== "string") {
    console.log(typeof userId)
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof productId !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: CART_TABLE,
    Item: {
      userId: userId,
      productId: productId,
    },
  };
  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ userId, productId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not add to carts" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
