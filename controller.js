(function(angular) {
  'use strict';

//================================================

angular.module('MyApp').component('tagList', {
  templateUrl: 'tagList.html',
  controller: TagListController,
  controllerAs: 'TagListctrl',
  bindings: {
    groupId: '@',
    onUpdate: '&'

  }
})


//------------------------------
function TagListController($scope,$timeout,$firebase,$firebaseArray) {

  // Initialize the Firebase SDK
 var config = {
    apiKey: "AIzaSyBPzkxzeLSZxEXii1aKY0KbBLxOjwy8On8",
    authDomain: "gersonlobos-resume-ac96c.firebaseapp.com",
    databaseURL: "https://gersonlobos-resume-ac96c.firebaseio.com",
    storageBucket: "gersonlobos-resume-ac96c.appspot.com",
    messagingSenderId: "379404230666"
  };
  firebase.initializeApp(config);


console.log("TagListController-->bindings:",this.groupId);

 var ctrl = this;

	var pathToTags= 'groups/'+this.groupId+'/tags/';
		var firebase_url=firebase.database().ref().toString()+pathToTags;
		var firebaseRef= firebase.database().ref(pathToTags);

		$scope.showData=false;
    ctrl.newTagValue='';

    ctrl.editedTag = null;

      	 $scope.TAGS=[]; 
     
     


 ctrl.TAGS = $firebaseArray( firebaseRef);
//console.log("TAGS HERE:",$scope.TAGS);

  $scope.$watch( angular.bind(ctrl,function(){

      return ctrl.TAGS;
    } ),function(newVal, oldVal){
        // now we will pickup changes to newVal and oldVal
        console.log('newVal: ',newVal);
        $scope.showData=true;
  });


    
//============================= new way with $firebaseArray
  ctrl.Add_Tag= function(){
    console.log('adding new tag.');
      var newTag = ctrl.newTagValue.trim();
    if (!newTag.length) {
      return;
    }
    // push to firebase
    ctrl.TAGS.$add({
      name: newTag,
      order: (ctrl.TAGS.length +1)
    });
    ctrl.newTagValue = '';

  };

  ctrl.removeTAG = function(TAG){
    console.log('ctrl.removeTAG:',TAG.order);

    if(TAG.order==ctrl.TAGS.length){
      console.log('removing last');
      ctrl.TAGS.$remove(TAG);
    }
    else{
      var index=TAG.order;
      ctrl.TAGS.$remove(TAG);
      console.log('removing middle');
      for (var i =index; i < ctrl.TAGS.length; i++) {
        ctrl.TAGS[i].order=i;
        ctrl.TAGS.$save(ctrl.TAGS[i]);
      }


    }
    ctrl.TAGS.$remove(TAG);
  };

    ctrl.doneEditing = function(TAG){
      console.log('doneEditing',TAG);
    ctrl.editedTag = null;
    var name = TAG.name.trim();
    if (name) {
      ctrl.TAGS.$save(TAG);
    } else {
      ctrl.removeTAG(TAG);
    }
  };

  ctrl.editTag = function(Tag){
    ctrl.editedTag = Tag;
    ctrl.originalTag = angular.extend({}, ctrl.editedTag);
  };

        
	}// end controller
})(window.angular);