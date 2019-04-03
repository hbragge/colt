var Campground = require("../models/campground"),
    Comment = require("../models/comment");

var mwObj = {};

function isOwner(req, res, next, c, id_name) {
    if (req.isAuthenticated()) {
        c.findById(req.params[id_name], function(err, foundCg) {
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

mwObj.isCgOwner = function(req, res, next) {
    return isOwner(req, res, next, Campground, "id");
}

mwObj.isCommentOwner = function(req, res, next) {
    return isOwner(req, res, next, Comment, "comment_id");
}

mwObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = mwObj;
