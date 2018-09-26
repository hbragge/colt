var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var cgs = [
    {name: "Creek", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104496f7c97ca2efb7b0_340.jpg"},
    {name: "Ridge", image: "https://pixabay.com/get/ef3cb00b2af01c22d2524518b7444795ea76e5d004b0144292f8c47ca5efbd_340.jpg"},
    {name: "Valley", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f7c97ca2efb7b0_340.jpg"},
]

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: cgs});
});

app.post("/campgrounds", function(req, res) {
    var obj = {name: req.body.name, image: req.body.image};
    cgs.push(obj);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("app has started on port " + process.env.PORT);
});
