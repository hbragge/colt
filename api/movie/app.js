var express = require("express");
var app = express();
var request = require("request");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("search");
});

app.get("/results", function(req, res) {
    var search = req.query.search;
    var url = "http://www.omdbapi.com/?apikey=thewdb&s=" + search;
    request(url, function(err, resp, body) {
        if (!err && (res.statusCode === 200)) {
            var data = JSON.parse(body);
            res.render("results", {data: data});
        } else {
            res.send("fail");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Listening to port " + process.env.PORT);
});
