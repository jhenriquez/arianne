"use strict";

angular.module('ApplicationModule')
	.controller('HomeController', function ($scope, $installationService, $current, $location) {

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
			if ($current.installation != undefined && $current.installation.name != rs.installation.name)
				$current.imei = undefined;
			$current.installation = installation;
		};

		$scope.current = function current () {
			return $current.installation;
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

		$installationService.get({ name: $routeParams.installation }, function (rs) {
			if(rs.err)
				$location.path($routeParams.installation + '/notfound');
			if ($current.installation != undefined && $current.installation.name != rs.installation.name)
				$current.imei = undefined;
			$scope.installation = $current.installation = rs.installation;
			$scope.requestStats();
		});
	})
	.controller('PartialErrorController', function ($scope, $routeParams) {
		$scope.params = $routeParams;
	})
	.controller('UnitController', function ($scope, $routeParams, $current, $location, $unitService, $installationService) {

		$scope.search = function search () {
			if($scope.imei)
				$location.path($routeParams.installation + '/' + $scope.imei);
		}

		$scope.requestUnitInformation = function requestUnitInformation () {
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
	.controller('MaintenanceController', function ($scope) {
	});