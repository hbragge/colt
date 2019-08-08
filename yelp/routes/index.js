var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Campground = require("../models/campground");

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = req.body.user;
    newUser.username = req.body.username;
    if (!newUser.username) {
        req.flash("error", "Username not provided");
        res.redirect("/register");
        return;
    }
    if (newUser.adminCode === "secret123") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/campgrounds");
});

// user profile
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err || !foundUser) {
            req.flash("error", "Could not find user");
            res.redirect("/campgrounds");
            return;
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function(cgErr, foundCgs) {
            if (cgErr) {
                req.flash("error", "Error when finding campgrounds");
                res.redirect("/campgrounds");
                return;
            }
            res.render("users/show", {user: foundUser, campgrounds: foundCgs});
        });
    });
});

module.exports = router;
