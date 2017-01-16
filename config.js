/**
 * Created by koyexes on 1/16/2017.
 */
var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyD4P4l-bi_bf8c5vBx96yn-gkbNC1dpJsk",
    authDomain: "testing-f3c1e.firebaseapp.com",
    databaseURL: "https://testing-f3c1e.firebaseio.com",
    storageBucket: "testing-f3c1e.appspot.com",
    messagingSenderId: "1022776570490"
};
firebase.initializeApp(config);

module.exports = {firebase};