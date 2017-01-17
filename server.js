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
    var title = request.body.title.toString();
    ref.push({
        title,
    }).then((value) => response.send(value.key)).catch((error) => console.log(error));
});

app.delete('/board/:key', (request, response) => {
    var boardKey = request.params.key.toString();
    ref.child(boardKey).remove().then((value) => {
        response.send(`Successfully deleted`);
    }).catch((error) => console.error(error));
});

app.post('/list', (request, response) => {
    var boardKey = request.body.boardKey.toString();
    var title = request.body.title;
    var listRef = ref.child(boardKey + '/list');
    listRef.push({
        title
    }).then((value) => response.send(value.key)).catch((error) => console.log(error));
});

app.delete('/list/:key', (request, response) => {
    var boardKey = request.body.boardKey.toString();
    var listKey = request.params.key.toString();
    ref.child(boardKey + '/list/' + listKey).remove().then((value) => {
        response.send(`Successfully deleted`);
    }).catch((error) => console.error(error));
});

app.post('/card', (request, reponse) => {
     var boardKey = request.body.boardKey;
     var listKey = request.body.listKey;
     var title = request.body.title;
     var cardRef = ref.child(boardKey + '/list/' + listKey + '/card');
     cardRef.push({
         title
     });
});

app.delete('/card/:key', (request, reponse) => {

});


app.listen(3000, () => {
   console.log('Started on port 3000');
});