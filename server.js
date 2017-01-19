/**
 * Created by koyexes on 1/16/2017.
 */
var {firebase} = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var hbs = require('hbs');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

var userObject = {};
var database = firebase.database();
var ref = database.ref('boards/');



app.get('/', (request, response) => {
    response.render('index.hbs', {});
} )

app.post('/login', (request, response) => {
   firebase.auth().signInWithEmailAndPassword(request.body.email.toString(), request.body.password.toString() ).then((value) => {
       userObject.email = value.email;
       userObject.uid = value.uid;
       response.status(200).send();
    }, (error) => {
       response.status(400).send({error});
   }).catch(function(error) {
        response.send('Wrong Username and Password');
    });
});


app.get('/home', (request, response) => {
     firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
         response.render('homepage.hbs', {email : user.email});
      }
    });

});
app.get('/logout', (request, response) => {
    firebase.auth().signOut();
    response.redirect('/')
    userObject = {};
});


app.post('/board', (request,response) => {
    var title = request.body.title;
    var {uid} = userObject;
    ref.push({
        title,
        uid
    }).then((value) => response.status(200).send({
        key: value.key,
        title,
    })).catch((error) => console.log(error));
});

app.get('/board/:key', (request, response) => {
    var key = request.params.key.toString();
    ref.child(key).once('value').then((snapshot) => {
        response.send({
            key,
            title: snapshot.val().title,
        });
    });
});

app.put('/board', (request, response) => {
   var key = request.body.key.toString();
   var title = request.body.title.toString();
   ref.child(key).update({title}).then((value) => {
       response.status(200).send({});
   }).catch((error) => console.error(error));
});

app.delete('/board/:key', (request, response) => {
    var boardKey = request.params.key.toString();
    ref.child(boardKey).remove().then((value) => {
        response.status(200).send(`Successfully deleted`);
    }).catch((error) => console.error(error));
});

app.post('/list', (request, response) => {
    var boardKey = request.body.boardKey;
    var title = request.body.title;
    var listRef = ref.child(boardKey + '/list');
    listRef.push({
        title,
    }).then((value) => response.status(200).send({
        key: value.key,
        title
    })).catch((error) => console.log(error));
});

app.get('/list/:key', (request, response) => {
    var boardKey = request.params.boardKey.toString();
    var listKey = request.params.key.toString();
    ref.child(boardKey + '/list/' + listKey).once('value').then((snapshot) => {
        response.send({
            key,
            title: snapshot.val().title,
        });
    });
});

app.put('/list', (request, response) => {
   var boardKey = request.body.boardKey.toString();
   var listKey = request.body.key.toString();
   var title = request.body.title.toString();
   ref.child(boardKey + '/list/' + listKey).update({title}).then((value) => {
       response.status(200).send({});
   }).catch((error) => console.error(error));
});

app.delete('/list/:key', (request, response) => {
    var boardKey = request.body.boardKey.toString();
    var listKey = request.params.key.toString();
    ref.child(boardKey + '/list/' + listKey).remove().then((value) => {
        response.status(200).send(`Successfully deleted`);
    }).catch((error) => console.error(error));
});

app.post('/card', (request, reponse) => {
     var boardKey = request.body.boardKey;
     var listKey = request.body.listKey;
     var title = request.body.title;
     var cardRef = ref.child(boardKey + '/list/' + listKey + '/card');
     cardRef.push({
         title
     }).then((value) => {
         response.send(`Card Created Successfully`);
     }).catch((error) => console.error(error));
});

app.delete('/card/:key', (request, reponse) => {
     var boardKey = request.body.boardKey.toString();
     var listKey = request.body.listKey.toString();
     var cardKey = request.params.key.toString();
     ref.child(boardKey + '/list/' + listKey + '/card/' + cardKey).remove().then((value) => {
         response.send(`Successfully Deleted`);
     }).catch((error) => console.error(error));

});


app.listen(3000, () => {
   console.log('Started on port 3000');
});

