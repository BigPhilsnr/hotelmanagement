var app = angular.module('myApp', ['ngRoute','angularUtils.directives.dirPagination']);
app.config(function($routeProvider,$locationProvider) {
    $routeProvider
    .when("/contact", {
        templateUrl : "contactus.html",
        controller : "Contact"
    })
    .when("/bookings", {
        templateUrl : "b.html",
        controller : "Booking"
    })
    .when("/cms", {
        templateUrl : "cms.html",
        controller : "myCms"
    })
    .when("/emp", {
        templateUrl : "employee.html",
        controller : "emp"
    })
    .when("/", {
        templateUrl : "room.html",
        controller : "myCtrl"
    });
  
});
 app.filter('wraps', function () {
    return function (value) {
        return "uploads/"+value; 
    };
});
app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                   
                                             
                        var block = loadEvent.target.result.split(";");
                        var contentType = block[0].split(":")[1];
                        var b64Data = block[1].split(",")[1];

                        contentType = contentType || '';
                       var  sliceSize =  512;
                
                        var byteCharacters = atob(b64Data);
                        var byteArrays = [];
                
                        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                            var slice = byteCharacters.slice(offset, offset + sliceSize);
                
                            var byteNumbers = new Array(slice.length);
                            for (var i = 0; i < slice.length; i++) {
                                byteNumbers[i] = slice.charCodeAt(i);
                            }
                
                            var byteArray = new Uint8Array(byteNumbers);
                
                            byteArrays.push(byteArray);
                        }
                
                      var blob = new Blob(byteArrays, {type: contentType});
                    
                      return blob;

                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);
app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
              //Also remove . and , so its gives a cleaner result.
              if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                lastspace = lastspace - 1;
              }
              value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

