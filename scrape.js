//Packages
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const accSid = process.env.TWILIO_ACC_SID;
const accAuth = process.env.TWILI0_ACC_AUTH;
const client = require("twilio")(accSid, accAuth);

const url = process.env.TWILI0_ACC_LINK;

const product = { name: "", price: "", link: "" };

//set interval
const handle = setInterval(scrape, 20000)

async function scrape() {
  //fetch the data
  const { data } = await axios.get(url);
  //load up the html document
  const $ = cheerio.load(data);
  const item = $(".page-wrapper");
  //grab the title
  product.name = $(item).find("h1 .base").text();
  //grab the link
  product.link = url;
  //grab the price
  const price = $(item).find(".price").text().replace(/[,₦]/g, "");
  const priceNum = parseInt(price);
  product.price = priceNum;
  console.log(product);

  //send sms
  if (price < 1571000) {
    client.messages.create({
      from: "+16813993123",
      to: "+2348102904585",
      body: `The price of ${product.name} went below ${price}. Please purchase at ${product.link} thanks`,
    })
    .then((message) => {
      console.log(message);
      clearInterval(handle);
    })
  }
}

scrape();
