var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

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
    var newCg = {name: req.body.name, image: req.body.image, description: req.body.description};
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
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCg) {
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
