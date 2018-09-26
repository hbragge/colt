var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var friends = ["Jonne", "Kaapo", "Jari"];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.send("Hi there");
});

app.post("/add", function(req, res) {
    var name = req.body.name;
    friends.push(name);
    res.redirect("/friends");
});

app.get("/friends", function(req, res) {
    res.render("friends", {friends: friends});
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Listening to port " + process.env.PORT);
});
