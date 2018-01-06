const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
var http = require("http");

const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");


var number = 0;
var oldPageString;

const makeMagic = () => {

  // const date = new Date();
  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();
  // const hour = date.getHours();
  // const minute = date.getMinutes();
  

  // const currentTime = `${year}-${month}-${day}-${hour}:${minute}`;

  if (number === 0) {
    request(
      // "http://www.phung.cz",
      'http://help.websiteos.com/websiteos/example_of_a_simple_html_page.htm', 
      function(err, resp, html) {
        let $page = cheerio.load(html);
        $page(".view-id-media_video").remove();
        oldPageString = $page("body").html();
        // fs.writeFile(`./file.html`, oldPageString, err => {
        //   if (err) return;
        //   console.log("default file has been created");
   
        // });
        number++;
      }
    );
  } else {
    request(
      // "http://www.phung.cz",
      'http://help.websiteos.com/websiteos/example_of_a_simple_html_page.htm',
      function(err, resp, dom) {
        let $page = cheerio.load(dom);
        $page(".view-id-media_video").remove();
        let domBody = $page("body").html();

        if (oldPageString !== domBody && number === 1) {
          // fs.writeFile(`./file-${currentTime}.html`, domBody, err => {
          //   if (err) return;
          //   console.log("new file has been created");
          //   return;
          // });
          sgMail.setApiKey(
            "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"
          );
          const msg = {
            to: "thenewworld@seznam.cz",
            from: "ahoj@jaksemaas.cz",
            subject: "TKY new",
            text: `${domBody}`,
          };
          const msgHtml = {
            to: "thenewworld@seznam.cz",
            from: "ahoj@jaksemaas.cz",
            subject: "TKY new html",
            html: `${domBody}`,
          };
          sgMail.send(msgHtml);
          sgMail.send(msg);
          console.log('email send')
         return number++
          //
        }
        console.log('run out - web is the same')
      }
    );
  }
};

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => {
    return setInterval(makeMagic, 60000);

  })
  .get("/alive", (req, res) => {
    // I'm I alive endpoint
    return res.render('pages/index')

  })
  .listen(PORT, () => console.log(`Listening on ${PORT}!`));



// this IFFEE is only for heroku 
(function initialCall() {
  http.get("http://nameless-plains-69824.herokuapp.com");
})();

// to run the code localy `yarn start` and go to localhost:5000

