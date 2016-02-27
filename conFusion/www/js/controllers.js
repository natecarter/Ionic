angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo', '{}');
  $scope.reservation = {};
  $scope.registration = {};

  // Create the login modal that we will use later
//ionicModal is the service, invoked by the 'fromTemplateURL' method with the parameter 'templates/login.html'  
//the second parameter defines how you use the modal  
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    //Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.reserveform = modal;
    });
    
    //Triggered in the reserve modal to close it
    $scope.closeReserve = function() {
            $scope.reserveform.hide();      
    };
    
    //Open the reserve Modal
    $scope.reserve = function() {
        $scope.reserveform.show();
    };
    
    //Perform the reservation action when the user submits the reserve form
    $scope.doReserve = function() {
        console.log('Doing reservation', $scope.reservation);
        
        //Simulate a reservation delay.  Remove this and replace with your reservation code
        $timeout(function() {
            $scope.closeReserve();
        }, 1000);
    };
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.registerform = modal;
      });

      // Triggered in the registration modal to close it
      $scope.closeRegister = function() {
        $scope.registerform.hide();
      };

      // Open the registration modal
      $scope.register = function() {
        $scope.registerform.show();
      };
        
    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);
    
        //simulate a registration delay
        $timeout(function() {
            $scope.closeRegister();
        }, 1000);
    
    };
    
    //check to ensure Ionic Platform is ready 
    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
         };
         $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();

        };
    });
    
        $ionicPlatform.ready(function() {
            var options = {
               maximumImagesCount: 8,
               width: 800,
               height: 800,
               quality: 80
              };
            $scope.viewPictures = function() {
                $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    console.log('Image URI: ' + results[0]);
                    $scope.registration.imgSrc = results[0];
                    
                  }, function(error) {
                    console.log(error);
                });
            };
        });
})

.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
            
            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            $scope.dishes = dishes;
                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
            
            $scope.addFavorite = function (index) {
                console.log("index is " + index);
                
                favoriteFactory.addToFavorites(index);
                $ionicListDelegate.closeOptionButtons();
                
            $ionicPlatform.ready(function () {
                
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dishes[index].name
                }).then(function () {
                    console.log('Added Favorite '+$scope.dishes[index].name);
                },
                function () {
                    console.log('Failed to add Notification ');
                });

                $cordovaToast
                  .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
              });
        });
    } 
}])

.controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.dish = dish;
    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', { 
        scope: $scope,
        }).then(function(popover) {
        $scope.popover = popover;
        });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };

    $scope.closePopover = function() {
    $scope.popover.hide();
    };

    $scope.addFavorite = function () { favoriteFactory.addToFavorites($scope.dish.id); 
        console.log("before entering ionic platform ready");
                                      
        $ionicPlatform.ready(function () {
                console.log("after entering ionic platform ready");
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dish.name
                }).then(function () {
                    console.log('Added Favorite '+$scope.dish.name);
                },
                function () {
                    console.log('Failed to add Notification ');
                });

                $cordovaToast
                  .showLongBottom('Added Favorite '+$scope.dish.name, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
              });
            
            
        });                              
          $scope.popover.hide();                            
    };
    
      $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
        }).then(function(modal)  {
        
        $scope.commentsForm = modal;
  });

  // Triggered in the comment modal to close it
        $scope.closeComment = function() {
        $scope.commentsForm.hide();
  };

  // Open the comment modal
        $scope.openComment = function() {
        $scope.commentsForm.show();
  };

  // Perform the comment action when the user submits the form
        $scope.mycomment = {rating:5, comment:"", author:"", date:""};
        $scope.doComment = function() {
            
                $scope.mycomment.date = new Date().toISOString();
                $scope.mycomment.rating = parseInt($scope.mycomment.rating);
                $scope.dish.comments.push($scope.mycomment);
                menuFactory.update({id:$scope.dish.id},$scope.dish);
                    console.log($scope.mycomment);
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
                $scope.closeComment();
        };
    


    
           
}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
            $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
            $scope.dish.comments.push($scope.mycomment);
            menuFactory.update({id:$scope.dish.id},$scope.dish);
                
            $scope.commentForm.$setPristine();
                
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

.controller('IndexController', ['$scope', 'dish', 'promotion', 'leader', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL', function ($scope, dish, promotion, leader, menuFactory, promotionFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = leader;
    $scope.showDish = false;
    $scope.message = "Loading ...";
    $scope.dish = dish;
    $scope.promotion = promotion;

}])

.controller('AboutController', ['$scope', 'leaders', 'corporateFactory', 'baseURL', function($scope, leaders, corporateFactory, baseURL) {
            
                    $scope.baseURL=baseURL;
                    $scope.leaders = leaders;
                    console.log($scope.leaders);
            
                    }])

.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$cordovaLocalNotification', '$cordovaToast', '$timeout', '$cordovaVibration', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $cordovaLocalNotification, $cordovaToast, $timeout, $cordovaVibration) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;
    $scope.favorites = favorites;
    $scope.dishes = dishes;
    //console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function (index) {
        var confirmPopup=$ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
                $cordovaVibration.vibrate(100);
               
            } else{
                console.log('Canceled delete');
            }
        });
        $scope.shouldShowDelete=false;
        

    }}])

.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }
        return out;

    }});
