var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

var cgSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String
});

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var Campground = mongoose.model("Campground", cgSchema);

/*
var cgs = [
    {name: "Creek", image: "https://www.chriscampground.com/images/homepage/ChrisCmpg_01.JPG", desc: "Huge creek"},
    {name: "Ridge", image: "https://www.chriscampground.com/images/homepage/ChrisCmpg_01.JPG", desc: "Beautiful"},
    {name: "Valley", image: "https://www.chriscampground.com/images/homepage/ChrisCmpg_01.JPG", desc: "Amazing"},
]

cgs.forEach(function(cg) {
    Campground.create(
        {name: cg.name, image: cg.image, desc: cg.desc},
        function(err, obj) {
            if (err) {
                console.log(err);
            }
        });
});
*/

app.get("/", function(req, res) {
    res.render("landing");
});

// INDEX
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, cgs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: cgs});
        }
    });
});

// CREATE
app.post("/campgrounds", function(req, res) {
    var newCg = {name: req.body.name, image: req.body.image, desc: req.body.desc};
    Campground.create(newCg, function (err, obj) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// NEW
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

// SHOW
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCg) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCg});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("app has started on port " + process.env.PORT);
});
