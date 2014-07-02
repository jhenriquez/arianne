"use strict";

angular.module('ApplicationModule')
	.service('$current', function () {
		this.installation = undefined;
		this.imei = undefined;
	});