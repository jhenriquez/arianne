"use strict";

angular.module('ApplicationModule')
	.service('$current', function () {
		this.installation = undefined;
		this.imei = undefined;
		this.user = undefined;
	});