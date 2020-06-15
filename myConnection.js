const fetch = require('node-fetch');
const mysql = require('mysql');
const express = require(`express`);
const app = express();
const parser = require('fast-xml-parser');
const fs = require(`fs`);
const path = require(`path`);

    console.log("Yeet");

const PORT = 8000;

const rateIndex = ["AED","AUD","BGN","BRL","CAD","CHF","CNY","CZK","DKK","EGP","EUR","GBP","HRK","HUF","INR","JPY","KRW","MDL","MXN","NOK","NZD","PLN","RSD","RUB","SEK","THB","TRY","UAH","USD","XAU","XDR","ZAR"];

const xmlsettings = {
  attributeNamePrefix : "@_",
  attrNodeName: "attr", //default is 'false'
  textNodeName : "#text",
  ignoreAttributes : true,
  ignoreNameSpace : false,
  allowBooleanAttributes : false,
  parseNodeValue : true,
  parseAttributeValue : false,
  trimValues: true,
  cdataTagName: "__cdata", //default is 'false'
  cdataPositionChar: "\\c",
  parseTrueNumberOnly: false,
  arrayMode: false, //"strict"
  stopNodes: ["parse-me-as-string"]
};

app.use(`/static`, express.static(path.join(__dirname, 'public')));

app.listen(PORT, e => {});

app.get(`/`, (req, res) => {
  fs.readFile(`./index.html`, `utf-8`, (err, data) => {
    res.send(data);
  })
});

app.get(`/api`, (req, res) => {
  // Send out the fetch request to get the current rates
  fetch(`https://www.bnr.ro/nbrfxrates.xml`)
    .then(e => e.text())
    .then(body => {
      
      const dataJson = parser.parse(body, xmlsettings);

      const rates = {};
      const rate_array = dataJson.DataSet.Body.Cube.Rate;

      for ( let i = 0; i < rate_array.length; i++ ) {
        rates[rateIndex[i]] = rate_array[i];
      }

      // res.send(JSON.stringify(dataJson, null, 4)); 
      res.send(rates); 
    });
})

