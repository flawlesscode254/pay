const express = require("express");
const { fetch } = require("cross-fetch");

require("dotenv").config()

const app = express();

app.use(express.json());

const getAccessToken = async (req, res, next) => {
  const key = "33LK2IISJhwPoR8RpajMXxdWZWCgA5tu";
  const secret = "M7goD385g6XvfYEW";
  const auth = new Buffer.from(`${key}:${secret}`).toString("base64");

  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    )
    .then((res) => {
      access_token = res.data.access_token;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};

app.post("/stk", getAccessToken, async (req, res) => {
  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
    body: JSON.stringify({
      BusinessShortCode: "174379",
      Password:
        "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3",
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: "1",
      PartyA: "254708374149",
      PartyB: "174379",
      PhoneNumber: "254708374149",
      CallBackURL: "https://mydomain.com/pat",
      AccountReference: "Test",
      TransactionDesc: "Test",
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => {
      console.log("reponse", resp);
      res.json(resp);
    })
    .catch((err) => {
      console.log("Error", err);
      res.json(err);
    });
});

app.get("/", (req, res) => {
  res.json({
    message: "Entry point",
  });
});

const port = process.env.PORT;

app.listen(port, async () => {
  console.log("App started");
});
