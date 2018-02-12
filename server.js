var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var bodyParser = require("body-parser");
var proxy = httpProxy.createProxyServer();
var app = express();
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');
var pg = require('pg');
var fs = require('fs');
var session = require('client-sessions');
var xml = require('xml');
//var connectionString = "postgres://rxnwpssfwahbqo:e87e4bb9f0215f51a22bb19a60bbfe6c9ad8ce5f74dd037d0f1af8847f3936d6@ec2-54-163-245-80.compute-1.amazonaws.com:5432/ddj8sacq6hd0lf";
//var connectionString = "postgres://brshjyxsgjtxgc:koSrrBCITEn1QGQGSLlqp0_joX@ec2-54-83-41-183.compute-1.amazonaws.com:5432/d48tg7v0prdja0";
var connectionString = "postgres://NTTSDevDBAdmin:NTTS3cur1ty!@sasportal-dev-db.cqsuoarsx1vi.eu-west-1.rds.amazonaws.com:5432/NTTSDBDev001";

pg.defaults.ssl = true;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

//app.use('/', express.static(publicPath));

app.use(express.static(__dirname +'/public/'));




app.get('/api/getxml', function (request, response) {
    pg.connect(connectionString, function(err, client, done) {
        client.query("SELECT xmlfile FROM xmldocs WHERE id = '65346632432598'", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                //response.set('Content-Type', 'text/xml');
                //response.send(xml(result.rows[0]));

                response.send(result.rows[0]);
            }
        });
    });

});

app.post('/api/sign-in', function (request, response) {
    pg.connect(connectionString, function(err, client, done) {
        client.query("SELECT username, password FROM userdetails WHERE username = '"+request.body.username+"' AND password = '"+request.body.password+"'", function(err, result) {
            done();
            debugger;
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result.rows.length === 1);
            }
        });
    });
});

app.post('/api/admin-sign-in', function (request, response) {
    pg.connect(connectionString, function(err, client, done) {
        client.query("SELECT username, password FROM admindetails WHERE username = '"+request.body.username+"' AND password = '"+request.body.password+"'", function(err, result) {
            done();
            debugger;
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result.rows.length === 1);
            }
        });
    });
});

app.post('/api/save', function (request, response) {

    pg.connect(connectionString, function(err, client, done) {
        var id = request.body.id,
            username = request.body.username,
            application_name = request.body.appName,
            application_type = request.body.selectedAppType,
            domain_name = request.body.appFqdn,
            application_description = request.body.selectedAppType,
            general_questions = request.body.general_questions,
            criticality_questions = request.body.assessmentList,
            policy_design_questions = request.body.policyDefinition,
            criticality_check = request.body.assessCheck,
            policy_check = request.body.policyCheck,
            uris = request.body.uris,
            parameters = request.body.parameters,
            knownApp = request.body.knownAppOptions;

        client.query( "INSERT INTO appinformation VALUES ('"+id+"','"+username+"','"+application_name+"', '"+application_type+"', '"+domain_name+"' ,'"+application_description+"','"+general_questions+"', '"+criticality_questions+"','"+policy_design_questions+"', '"+criticality_check+"','"+policy_check+"' , '"+uris+"', '"+parameters+"' , '"+knownApp+"' )", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else { console.log("success");
                response.send(result);
            }
        });
    });
});

app.get('/api/get-saved-app/:username', function (request, response) {

    pg.connect(connectionString, function(err, client, done) { ;

        client.query( "SELECT * FROM appinformation WHERE username = '"+request.params.username+"'", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result.rows);
            }
        });
    });
});

app.post('/api/update-assessment1/:id', function (request, response) {

    pg.connect(connectionString, function(err, client, done) {
        var id = request.body.id,
            criticalityQuestions = request.body.assessmentList,
            criticalityCheck = request.body.assessCheck;

        client.query( "UPDATE appinformation SET criticality_questions = '"+ criticalityQuestions +"', criticality_check = '"+ criticalityCheck +"'WHERE id = '"+ id +"'", function(err, result){
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result);
            }
        });
    });
});

app.post('/api/mappingUpdate', function (request, response) {

    pg.connect(connectionString, function(err, client, done) {

        var qid= request.body.qid,
            title= request.body.title,
            sub_category= request.body.subCategory,
            severity= request.body.severity,
            category= request.body.category,
            cvss= request.body.cvss,
            mitigation_level= request.body.mitigationLevel,
            asm_mitigation= request.body.asmMitigation,
            comments= request.body.comments

        client.query( "INSERT INTO qualysasmmapping VALUES ('"+qid+"','"+title+"','"+sub_category+"', '"+severity+"', '"+category+"' ,'"+cvss+"','"+mitigation_level+"', '"+asm_mitigation+"','"+comments+"' )", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result);



            }
        });
    });
});

