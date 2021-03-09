var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require("body-parser");

app.use(express.static("."));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var MaterialList = []; //array to hold the material information possibly break each item into its own list? or make 2D
var newestID = 0;

app.post('/add', function(req, res) {
    console.log("POST add page successful");

    var newMaterial = [newestID, req.body.name, req.body.color, req.body.volume, req.body.cost, req.body.date];
    newestID++;
    MaterialList.push(newMaterial);

    res.end('{"success":"Added Successfully", "status":200}');
});

app.delete('/delete', function(req, res) {
    console.log("DELETE material successful");
    var matNum = req.query.m;

    MaterialList.splice(matNum, 1);

    for (var i = matNum; i < MaterialList.length; i++) {
        MaterialList[i][0] = MaterialList[i][0] - 1;
    }
    newestID--;

    res.end('{"success":"Deleted Successfully", "status":200}');
});

app.get('/materials', function(req, res) {
    console.log("GET Materials page successful");
    var response = "<table id=\"materialTable\"><tbody>";

    for (var i = 0; i < MaterialList.length; i++) {
        response += "<tr tabindex=\"0\" id=\"" + MaterialList[i][0] 
            + "\"><td><span class=\"dot\" style=\"background-color:" + MaterialList[i][2] 
            + "\"></span></td><td><h2>" + MaterialList[i][1] + "</h2><p>" + MaterialList[i][3] 
            + " m3</p></td></tr>";
    }
    response += "</tbody></table>";

    res.send(response);
});

app.get('/price', function(req, res) {
    console.log("GET price page successful");
    var response = "Total Cost: $";
    var total = 0;

    for (var i = 0; i < MaterialList.length; i++) {
        total += MaterialList[i][4] * MaterialList[i][3];
    }
    response += total;

    res.send(response);
});

app.get('/info', function(req, res) {
    console.log("GET Info page successful");
    var mat = req.query.m;
    var response = "<form name=\"MaterialForm\" id=\"" + MaterialList[mat][0] + "\">";

    response += "<label for=\"nName\">Name: <label><input type=\"text\" id=\"mName\" name=\"mName\" value=\"" + MaterialList[mat][1] + "\"><br>";
    response += "<label for=\"mColor\">Color: <label><input type=\"color\" id=\"mColor\" name=\"mColor\" value=\"" + MaterialList[mat][2] + "\"><br>";
    response += "<label for=\"mVolume\">Volume (m<sup>3</sup>): <label><input type=\"number\" id=\"mVolume\" name=\"mVolume\" min=\"0\" step=\"0.01\" value=\"" + MaterialList[mat][3] + "\"><br>";
    response += "<label for=\"mCost\">Cost: <label><input type=\"number\" id=\"mCost\" name=\"mCost\" min=\"0\" step\"0.01\" value=\"" + MaterialList[mat][4] + "\"><br>";
    response += "<label for=\"mDate\">Delivery Date: <label><input type=\"date\" id=\"mDate\" name=\"mDate\" value=\"" + MaterialList[mat][5] + "\">";

    response += "</form>";

    res.send(response);
});

app.post('/info', function(req, res) {
    console.log("POST Info page successful");
    var matID = req.body.id;
    
    MaterialList[matID][1] = req.body.name;
    MaterialList[matID][2] = req.body.color;
    MaterialList[matID][3] = req.body.volume;
    MaterialList[matID][4] = req.body.cost;
    MaterialList[matID][5] = req.body.date;

    res.end('{"success":"Updated Successfully", "status":200}');
});

app.listen(8080, function() {
	console.log('Server is Running...');
});