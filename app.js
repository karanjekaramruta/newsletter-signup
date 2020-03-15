const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //use this to access and load static files within signup.html

app.get("/",function(req,res){
    res.sendFile(__dirname +  "/signup.html");
})

app.post("/", function(req, res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = {
      members : [
        {
          email_address : email,
          status : "subscribed",
          merge_fields : {
            FNAME: firstName,
            LNAME : lastName
          }
        }
      ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us19.api.mailchimp.com/3.0/lists/1b7cdca7b9";
    const options = {
      method: "POST",
      auth: "amruta1:d0186f1257b500ba550101dd56a37232-us19"
    }

    const request = https.request(url, options, function(response){

      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }
      else {
        res.sendFile(__dirname + "/failure.html");
      }

      response.on("data", function(data){
        console.log(JSON.parse(data));
      })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
  res.redirect("/");
})

//process.env.PORT - this is needed so that heroku will assign dynamic port
//with || condition we can also run app on locally.
app.listen(process.env.PORT || 3000, function(){
  console.log("app is running on port 3000");
})

//api key
//d0186f1257b500ba550101dd56a37232-us19

//list ID
//1b7cdca7b9
