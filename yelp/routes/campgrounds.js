var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

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
router.post("/", isLoggedIn, function(req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCg = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: author
    };
    Campground.create(newCg, function (err, obj) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// NEW
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCg) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCg});
        }
    });
});

// EDIT
router.get("/:id/edit", isOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCg) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCg});
        }
    });
});

// UPDATE
router.put("/:id", isOwner, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCg) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", isOwner, function(req, res) {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function isOwner(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCg) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundCg.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;
