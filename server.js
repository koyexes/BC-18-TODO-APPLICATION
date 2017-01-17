/**
 * Created by koyexes on 1/16/2017.
 */
var {firebase} = require('./config');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var uid;
firebase.auth().signInWithEmailAndPassword("koyagabriel@gmail.com", "Sunday_1009").then((value) => {
    uid = value.uid;
}).catch(function(error) {
    console.log(error);
});
var database = firebase.database();
var ref = database.ref('boards/');

app.post('/board', (request,response) => {
    var title = request.body.title;
    ref.push({
        title,
    }).then((value) => response.send(value.key)).catch((error) => console.log(error));
});

app.delete('/board/:key', (request, response) => {
    var key = request.params.key;
    ref.child(key.toString()).remove().then((value) => {
        response.send(`Successfully deleted`);
    }).catch((error) => console.error(error));
});

app.post('/list', (request, response) => {
    var boardKey = request.body.key;
    var title = request.body.title;
    var cards = "empty";
    var listRef = ref.child(boardKey.toString() + '/list');
    listRef.push({
        title,
    }).then((value) => response.send(value.key)).catch((error) => console.log(error));
});

app.delete('/list/:key', (request, response) => {
    var boardKey = request.body.key;
    var listKey = request.params.key;
    ref.child(boardKey.toString() + '/list/' + listKey.toString()).remove().then((value) => {
        response.send(`Successfully deleted`);
    }).catch((error) => console.error(error));
});

app.post('/card')


app.listen(3000, () => {
   console.log('Started on port 3000');
});