var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var cgs = [
    {name: "Creek", image: "https://www.chriscampground.com/images/homepage/ChrisCmpg_01.JPG"},
    {name: "Ridge", image: "https://www.chriscampground.com/images/homepage/ChrisCmpg_01.JPG"},
    {name: "Valley", image: "https://www.chriscampground.com/images/homepage/ChrisCmpg_01.JPG"},
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
