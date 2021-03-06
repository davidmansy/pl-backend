'use strict';

/* Controllers */

angular.module('myApp.controller.merchant', [])

   .controller('MerchantsCtrl', ['$scope', 'loginService', 'syncData',
    '$location', 'userDataService', 'merchantDataService',
    function($scope, loginService, syncData, $location, userDataService, merchantDataService) {

      merchantDataService.getAll()
      .then(function(data) {
        $scope.merchants = data;
      });

      $scope.merchant = {
        businessName: '',
        address1: '',
        address2: '',
        phone: '',
        city: '',
        state: '',
        zip: ''
      };

      $scope.submitMerchant = function() {
        merchantDataService.create($scope.merchant)
        .then(function() {
          console.log('Success create merchant');

          //Reset the scope merchant object
          $scope.merchant = {
            businessName: '',
            address1: '',
            address2: '',
            phone: '',
            city: '',
            state: '',
            zip: ''
          };

          //Refetch the data
          merchantDataService.getAll()
          .then(function(data) {
            $scope.merchants = data;
          });

        }, function() {
          console.log('Error create merchant');
        });

      };

      $scope.deleteMerchant = function(merchantId) {
        merchantDataService.delete(merchantId)
        .then(function() {
          console.log('Success delete merchant');
          //Refetch the data
          merchantDataService.getAll()
          .then(function(data) {
            $scope.merchants = data;
          });
        }), function() {
          console.log('Error delete merchant');
        };
      };

   }])

   .controller('MerchantUpdateCtrl', ['$scope', 'loginService', 'syncData',
    '$location', 'userDataService', 'merchantDataService', '$routeParams', 'dealDataService', '$q',
    function($scope, loginService, syncData, $location, userDataService, merchantDataService,
      $routeParams, dealDataService, $q) {

      //MERCHANT DETAIL
      merchantDataService.getById($routeParams.merchantId)
      .then(function(data) {
        console.log('Success get merchant by id');
        $scope.merchant = data;
        $scope.merchantId = $routeParams.merchantId;
        //Reset the $scope.deal object
        $scope.deal = {
          title: '',
          description: '',
          merchantId: $scope.merchantId
        };

        //LIST OF MERCHANT DEALS
        dealDataService.getByMerchantId($scope.merchantId)
        .then(function(data) {
          $scope.deals = data;
        });

      }, function() {
        console.log('Error get merchant by id');
      });

      $scope.updateMerchant = function() {
        merchantDataService.update($scope.merchantId, $scope.merchant)
        .then(function() {
          console.log('Success update merchant');
          $location.path('/merchants');
        }), function() {
          console.log('Error update merchant');
        };
      };

      $scope.fileNameChanged = function(element)
      {
        $scope.file = element.files[0];
      }

      $scope.submitMerchantDeal = function() {
        //Transform the file to a base64 encoding
        var reader = new FileReader();
        reader.onload = (function(theFile) {
          return function(e) {
            $scope.deal.image = e.target.result;

            //Create the deal object in the db
            dealDataService.create($scope.deal)
            .then(function() {
              console.log('Success create merchant deal');

              //Reset the scope deal object
              $scope.deal = {
                title: '',
                description: '',
                merchantId: $scope.merchantId
              };

              //Refetch the data
              dealDataService.getByMerchantId($scope.merchantId)
              .then(function(data) {
                $scope.deals = data;
              });

            }, function() {
              console.log('Error create merchant deal');
            });

          };
        })($scope.file);
        reader.readAsDataURL($scope.file);

      };

      $scope.deleteMerchantDeal = function(dealId, merchantId) {
        console.log('deleteMerchantDeal:dealId:', dealId);
        dealDataService.delete(dealId, merchantId)
        .then(function() {
          console.log('Success delete merchant dealId:', dealId);
          //Refetch the data
          dealDataService.getByMerchantId(merchantId)
          .then(function(data) {
            $scope.deals = data;
          });
        }), function() {
          console.log('Error delete merchant deal');
        };
      };

   }]);
