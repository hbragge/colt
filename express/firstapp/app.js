var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.send("Hi there");
});

app.get("/speak/:name", function(req, res) {
    var sayings = {
        "pig": "Oink",
        "cow": "Moo",
        "dog": "Woof woof"
    };
    var name = req.params.name;
    var what = sayings[name];
    if (what === undefined) {
        res.send("Unknown animal");
        return;
    }
    res.send("The " + name + " says " + what);
});

app.get("/repeat/:what/:times", function(req, res) {
    var msg = "";
    for (var i = 0; i < req.params.times; i++) {
        msg += " " + req.params.what;
    }
    res.send(msg);
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Listening to port " + process.env.PORT);
});
