var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    mw = require("../middleware/middleware.js");

// INDEX
router.get("/", function(req, res) {
    Campground.find({}, function(err, cgs) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: cgs});
        }
    });
});

// CREATE
router.post("/", mw.isLoggedIn, function(req, res) {
    var newCg = req.body.campground;
    newCg.author = {
        id: req.user._id,
        username: req.user.username
    };
    if (!newCg.name) {
        req.flash("error", "Campground name not provided");
        res.redirect("/campgrounds");
        return;
    }
    Campground.create(newCg, function (err, createdCg) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + createdCg._id);
        }
    });
});

// NEW
router.get("/new", mw.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCg) {
        if (err || !foundCg) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: foundCg});
        }
    });
});

// EDIT
router.get("/:id/edit", mw.isCgOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCg) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCg});
        }
    });
});

// UPDATE
router.put("/:id", mw.isCgOwner, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCg) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", mw.isCgOwner, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, removedCg) {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany({_id: { $in: removedCg.comments } }, function(err) {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    });
});

module.exports = router;
