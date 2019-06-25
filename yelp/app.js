var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    moment = require("moment"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

var indexRoutes = require("./routes/index"),
    cgRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments");

var defaultDbUrl = "mongodb://localhost:27017/yelp_camp",
    dbUrl = process.env.DATABASEURL || defaultDbUrl;

mongoose.connect(dbUrl, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
if (dbUrl === defaultDbUrl) {
    seedDB();
}

// passport config
app.use(require("express-session")({
    secret: "This is data for encryption",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    var url = req.url.split('/');
    if ((url.length === 2) && (url[1].length > 0)) {
        res.locals.page = url[1];
    }
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.moment = moment;
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", cgRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("app has started on port " + process.env.PORT);
});
