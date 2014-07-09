angular.module('CustomDirectives')
	.directive('csSelectable',['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				scope.$watch(function () { return element[0].children.length; }, function () {
					for(var i = 0; i < element[0].children.length; i++) {
						(function () {
							var index = i;
							angular.element(element[0].children[i]).on('click', function () {
								clearClass();
								angular.element(element[0].children[index]).addClass(attrs.csSelectable);
							})
						})();
					}
				});

				function clearClass () {
					for(var i = 0; i < element[0].children.length; i++) {
						if(angular.element(element[0].children[i]).hasClass(attrs.csSelectable))
							angular.element(element[0].children[i]).removeClass(attrs.csSelectable);
					}
				}
			}
		}
	}]);