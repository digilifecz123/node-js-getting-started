const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
var http = require("http");

const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");

var number = 0;
var email = 0;
var oldPageString = null;
var newPageString = null;

const getTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const currentTime = `${year}-${month}-${day}-${hour}:${minute}:${second}`;
  return currentTime;
};

const makeMagic = () => {
  if (number === 0) {
    request(
      "http://www.thekey.vip",
      // 'http://help.websiteos.com/websiteos/example_of_a_simple_html_page.htm',
      function(err, resp, html) {
        let $page = cheerio.load(html);
        oldPageString = $page("footer").html();
        newPageString = $page("footer").html();
        // fs.writeFile(`./file.html`, oldPageString, err => {
        //   if (err) return;
        //   console.log("default file has been created");

        // });
        number++;
      }
    );
  } else {
    request(
      "http://www.thekey.vip",
      // 'http://help.websiteos.com/websiteos/example_of_a_simple_html_page.htm',
      function(err, resp, dom) {
        let $page = cheerio.load(dom);
        newPageString = $page("footer").html();

        if (oldPageString !== newPageString) {
          // fs.writeFile(`./file-${getTime()}.html`, newPageString, err => {
          //   if (err) return;
          //   console.log("new file has been created");
          //   return;
          // });
          if (email < 2) {
            sgMail.setApiKey(
              "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"
            );
            const msg = {
              to: "thenewworld@seznam.cz",
              from: "test@thekey.com",
              subject: "old page",
              text: `${oldPageString}`
            };
            const msgHtml = {
              to: "thenewworld@seznam.cz",
              from: "test@thekey.com",
              subject: "tky new",
              html: `${newPageString}`
            };
            sgMail.send(msgHtml);
            sgMail.send(msg);
            console.log("email send");
            email++;
          }
          return true;
          //
        }
        console.log("run out - web is the same");
      }
    );
  }
};

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/initialCall", (req, res) => {
    return setInterval(makeMagic, 90000);
    // return setInterval(makeMagic, 3000);
  })
  .get("/", (req, res) => {
    return res.send("<h1>I am alive</h1>");
  })
  .get("/old", (req, res) => {
    // I'm I alive endpoint
    return res.send(
      oldPageString
        ? `<h1>${getTime()}</h1>${oldPageString}`
        : "<h1>no content</h1>"
    );
  })
  .get("/new", (req, res) => {
    // I'm I alive endpoint
    return res.send(
      newPageString
        ? `<h1>${getTime()}</h1>${newPageString}`
        : "<h1>still no new page update</h1>"
    );
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}!`));

// this IFFEE is only for heroku
(function initialCall() {
  var init = 0;
  if (init === 0) {
    http.get("http://nameless-plains-69824.herokuapp.com/initialCall");
    init++;
  }
  setInterval(
    () => http.get("http://nameless-plains-69824.herokuapp.com/initialCall"),
    1740000
  ); //29 min
})();
