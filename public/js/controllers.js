"use strict";

angular.module('ApplicationModule')
	.controller('HomeController', function ($scope, $installationService, $current, $location, $modal, $authenticationService, $userService) {

		$scope.$current = $current;

		$scope.$on('auth:authentication-required', function (e, args) {
			$modal.open({
				templateUrl: 'partials/login-form.html',
				controller: 'authenticationController',
				backdrop: 'static'
			}).result.then(
				function(rs) {
					$authenticationService.loginSuccessful();
				},
				function() {
					$authenticationService.loginCancelled();	
				});
		});

		$scope.searchInstallations = function searchInstallations () {
			if(!$scope.searchValue) {
				$scope.installations = [];
				return;
			}

			$scope.isLoading = true;

			$installationService.search({for: $scope.searchValue }, function (installations) {
				$scope.isLoading = false;
				$scope.installations = installations;
			});
		};

		$scope.selectCustomer = function selectCustomer (installation) {
			$scope.installations = [];
			$scope.searchValue = '';
			if ($current.installation != undefined && $current.installation.name != installation.name)
				$current.imei = undefined;
			$current.installation = installation;
		};

		$scope.redirectUnit = function redirectUnit () {
			var url = $current.installation.name + '/';
			url += $current.imei ? $current.imei : 'units';
			$location.path(url);
			return url;
		};

		$scope.redirectMaintenance = function redirectMaintenance () {
			$location.path('/servers');
		};

		$scope.redirectInstallation = function redirectInstallation () {
			$location.path('/'+$current.installation.name);
		};

		$scope.isNavigationEnabled = function isNavigationEnabled () {
			var clazz = 'list-group-item btn-essense ';
			clazz += $current.installation ? '' : 'disabled';
			return clazz.trim();
		};

		$scope.getClassForBoolean = function getClassForBoolean (boolean) {
			return boolean ? "fa fa-thumbs-up" : "fa fa-thumbs-down";
		};

		function getCurrentUserInformation () {
			$scope.loadingUserInformation = true;
			$userService.whoAmI({}, function (rs) {
				if(rs.err)
					return alert(rs.err.message);
				$current.user = rs.user;
				delete $scope.loadingUserInformation;
			});
		};

		getCurrentUserInformation();
	})
	.controller('InstallationController', function ($scope, $installationService, $routeParams, $current, $location) {
		$scope.requestStats = function requestStats () {
			if($scope.repeatLoading === undefined) {
				$scope.isLoading = true;
				$scope.somethingWrong = false;
			}

			$installationService.stats({ installation: $current.installation.name, server: $current.installation.dbase },
					function (response) {
						if($scope.repeatLoading === undefined) {
							$scope.isLoading = false;
						} else {
							$scope.repeatLoading = false;
						}

						if(response.err) {
							if($scope.refreshError === undefined) {
								return $scope.somethingWrong = true;
							} else {
								return $scope.refreshError = true;
							}
						}

						$scope.somethingWrong = false;
						$scope.serverStats = response.processing;
					});
		};

		$scope.refreshProcessing = function refreshProcessing () {
			$scope.repeatLoading = true;
			$scope.refreshError = false;
			$scope.requestStats();
		};

		$scope.unitSearch = function unitSearch () {
			if($scope.imei)
				$location.path($routeParams.installation + '/' + $scope.imei);
		};

		$installationService.get({ name: $routeParams.installation }, function (rs) {
			if(rs.err)
				$location.path($routeParams.installation + '/notfound');
			if ($current.installation != undefined && $current.installation.name != rs.installation.name)
				$current.imei = undefined;
			$current.installation = rs.installation;
			$scope.requestStats();
		});
	})
	.controller('PartialErrorController', function ($scope, $routeParams) {
		$scope.params = $routeParams;
	})
	.controller('UnitController', function ($scope, $routeParams, $current, $location, $unitService, $installationService) {

		$scope.requestUnitInformation = function requestUnitInformation () {
			if(!$routeParams.imei)
				return;
			$scope.requestLoading = true;
			$unitService.search({installation: $routeParams.installation, imei: $routeParams.imei, server: $current.installation.dbase },
				function (response) {
					$scope.requestLoading = false;
					if(response.err) {
						if(response.err.notfound)
							return $location.path($routeParams.installation+'/'+$routeParams.imei+'/notfound');

						return $scope.requestError = true;
					}

					$current.imei = $routeParams.imei;

					if (response.items.length === 1) {
						$scope.item = response.items[0];
					} else {
						$scope.items = response.items;
						$scope.isMultiple = true;
					}

					if ($routeParams.item) {
						$scope.items.forEach(function (i) {
							if(i.id == $routeParams.item) {
								$scope.isMultiple = false;
								$scope.item = i;
							}
						});
					}

					$scope.requestLoading = false;
					$scope.requestError = false;
			});
		}

		$installationService.get({ name: $routeParams.installation }, function (rs) {
			if(rs.err) {
				if(rs.err.notfound)
					$location.path($routeParams.installation + '/notfound');
			}
			if ($current.installation != undefined && $current.installation.name != rs.installation.name)
				$current.imei = undefined;
			$scope.installation = $current.installation = rs.installation;
			$scope.requestUnitInformation();
		});
	})
	.controller('MaintenanceController', function ($scope, $serverService) {

		function requestTmpDBStats (onSuccess, onErr) {
			if(!$scope.selected.name) return onErr();
			$serverService.stats ({server: $scope.selected.name }, function (rs) {
				if(rs.err) {
					return onErr(rs);
				}
				$scope.tempLogSizes = rs.tempLogSize;
				$scope.process = rs.processDetail;
				$scope.processId = rs.processId.SPID;
				onSuccess(rs);
			});
		};

		var executionContext = {
			contextFunction: undefined
		}

		$scope.select = function select (server) {
			if(!server || server === $scope.selected)
				return;
			$scope.selected = server;
		};

		$scope.loadContextStats = function loadContextStats () {
			if(!executionContext.contextFunction) return;

			$scope.isLoadingStats = true;
			$scope.errOnStats = false;

			executionContext.contextFunction (function (rs) {
				$scope.isLoadingStats = false;
				$scope.errOnStats = false;
			},
			function(rs) {
				$scope.errOnStats = true;
				$scope.isLoadingStats = false;
			});
		};

		$scope.reloadContextStats  = function reloadTempDBStats () {
			if(!executionContext.contextFunction) return;
			
			$scope.isReloadingStats = true;
			$scope.errReloadingStats = false;

			executionContext.contextFunction (function (rs) {
				// onSuccess
				$scope.isReloadingStats = false;
				$scope.errReloadingStats = false;
			},
			function (rs) {
				// onErr
				$scope.isReloadingStats = false;
				$scope.errReloadingStats = true;
			});
		};

		$scope.executeTmpDB = function executeTmpDB () {
			executionContext.contextFunction = requestTmpDBStats;
			$scope.loadContextStats();
		};

		$serverService.get({}, function (response) {
			if(response.err) {
				$scope.requestError = true;
			}
			$scope.servers = response.servers;
		});

	})
	.controller('authenticationController', function ($scope, $modalInstance, $http, $window) {
		$scope.cancel = function cancel () {
			$modalInstance.dismiss('Cancellation');
		}

		$scope.authenticate = function authenticate () {
			$scope.requestingAuthentication = true;
			$scope.onErrMessage = '';
			$http.post('/authenticate', { username: $scope.username, password: $scope.password })
				.success(function (rs) {
					delete $scope.requestingAuthentication;
					if (rs.err) {
						return $scope.onErrMessage = rs.err.message;
					}

					$window.sessionStorage.token = rs.token;
					$modalInstance.close('success');
				});
		};
	});