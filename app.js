(function () {
  'use strict';

    angular
      .module('MyApp',['ngMaterial','firebase'])
      .config(function() {

                    // Initialize the Firebase SDK
    
       var config = {
          apiKey: "AIzaSyBPzkxzeLSZxEXii1aKY0KbBLxOjwy8On8",
          authDomain: "gersonlobos-resume-ac96c.firebaseapp.com",
          databaseURL: "https://gersonlobos-resume-ac96c.firebaseio.com",
          storageBucket: "gersonlobos-resume-ac96c.appspot.com",
          messagingSenderId: "379404230666"
        };
     
        firebase.initializeApp(config);

       
        
      })
      .controller('AppCtrl', function( $scope,$mdDialog) {

         $scope.customFullscreen = false;
        $scope.status = '  ';
        $scope.message='';

            $scope.showAdvanced = function() {
              console.log("showAdvanced");
            $mdDialog.show({
              controller: DialogController,
              templateUrl: 'loginDIALOG.html',
              parent: angular.element(document.body),
              
              clickOutsideToClose:false,
              fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });
          };

            function DialogController($scope, $mdDialog) {
               $scope.message='';

              $scope.hide = function() {
                $mdDialog.hide();
              };

              $scope.createAccount = function(user) {
                console.log('create Account',user);
                //$mdDialog.cancel();
                //$mdDialog.hide();
                firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorCode,errorMessage);
                  document.getElementById("logInMessage").innerHTML=''+errorMessage;
                  // ...
                }); 
                    firebase.auth().onAuthStateChanged(function(user) {
                    if(user){
                      console.log('I have a user');
                      $mdDialog.hide();

                    }else{

                      console.log('I dont have a user');
                    }

                  });

              };

              $scope.logme = function(user) {
                console.log('logme triggered');
                console.log('user: ',user);
                
                firebase.auth().signInWithEmailAndPassword(user.email, user.password).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log('error in LogIN',errorCode,errorMessage)
                  document.getElementById("logInMessage").innerHTML=''+errorMessage;
                  // ...
                });

                 firebase.auth().onAuthStateChanged(function(user) {
                    if(user){
                      console.log('I have a user');
                      $mdDialog.hide();

                    }

                  });


               // $mdDialog.hide();
              };



            };

//----------------------------------------------------------------------
        // sign in with email and password


        $scope.signOut=function(){
          

          firebase.auth().signOut().then(function() {
            // Sign-out successful.
            $scope.showAdvanced();
            console.log('logged out')
          }, function(error) {
            // An error happened.
          });
        };









          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              console.log('user is logged in',user.email);
              
            } else {
              // No user is signed in.
              $scope.showAdvanced();
            //$scope.clickHandle('gerson.lobos@gmail.com','loco');

            }
          });
       







      });// end controller
})();


/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
**/