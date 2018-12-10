var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var Blog = mongoose.model("Blog", blogSchema);

/*
Blog.create({
    title: "Test block",
    image: "https://frontpage-s3.ilcdn.fi/eac36a84744c211fc40c843ff7dd9c55.jpg",
    body: "Hello, my blog post"
});
*/

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// index
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// show
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: blog});
        }
    });
});

// new
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// create
app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server running at port " + process.env.PORT);
});