app.post('/api/saveMappedTable', function (request, response) {

    pg.connect(connectionString, function(err, client, done) {
        var mib =request.body.mib,
            file_name = request.body.file_name,
            mappedArray = request.body.mapped_report,
            username = request.body.username;

        client.query( "INSERT INTO mappedxmltable VALUES ('"+mib+"','"+username+"','"+file_name+"', '"+mappedArray+"' )", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else { console.log("success");
                response.send(result);
            }
        });
    });
});

app.post('/api/update-policy/:id', function (request, response) {

    pg.connect(connectionString, function(err, client, done) {
        var id = request.params.id.toString(),
            policy_design_questions = request.body.policyDefinition,
            policyCheck = request.body.policyCheck;

        client.query( "UPDATE appinformation SET policy_design_questions = '"+ policy_design_questions +"' ,policy_check = '"+ policyCheck +"'  WHERE id = '"+ id +"'", function(err, result){
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result);
            }
        });
    });
});

app.get('/api/get-all/:username', function (request, response) {

    pg.connect(connectionString, function(err, client, done) { console.log(request.params.username)

        client.query( "SELECT * FROM appdetails WHERE username = '"+request.params.username+"'", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result.rows);
            }
        });
    });
});

app.get('/api/get-saved-table/:username', function (request, response) {

    pg.connect(connectionString, function(err, client, done) {

        client.query( "SELECT * FROM mappedxmltable WHERE username = '"+request.params.username+"'", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result.rows);
            }
        });
    });
});

app.get('/api/get-matrix/', function (request, response) {

    pg.connect(connectionString, function(err, client, done) {

        client.query( "SELECT * FROM qualysasmmapping", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result.rows);
            }
        });
    });
});

app.get('/api/get-app-with-id/:id', function (request, response) {

    pg.connect(connectionString, function(err, client, done) { console.log(request.params.id);

        client.query( "SELECT  * FROM appdetails WHERE id = '"+request.params.id+"'", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result.rows);
            }
        });
    });
});

app.post('/api/update-vulnerability/:qid', function (request, response) {

    pg.connect(connectionString, function(err, client, done) {
        var qid = request.params.qid;
        var asmMitigation = request.body.asmMitigation;
        var category = request.body.category;
        var comments = request.body.comments;
        var cvss = request.body.cvss;
        var mitigationLevel = request.body.mitigationLevel;
        var severity = request.body.severity;
        var subCategory = request.body.subCategory;
        var title = request.body.title;


        client.query( "UPDATE qualysasmmapping SET title = '"+ title +"' ,sub_category = '"+ subCategory +"' ,severity = '"+ severity +"' ,mitigation_level = '"+ mitigationLevel +"' ,cvss = '"+ cvss +"' ,comments = '"+ comments +"' ,asm_mitigation = '"+ asmMitigation +"' ,category = '"+ category +"'  WHERE qid = '"+ qid +"'", function(err, result){
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result);
            }
        });
    });
});

app.post('/api/delete/:id', function (request, response) {

    var id = request.params.id;

    pg.connect(connectionString, function(err, client, done) {
        client.query( "DELETE FROM appinformation WHERE id = '" + id + "'", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result);
            }
        });
    });
});

app.post('/api/delete-matrix/:qid', function (request, response) {

    var qid = request.params.qid;


    pg.connect(connectionString, function(err, client, done) {
        client.query( "DELETE FROM qualysasmmapping WHERE qid = '"+request.params.qid+ "'", function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            }
            else {
                response.send(result);
            }
        });
    });
});

// We only want to run the workflow when not in production
if (!isProduction) {

    // We require the bundler inside the if block because
    // it is only needed in a development environment. Later
    // you will see why this is a good idea
    var bundle = require('./server/bundle.js');
    bundle();

    // Any requests to localhost:3000/build is proxied
    // to webpack-dev-server
      app.all('/build/*', function (req, res) {
        proxy.web(req, res, {
            target: 'http://localhost:8080'
        });
    });

}

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
});


app.use(function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});




app.listen(port, function () {
    console.log('Server running on port ' + port);
});

