(function(angular) {
  'use strict';



//================================================

angular.module('MyApp').component('heroPetail', {
  templateUrl: 'heroDetails.html',
  controller: HeroDetailController,
  controllerAs: 'Componentctrl',
  bindings: {
    groupId: '@'

  }
})


//------------------------------
function HeroDetailController($scope,$timeout,$firebase,$firebaseArray) {

  // Initialize the Firebase SDK
 var config = {
    apiKey: "AIzaSyBPzkxzeLSZxEXii1aKY0KbBLxOjwy8On8",
    authDomain: "gersonlobos-resume-ac96c.firebaseapp.com",
    databaseURL: "https://gersonlobos-resume-ac96c.firebaseio.com",
    storageBucket: "gersonlobos-resume-ac96c.appspot.com",
    messagingSenderId: "379404230666"
  };
  firebase.initializeApp(config);


console.log("HeroDetailController-->bindings:",this.groupId);

 var ctrl = this;

	var pathToTags= 'groups/'+this.groupId+'/tags/';
		var firebase_url=firebase.database().ref().toString()+pathToTags;
		$scope.firebaseRef= firebase.database().ref(pathToTags);
		$scope.showData=false;
    $scope.newTagValue='';

    $scope.editedTag = null;

      	 $scope.TAGS=[]; 
     
     


$scope.TAGS = $firebaseArray($scope.firebaseRef);
//console.log("TAGS HERE:",$scope.TAGS);

$scope.$watch('TAGS', function(){
    var total = 0;
    var order = 0;
    $scope.TAGS.forEach(function(TAG){
      //console.log('TAG',TAG)
  
      
      if (TAG.order) {
        total++;
      }
      //console.log('total:',total);
    });

    $scope.showData=true;
  }, true);


//============================= new way with $firebaseArray
  $scope.Add_Tag= function(){
      var newTag = $scope.newTagValue.trim();
    if (!newTag.length) {
      return;
    }
    // push to firebase
    $scope.TAGS.$add({
      name: newTag,
      order: 100
    });
    $scope.newTagValue = '';

  };

  $scope.removeTAG = function(TAG){
    $scope.TAGS.$remove(TAG);
  };

    $scope.doneEditing = function(TAG){
      console.log('doneEditing',TAG);
    $scope.editedTag = null;
    var name = TAG.name.trim();
    if (name) {
      $scope.TAGS.$save(TAG);
    } else {
      $scope.removeTAG(TAG);
    }
  };

  $scope.editTag = function(Tag){
    $scope.editedTag = Tag;
    $scope.originalTag = angular.extend({}, $scope.editedTag);
  };

        
	}// end controller
})(window.angular);