const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000;
var http = require("http");


const request = require("request") ;
const cheerio = require("cheerio") ;
const fs = require("fs") ;
const sgMail = require("@sendgrid/mail");


sgMail.setApiKey(
  "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"
);

let number = 0;
let oldPageString;
const timeInterval = 5000;

const msg = {
  to: "thenewworld@seznam.cz",
  from: "ahoj@jaksemaas.cz",
  subject: "TKY MotherFucker",
  text: "https://www.thekey.vip/",
  html: "<a href=`https://www.thekey.vip/`>thekey</a>"
};



const makeMagic = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const currentTime = `${year}-${month}-${day}-${hour}:${minute}`;
  console.log(currentTime);

  if (number === 0) {
    request(
      "http://help.websiteos.com/websiteos/example_of_a_simple_html_page.htm",
      function(err, resp, html) {
        let $page = cheerio.load(html);
        $page(".view-id-media_video").remove();
        oldPageString = $page("body").html();
        fs.writeFile(`./file.html`, oldPageString, err => {
          if (err) return;
          console.log("File has been created");
          number++;
        });
      }
    );
  } else {
    request(
      "http://help.websiteos.com/websiteos/example_of_a_simple_html_page.htm",
      function(err, resp, dom) {
        let $page = cheerio.load(dom);
        $page(".view-id-media_video").remove();
        let domBody = $page("body").html();
        if (oldPageString !== domBody) {
          // console.log(oldPageString)
          console.log(oldPageString);
          fs.writeFile(`./file-${currentTime}.html`, domBody, err => {
            if (err) return;
            console.log("File has been created");
            number = 0;
            return;
          });

          sgMail.send(msg);
          return console.log("not the same");
          //
        }
        console.log("STIL THE SSAME");
      }
    );
  }
};

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/api', (req, res) => {
    console.log('1')
    makeMagic()
    return res.render('pages/index')
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }!!!!!!!!!!!!`))


setInterval(function() {
  http.get("http://nameless-plains-69824.herokuapp.com/api");
}, timeInterval); // every 5 minutes (300000)
