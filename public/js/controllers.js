"use strict";

var InstallationSearch = angular.module('InstallationSearch');

InstallationSearch.controller('SearchController', function ($scope, $http, $_) {
	var metaCustomers = [
	{
		name: 'ArgoTrak', 
		server: '10.0.0.1'
	},
	{
		name: 'Brickhouse', 
		server: '10.0.0.2'
	},
	{
		name: 'Consatel', 
		server: '10.0.0.3'
	},
	{
		name: 'Guideon', 
		server: '10.0.0.3'
	},
	{
		name: 'ArgoTrack', 
		server: '10.0.0.3'
	},
	{
		name: 'ArgoTrac', 
		server: '10.0.0.3'
	}];

	$scope.searchCustomers = function () {
		if($scope.searchValue.length > 2) {
			$scope.customers = $_.filter(metaCustomers, function (customer) {
				return $_.contains(customer.name, $scope.searchValue);
			});
		} else {
			$scope.customers = [];
		}
	}
});