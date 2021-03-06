var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    mw = require("../middleware/middleware.js");

// CREATE
router.post("/", mw.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            req.flash("error", "Database error");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// NEW
router.get("/new", mw.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCg) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCg});
        }
    });
});

// EDIT
router.get("/:comment_id/edit", mw.isCommentOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCg) {
        if (err || !foundCg) {
            req.flash("error", "Campground for this comment not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// UPDATE
router.put("/:comment_id", mw.isCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:comment_id", mw.isCommentOwner, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
