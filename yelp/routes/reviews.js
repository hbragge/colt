var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Review = require("../models/review"),
    mw = require("../middleware/middleware.js");

router.get("/", function(req, res) {
    Campground.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} // latest first
    }).exec(function(err, cg) {
        if (err || !cg) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/index", {campground: cg});
    });
});

router.get("/new", mw.isLoggedIn, mw.isAlreadyReviewed, function(req, res) {
    Campground.findById(req.params.id, function(err, cg) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/new", {campground: cg});
    });
});

router.post("/", mw.isLoggedIn, mw.isAlreadyReviewed, function(req, res) {
    Campground.findById(req.params.id).populate("reviews").exec(function(err, cg) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review, function(err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.campground = cg;
            review.save();
            cg.reviews.push(review);
            cg.rating = calcAvg(cg.reviews);
            cg.save();
            req.flash("success", "Your review was saved");
            res.redirect("/campgrounds/" + cg._id);
        });
    });
});

router.get("/:review_id/edit", mw.isReviewOwner, function(req, res) {
    Review.findById(req.params.review_id, function(err, foundReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/edit", {
            campground_id: req.params.id,
            review: foundReview
        });
    });
});

router.put("/:review_id", mw.isReviewOwner, function(req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function(err, updatedReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Campground.findById(req.params.id).populate("review").exec(function(err, cg) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            cg.rating = calcAvg(cg.reviews);
            cg.save();
            req.flash("success", "Your review was updated");
            res.redirect("/campgrounds/" + cg._id);
        });
    });
});

router.delete("/:review_id", mw.isReviewOwner, function(req, res) {
    Review.findByIdAndRemove(req.params.review_id, function(err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function(err, cg) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            cg.rating = calcAvg(cg.reviews);
            cg.save();
            req.flash("success", "Your review was deleted");
            res.redirect("/campgrounds/" + req.params.id);
        });
    });
});

function calcAvg(reviews) {
    var sum = 0;
    if (!reviews || (reviews.length < 1)) {
        return sum;
    }
    reviews.forEach(function(rev) {
        sum += rev.rating;
    });
    return sum / reviews.length;
};

module.exports = router;
