var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

var cgSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var Campground = mongoose.model("Campground", cgSchema);

/*var cgs = [
    {name: "Creek", image: "https://www.chriscampground.com/images/homepage/ChrisCmpg_01.JPG", description: "Huge creek"},
    {name: "Ridge", image: "https://www.chriscampground.com/images/homepage/ChrisCmpg_01.JPG", description: "Beautiful"},
    {name: "Valley", image: "https://www.chriscampground.com/images/homepage/ChrisCmpg_01.JPG", description: "Amazing"},
]

cgs.forEach(function(cg) {
    Campground.create(
        {name: cg.name, image: cg.image},
        function(err, obj) {
            if (err) {
                console.log(err);
            }
        });
});*/

app.get("/", function(req, res) {
    res.render("landing");
});

// INDEX
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, cgs) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: cgs});
        }
    });
});

// CREATE
app.post("/campgrounds", function(req, res) {
    var newCg = {name: req.body.name, image: req.body.image};
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
    res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res) {
    res.send("JOO");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("app has started on port " + process.env.PORT);
});
