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


var database = firebase.database();
var ref = database.ref('boards/');
var userObject = {};



app.get('/', (request, response) => {
    response.render('index.hbs', {});
} )

app.post('/login', (request, response) => {

   firebase.auth().signInWithEmailAndPassword(request.body.email.toString(), request.body.password.toString() ).then((value) => {
       userObject.uid = value.uid;
       response.status(200).send();
    }, (error) => {
       response.status(400).send({error});
   }).catch(function(error) {
        response.send('Wrong Username and Password');
    });
});

app.post('/signup', (request, response) => {
    var email = request.body.signupEmail;
    var anotheremail = email;
    console.log(anotheremail);
   firebase.auth().createUserWithEmailAndPassword(email, request.body.signupPassword).then((value) => {
       response.status(200).send();
    }).catch ((error) => console.error(error));
});


app.get('/home', (request, response) => {
     firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
         response.render('homepage.hbs', {email : user.email, uid: user.uid});
      }
    });

});
app.get('/logout', (request, response) => {
    firebase.auth().signOut();
    response.redirect('/')

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
            title: snapshot.val().title
        });
    });
});

app.get('/board/all/:uid', (request,response) => {
   var uid = request.params.uid.toString();
   ref.orderByChild('uid').equalTo(uid).once('value').then((snapshot) => {
       response.status(200).send(snapshot.val())
   }).catch((error) =>console.log(error));
});

app.get('/board/:key/list', (request, response) => {
    var key = request.params.key.toString();
    ref.child(key + '/list').once('value').then((snapshot) => {
        response.status(200).send(snapshot.val());
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
    var dateOfCompletion =  request.body.dateOfCompletion;
    var description = request.body.description;
    var listRef = ref.child(boardKey + '/list');
    listRef.push({
        title,
        dateOfCompletion,
        description
    }).then((value) => response.status(200).send({
        key: value.key,
        title
    })).catch((error) => console.log(error));
});

app.get('/list/:key', (request, response) => {
    var boardKey = request.body.boardKey;
    var listKey = request.params.key;
    ref.child(boardKey + '/list/' + listKey).once('value').then((snapshot) => {
        response.send(
            snapshot.val()
        );
    }).catch((error) => console.log(error));
});


app.put('/list', (request, response) => {
   var boardKey = request.body.boardKey.toString();
   var listKey = request.body.key.toString();
   var title = request.body.title.toString();
   var dateOfCompletion =  request.body.dateOfCompletion;
   var description = request.body.description;
   ref.child(boardKey + '/list/' + listKey).update({title, dateOfCompletion, description}).then((value) => {
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

app.post('/task', (request, response) => {
     var boardKey = request.body.boardKey;
     var listKey = request.body.listKey;
     var title = request.body.title;
     var taskRef = ref.child(boardKey + '/list/' + listKey + '/task');
     taskRef.push({
         title,
         completed: "false"
     }).then((value) => {
         response.status(200).send({key: value.key});
     }).catch((error) => console.error(error));
});


app.get('/board/:boardKey/list/:listKey', (request, response) => {
    var boardKey = request.params.boardKey;
    var listKey = request.params.listKey;
    ref.child(boardKey + '/list/' + listKey + '/task').once('value').then((snapshot) => {
        response.status(200).send(snapshot.val());
    });
});

app.delete('/delete/:boardKey/list/:listKey/task/:key', (request, response) => {
     var boardKey = request.params.boardKey.toString();
     var listKey = request.params.listKey.toString();
     var taskKey = request.params.key.toString();
     ref.child(boardKey + '/list/' + listKey + '/task/' + taskKey).remove().then((value) => {
         response.status(200).send(taskKey);
     }).catch((error) => console.error(error));

});

app.put('/update/title/:boardKey/list/:listKey/task/:key', (request, response) => {
     var boardKey = request.params.boardKey.toString();
     var listKey = request.params.listKey.toString();
     var taskKey = request.params.key.toString();
     var title = request.body.title;
     ref.child(boardKey + '/list/' + listKey + '/task/' + taskKey).update({title}).then((value) => {
         response.status(200).send(title);
     }).catch((error) => console.error(error));

});


app.put('/update/completion/:boardKey/list/:listKey/task/:key', (request, response) => {
     var boardKey = request.params.boardKey.toString();
     var listKey = request.params.listKey.toString();
     var taskKey = request.params.key.toString();
     var completed = request.body.completed.toString();
     ref.child(boardKey + '/list/' + listKey + '/task/' + taskKey).update({completed}).then((value) => {
         response.status(200).send(completed);
     }).catch((error) => console.error(error));

});


app.listen(8080, () => {
   console.log('Started on port 3000');
});

