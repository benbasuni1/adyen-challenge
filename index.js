const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { uuid } = require("uuidv4");
const { Client, Config, CheckoutAPI } = require("@adyen/api-library");
const app = express();

// Express Middleware and .env Config
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
dotenv.config({ path: "./.env"});

// Adyen Boilerplate Config
const config = new Config();
config.apiKey = process.env.API_KEY;
const client = new Client({ config });
client.setEnvironment("TEST");
const checkout = new CheckoutAPI(client);

// Handlebars Config
app.engine("handlebars",
  hbs({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

app.set("view engine", "handlebars");
const paymentDataStore = {};

// GET Payment methods
app.get("/", async (req, res) => {
  try {
    const response = await checkout.paymentMethods({
      channel: "Web",
      merchantAccount: process.env.MERCHANT_ACCOUNT,
    });
    res.render("payment", {
      clientKey: process.env.CLIENT_KEY,
      response: JSON.stringify(response),
    });
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

// POST Initiate Payment
app.post("/api/initiatePayment", async (req, res) => {
  try {
    const orderRef = uuid();
    const response = await checkout.payments({
      amount: { currency: "EUR", value: 1000 },
      reference: orderRef,
      merchantAccount: process.env.MERCHANT_ACCOUNT,
      channel: "Web",
      additionalData: { allow3DS2: true, },
      returnUrl: `http://https://adyen-challenge.herokuapp.com/api/handleShopperRedirect?orderRef=${orderRef}`,
      // returnUrl: `http://https://localhost:8080/api/handleShopperRedirect?orderRef=${orderRef}`,
      browserInfo: req.body.browserInfo,
      paymentMethod: req.body.paymentMethod,
    });

    let resultCode = response.resultCode;
    let action = null;

    if (response.action) {
      action = response.action;
      paymentDataStore[orderRef] = action.paymentData;
    }

    console.log(res);
    res.json({ resultCode, action });
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

// Handle Redirects
app.all("/api/handleShopperRedirect", async (req, res) => {
  const payload = {};
  payload["details"] = req.method === "GET" ? req.query : req.body;

  const orderRef = req.query.orderRef;
  payload["paymentData"] = paymentDataStore[orderRef];
  delete paymentDataStore[orderRef];

  try {
    const response = await checkout.paymentsDetails(payload);
    switch (response.resultCode) {
      case "Authorised":
        res.redirect("/success");
        break;
      case "Pending":
      case "Received":
        res.redirect("/pending");
        break;
      case "Refused":
        res.redirect("/failed");
        break;
      default:
        res.redirect("/error");
        break;
    }
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.redirect("/success");
  }
});

// Handle submitting additional details
app.post("/api/submitAdditionalDetails", async (req, res) => {
  const payload = {};
  payload["details"] = req.body.details;
  payload["paymentData"] = req.body.paymentData;

  try {
    const response = await checkout.paymentsDetails(payload);
    let resultCode = response.resultCode;
    let action = response.action || null;

    res.json({ action, resultCode });
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

// Render correct views on API
app.get("/success", (req, res) => res.render("success"));
app.get("/pending", (req, res) => res.render("pending"));
app.get("/error", (req, res) => res.render("error"));
app.get("/failed", (req, res) => res.render("failed"));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
