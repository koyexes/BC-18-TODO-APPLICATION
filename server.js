/**
 * Created by koyexes on 1/16/2017.
 */
var {firebase} = require('./config');
var uid;
firebase.auth().signInWithEmailAndPassword("koyagabriel@gmail.com", "Sunday_1009").then((value) => {
    uid = value.uid;
}).catch(function(error) {
    console.log(error);
});
var database = firebase.database();
// database.ref('lists').push({
//     title: "Monday Activities",
//     author: "Koya Gabriel",
//
// });
database.ref('lists/-Kad38-UDqDIhvW9Vghj/card').push({
    title: "noon prayers",
    Time:  "9:30"
});