app

.factory('profileService', ['$localStorage', '$http', 'baseUrl', '$log', '$cordovaDialogs', '$state', '$base64','$ionicLoading',
	function ($localStorage, $http, baseUrl, $log, $cordovaDialogs, $state, $base64, $ionicLoading) {

	    var profileManager = function () {
	        var self = this;
	        var $storage = $localStorage;
	        var currentProfile = null;

	        self.getRandomUser = function (num) {

	            $log.debug('Getting User(s) results:' + num);

	            var promise = $http.post(baseUrl + "?results=" + null);

	            promise.error(function (data) { $log.debug(data); });
                 
	            return promise;
	        }


	        self.LoginFromToken = function (token) {

	            ;var base64EncodedString = $base64.encode("Null:Null");

	            $http.defaults.headers.common['Authorization'] = 'Basic ' + base64EncodedString;

	            var promise = null;

	            promise = $http.post(baseUrl + "api/authenticate/LoginFromToken").success(function (data) {

	                profileService.SetProfile(data);
	                $state.go('app.deliveries');

	            }).error(function (data) {
	                console.dir(data);
	            });

	            return promise;
	        };

	        self.DoLogin = function (LoginData) {

	            var base64EncodedString = $base64.encode(LoginData.username + ':' + LoginData.password);

	            $http.defaults.headers.common['Authorization'] = 'Basic ' + base64EncodedString;

	            var promise = null;
	            promise = $http.post(baseUrl + "api/authenticate/authenticate").success(function (data) {
	                if (!data.Success) {
	                    $cordovaDialogs.alert("Invalid username and password combination", 'Login', 'OK');
	                } else {
	                    self.SetProfile(data);
	                }
	            }).error(function (data) {
	                $ionicLoading.hide();
	                console.log(data);
	            });

	            return promise;
	        }

	        self.logout = function () {

	            delete $storage.profile;

	            currentProfile = null;

	            $state.go('app.login');
	        }

	        self.SetProfile = function (profileData) {
	            if (profileData != undefined || profileData != null) {
	                $storage.profile = profileData;
	                $storage.profile.Token = profileData.Token;
	            } else {
	                $storage.profile = null;
	            }

	            currentProfile = $storage.profile;
	        }

	        self.getProfile = function () {
	            if (currentProfile == null) {
	                currentProfile = $storage.profile;
	                if (currentProfile == null) {
	                    self.logout();
	                } else {
	                    $storage.profile.Token = currentProfile.Token;
	                }
	            }
	            return currentProfile == null ? null : currentProfile;
	        };

	        self.getToken = function () {
	            return currentProfile != undefined ? currentProfile.Token : null;
	        }
	    }

	    return new profileManager();
	}])

.factory('deliveryService', function ($localStorage, $http, baseUrl, $log, $cordovaDialogs, profileService, $ionicLoading) {

    var eventManager = function () {
        var self = this;
        var $storage = $localStorage;
        var DeliveryDetail;
        var profile = profileService.getProfile();
        var currentDeliveries;


        self.getCacheDeliveries = function () {
            return $storage.Documents;
        }

        self.getDeliveries = function (rows) {
            var promise = null;

            $http.defaults.headers.common['token'] = profile.Token;
            promise = $http.post(baseUrl + 'api/document/GetDocuments/', { UserID: profile.UserID } ).success(function (response) {
                if (response != null) {
                    $storage.Documents = response;
                }
            }, function (response) {
                if (response.status === 401) {
                    profileService.logout();
                    $state.go('login');
                }
                alert('An error occurred while trying to retrieve the delivery list');
            }).error(function (data) {
                //$cordovaDialogs.alert(data, 'Status', 'OK');
                //profileService.logout();
            });

            return promise;
        }

        self.getDeliveryById = function (id) {
            DeliveryDetail = _.where(currentDeliveries, { ID: parseInt(id) });
            return DeliveryDetail;
        }

        self.SubmitSuccessfulDelivery = function (DocID, Sig, Personname) {
            var promise = null;

            var completedDelivery = {
                DocumentID: DocID,
                Signature: Sig,
                PersonName: Personname
            };

            $http.defaults.headers.common['token'] = profile.Token;

            promise = $http.post(baseUrl + 'api/document/CompleteMyDelivery/', { DocumentID: completedDelivery.DocumentID, PersonName: completedDelivery.PersonName, Signature: completedDelivery.Signature }).success(function (response) {
                if (response != null) {
                    $cordovaDialogs.alert("Delivery Completed Successfully", 'Status', 'OK');
                }
            }).error(function (response) {
                console.log(response);
                $cordovaDialogs.alert(response, 'Status', 'OK');
                $ionicLoading.hide();
            });

            return promise;
        }
    }

    return new eventManager();
});