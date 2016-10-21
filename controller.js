(function(angular) {
  'use strict';



//================================================

angular.module('MyApp').component('heroPetail', {
  templateUrl: 'heroDetails.html',
  controller: HeroDetailController,
  controllerAs: 'Componentctrl',
  bindings: {
    groupId: '='
  }
})
  .factory('dataService', function($http, $log, $q) {
  	console.log('-- dataService');
  		 


    return {
      getdata_Q: function(url) {
      	console.log('service get data')
      	  	var deferred = $q.defer();
		      	 $http.get(url+'.json?print=pretty').success(function(data) { 
		      	 //$log.error('check this out', data);
         	 deferred.resolve( data);

       }).error(function(msg, code) {

          deferred.reject(msg);
          $log.error(msg, code);
       });//end .error


       return deferred.promise;
      }
    }//end return object
  });

//------------------------------
function HeroDetailController($scope,$timeout,dataService) {
console.log("HeroDetailController-->bindings:",this.groupId);


	var pathToTags= 'groups/'+this.groupId.id+'/tags/';
		var firebase_url=firebase.database().ref().toString()+pathToTags;
		$scope.firebaseRef= firebase.database().ref(pathToTags);
		$scope.showData=false;

      	 $scope.TAGS=[]; 
     
		//dataService.getdata_Q(firebase_url).then(function(value) { $scope.DATA= value;});

		  $scope.user = {
		    name: 'awesome user'
		  };  




        $scope.FetchData= function(){

          	console.log('--- getAll ---');
			$scope.firebaseRef.once('value', function (snapshot) {
			  
			  	console.log('gerson values:', snapshot.val());
			    snapshot.forEach(function(childSnapshot) {
			    	var name= childSnapshot.val().name;
			    	var order=childSnapshot.val().order;
			    	//no push but unshift to keep order
			 	$scope.TAGS.unshift( {'name':name,'key':childSnapshot.key,'order':order,'editing':false});
			 	$scope.$apply();
			    });  

		    
			}).then(function(){
				$scope.showData=true;
				$scope.$apply();
				console.log('promised called');
			});//end firebaseRef.on('value'
        };//end FetchData


		$scope.editItem = function (item) {
        	item.editing = true;
   		 };
   		$scope.doneEditing = function (item) {//click away
   			item.editing = false;
   			Post_Edit(item.key,item.name,item.order); //(tagID,name,order);
    	};
    	$scope.enterPressed= function(keyEvent, item){
    		   	if (keyEvent.which === 13){
 			   console.log('Enter pressed..');
 				item.editing = false;

        	Post_Edit(item.key,item.name,item.order); //(tagID,name,order);
			}//end if (keyEvent.which === 13)
        	
    	};
         function Post_Edit(tagID,name,order){
         	console.log('calling firebase Post_Edit...');
         	console.log(tagID+' '+name+' '+order);
        	firebase.database().ref(pathToTags + tagID)
        	.set({
			    name: name,
			    order: order
			});
        };//end PostEdit
         $scope.Post_Delete=function(Tag, index){
        	console.log('calling firebase Post_Delete');
        	console.log('Tag:',Tag);
        	console.log('index:',index);

        	firebase.database().ref(pathToTags + Tag.key).remove();
        	$scope.TAGS.splice(index, 1);// use if not using 

        };//end PostEdit

        $scope.Post_Add= function(){

        	 console.log('calling firebase Post_Add');
		    

		    var updates = {};
		    var newTagKey = $scope.firebaseRef.push().key;

		    updates[pathToTags+ newTagKey] = {
			    name: $scope.newTagValue,
			    order:100
			  };

			 firebase.database().ref().update(updates);//add to database
			 							//Note: check if i can pass a call back and on success 
			 							// add it to array in ui. on fail then not. 

			 // push to add at then end. and unshift at the beginning 
			$scope.TAGS.unshift({name:$scope.newTagValue,key: newTagKey ,editing:false});
		    $scope.newTagValue = '';

        };//end 



        
	}// end controller
})(window.angular);