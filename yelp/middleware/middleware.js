var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    Review = require("../models/review");

var mwObj = {};

function isOwner(req, res, next, c, id_name) {
    if (req.isAuthenticated()) {
        c.findById(req.params[id_name], function(err, foundObj) {
            if (err || !foundObj) {
                req.flash("error", "Object not found");
                res.redirect("back");
            } else {
                if (req.user.isAdmin || foundObj.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission for this action");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
}

mwObj.isCgOwner = function(req, res, next) {
    return isOwner(req, res, next, Campground, "id");
}

mwObj.isCommentOwner = function(req, res, next) {
    return isOwner(req, res, next, Comment, "comment_id");
}

mwObj.isReviewOwner = function(req, res, next) {
    return isOwner(req, res, next, Review, "review_id");
}

mwObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
}

mwObj.isAlreadyReviewed = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate("reviews").exec(function (err, foundCg) {
            if (err || !foundCg) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                var reviewFound = foundCg.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (reviewFound) {
                    req.flash("error", "You have already reviewed this campground");
                    return res.redirect("/campgrounds/" + foundCg._id);
                }
                next();
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
}

module.exports = mwObj;
