const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
//To remove unnecessary info
require("dotenv").config()



const app = express();

//Setting path to access static files like css and images that are present locally on our system
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const emailAddress = req.body.email;

  //creating members which is an array of objects for storing audience info
  const data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  //converting data to string
  var jsonData = JSON.stringify(data);


//Storing api key, audience id and api server
  const MY_API_KEY = process.env.API_KEY

  const MY_AUDIENCE_ID = process.env.MY_AUDIENCE_ID_ID
  
  const MY_API_SERVER = process.env.API_SERVER
  
  //each audience has different audience id
  const url = "https://"+MY_API_SERVER+".api.mailchimp.com/3.0/lists/" + MY_AUDIENCE_ID;
  
     



  

  const options = {
    method: "POST",
    auth: "gauri24:"+ MY_API_KEY
  };

  //creating https request to mailchimp to add a subscriber on its external server
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    //receiving response or data from mailchimp as json format
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

//creating post on failure server, which as response redirects user to home page
app.post("/failure", function (req, res) {
  res.redirect("/");
});

//process.env.PORT makes hosting website assign a dynamic port.
//by using "process.env.PORT || 3000" we can now access our website on our local port 3000 as well as dynamic port assigned by heroku
app.listen(process.env.PORT || 3000, function () {
  console.log("Serving is running on port 3000");
});

