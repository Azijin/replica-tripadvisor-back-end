require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(formidable());

/* MAILGUN CONFIGURATION */
const api_key = process.env.MAILGUN_API_KEY; /* VOTRE CLÉ API */
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.get("/", (req, res) => {
  res.send("Server is up");
});

app.post("/", (req, res) => {
  console.log(req.fields);
  const firstname =
    req.fields.firstname.charAt(0).toUpperCase() +
    req.fields.firstname.substring(1).toLowerCase();
  const surname = req.fields.surname.toUpperCase();
  const subject = "Clone Tripadvisor - Notification d'inscription";
  const message = `Bonjour ${firstname} ${surname},\n\nJe vous remercie d'avoir rempli ce formulaire de démonstration.\n\nAucune information n'a été enregistrée.\n\nJe vous souhaite une bonne journée.\n\nA bientôt.\n\nArthur Chen\n\n`;
  /* CREATION DE L'OBJET DATA */
  const data = {
    from: `Replica of Tripadvisor by Arthur Chen <a.chenarthur@gmail.com>`,
    to: process.env.MAILGUN_EMAIL_ACCOUNT,
    subject: subject,
    text: message,
  };
  /* ENVOI DE L'OBJET VIA MAILGUN */
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      console.log(body);
      return res.json(body);
    }
    res.status(401).json(error);
  });
});

app.get("/", (req, res) => {
  res.send("server is up");
});

app.all("*", (req, res) => {
  res.status(404).send("No page found");
});
app.listen(process.env.PORT, () => {
  console.log("Server is started ");
});