app.controller('Booking',function($scope,$http,Customer){

    $scope.room={};
    $scope.user={};
    $scope.status = [
        {'id': 1, 'label': 'Yes'},
        {'id': 0, 'label': 'No'},
       
    ]
    $scope.logOut=function(){
        localStorage.removeItem('user');
        document.getElementById("loader-wrapper").setAttribute("class", "ng-show");
    }
    $scope.cancel=function(){
        $scope.currentBooking.paid=0;
        jQuery.post('updateBooking',$scope.currentBooking,function(ds){
            $scope.currentBooking.paid=0;
            swal('Success','booking updated','success')
        })
    }
    $scope.approve=function(){
        $scope.currentBooking.paid=1;
        jQuery.post('updateBooking',$scope.currentBooking,function(ds){
           
            swal('Success','booking updated','success')
        })
    }
    $scope.update=function(){
        if ($scope.userc._id) {
            jQuery.post('updateUser',{id:$scope.userc._id,user:$scope.userc},function(data){
            swal('Success','user updated','success')
        }); 
        }
       
    }
    var urld="getUsers"
	$http.get(urld).then(function(response){ 
       var data=response.data;
       $scope.users=data;;
         
    });

    $http.get('ball').then(function(response){
    $scope.bookings=response.data;
    });
    $scope.userc={};

    $scope.getUser=function(user){
        $scope.userc=user;
    }

    $scope.viewBooking=(booking)=>{
      
       $scope.currentBooking=booking;
       $scope.loading=false;
    $scope.user=   _.find(Customer.users, { '_id': booking.userId });
    $scope.room=   _.find(Customer.rooms, { '_id': booking.roomId });
    
   
    }
});
app.controller('emp',function($scope,$http,Customer){
    $scope.employee={};
    if ($scope.employee.password) {
        if ($scope.employee.password!=$scope.employee.password2) {
            $scope.isValid=false;
        }else{
            $scope.isValid=true;
        }
    }
    $scope.getUser=function(em){
        $scope.employee=em;
        $scope.employee.password2=$scope.employee.password;
    }
    $scope.status = [
        {'id': 1, 'label': 'Yes'},
        {'id': 2, 'label': 'No'},
       
    ]
    $http.get('getEmployees').then(function(res){

    $scope.employees=res.data;
    })
    $scope.createEmployee = function() {
        if ($scope.employee.password!=$scope.employee.password2) {
            $scope.isValid=false;
            swal('Error','passwords dont match','error')
        }else{
            toastr.success('Processing', 'Saving.. ', {timeOut: 5000});  
        $http.post('saveEmployee',$scope.employee).then(function(em){
                if (em.data.success==1) {
                      swal(
                    'Success',
                    'Details updated successfully',
                    'success'
                  );
                 
                  if ($scope.employee._id) {
                    $scope.employee={}; 
                }else{
                    var dbv= $scope.employees;
                    var emx=$scope.employee
                dbv.push(emx);
                    $scope.employee={};  
                    $scope.employees=dbv;  
                }
                }else{
                    swal('Error',em.data.message,'error')  
                }
              
            })
        }
         
        
        
       

    }
    $scope.create=function(){


    }
})
app.controller('myCms',function($scope,$http){

    $scope.updateBanner = function() {
        toastr.success('Processing', 'Updating.. ', {timeOut: 5000});
     var myForm = document.getElementById('banner');
        formData = new FormData(myForm );
       
        jQuery.ajax({
       url: 'saveBanner',
       data: formData,
       cache: false,
       contentType: false,
       processData: false,
       method: 'POST',
       type: 'POST', // For jQuery < 1.9
       success: function(data){
        swal(
            'Success',
            'Details updated successfully',
            'success'
          );
    }
    })
    }
$scope.reply=function(){
    jQuery.post('reply',{email:$scope.em.email,message:$scope.em.reply},function(){
        swal(
            'Success',
            ' successfully sent feedback',
            'success'
          );
    })
    
}
$scope.deleteRep=function(){
    jQuery.post('deleteRep',{id:$scope.em._id},function(){
        swal(
            'Success',
            ' successfully deleted',
            'success'
          );
    })
    
}
$scope.em={}
$scope.getFb=function(x){
    $scope.em=x;
}
    $scope.updateNews = function() {
        toastr.success('Processing', 'Updating.. ', {timeOut: 5000});
     var myForm = document.getElementById('news');
        formData = new FormData(myForm );
       
        jQuery.ajax({
       url: 'saveNews',
       data: formData,
       cache: false,
       contentType: false,
       processData: false,
       method: 'POST',
       type: 'POST', // For jQuery < 1.9
       success: function(data){
        swal(
            'Success',
            'Details updated successfully',
            'success'
          );
    }
    })
    }

   
    $scope.welcomeText={}
    $scope.updateWelcome = function() {

        toastr.success('Processing', 'Updating.. ', {timeOut: 5000});
     var myForm = document.getElementById('welcome');
        formData = new FormData(myForm );
        alert(JSON.stringify($scope.welcomeText));
        jQuery.post('saveWelcome',{title:$scope.welcomeText.title,details:$scope.welcomeText.details},function(){
            swal(
                'Success',
                'Details updated successfully',
                'success'
              );
        })
       
    }

    
    $scope.cms={};

   $http.get('hfs').then(function(response){
    $scope.cms=response.data;
   })
   $http.get('feedback').then(function(response){
    $scope.feedback=response.data;
   })
   
    
    $scope.cms={};
    $scope.updateHs = function() {
        toastr.success('Processing', 'Updating.. ', {timeOut: 5000});
   
        jQuery.post('hf',{sc:$scope.cms.sc,rest:$scope.cms.rest,gym:$scope.cms.gym,vallet:$scope.cms.vallet},function(){
            swal(
                'Success',
                'Details updated successfully',
                'success'
              );
        })
       

    }
});
app.controller('myCtrl', function($scope,$http,$location,Customer){

    $scope.home={};
    $scope.home.Title1="";
    var uploadFolder="uploads/";
   
    var s=function(j){

     //alert(JSON.stringify(j));
    }
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}
function vc(ImageURL) {
    var block = ImageURL.split(";");
// Get the content type of the image
var contentType = block[0].split(":")[1];// In this case "image/gif"
// get the real base64 content of the file
var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

// Convert it to a blob to upload
var blob = b64toBlob(realData, contentType);

}

    var url="getRooms"
	$http.get(url).then(function(response){ 
       var data=response.data;
       
    $scope.rooms=data;
    Customer.rooms=data;;
    $scope.db=data;  
        
    });
    
    $scope.showLogin=function(){
       
    }
    $scope.byRange = function (fieldName, minValue, maxValue) {
        if (minValue === undefined) minValue = Number.MIN_VALUE;
        if (maxValue === undefined) maxValue = Number.MAX_VALUE;
      
        return function predicateFunc(item) {
          return minValue <= item[fieldName] && item[fieldName] <= maxValue;
        };
      };
      $scope.currentRoom={name:"Sample"}
      $scope.bookRoom=function(room){
       $scope.currentRoom=room;
       s(room);
        localStorage.setItem("room", JSON.stringify(room));
      
      }
      $scope.no=0;
      $scope.tab=function(no){
          $scope.no=no;
               }
    $scope.filter=function(){
        var beds=document.getElementById('child').value;
        var rating=document.getElementById('rating').value;
       
        
        if (beds && rating ) {
               var fil=    _.filter($scope.db, { 'rating':parseInt(rating),'beds':parseInt(beds) },function(o){
           return o.price< $scope.range;

       }); 
       $scope.rooms=fil;
        }
    }
    $scope.store=function(data){
        var data = jQuery.param({
            customer_id: cId,
            vehicle_id: vId
            
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        $http.post('', data,config )
    }
    $scope.units = [
        {'id': 1, 'label': 'one star'},
        {'id': 2, 'label': 'two stars'},
        {'id': 3, 'label': 'three stars'},
        {'id': 4, 'label': 'four stars'},
        {'id': 5, 'label': 'five stars'},
    ]
    $scope.status = [
        {'id': 'yes', 'label': 'Yes'},
        {'id': 'No', 'label': 'No'},
       
    ]
    $scope.update = function() {
        toastr.success('Processing', 'Updating.. ', {timeOut: 5000});
     var myForm = document.getElementById('frm');
        formData = new FormData(myForm );
       
        jQuery.ajax({
       url: 'saveRoom',
       data: formData,
       cache: false,
       contentType: false,
       processData: false,
       method: 'POST',
       type: 'POST', // For jQuery < 1.9
       success: function(data){
        swal(
            'Success',
            'Details updated successfully',
            'success'
          );
    }
    })
    }
    $scope.new=function(){
        $scope.rm=null;
    }
    $scope.delete=function(){
        
        jQuery.post('deleteRoom',{id:$scope.rm._id},function(data){
            toastr.success('Success', 'Roomremoved successfully ', {timeOut: 5000});
        } )
    }
    $scope.uploadFilex =function(files){

      var fi= $scope.rm.uploaded;
    
      var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    }
    $http.post('', data,config )
    }

    $scope.manage=function(room){   
        $scope.rm=room;
   
    
    }
   
});