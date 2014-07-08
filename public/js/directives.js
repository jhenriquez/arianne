angular.module('CustomDirectives')
	.directive('csSelectable', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var values = attrs.csSelectable.split('|'),
					selector = values[1],
					property = values[0],
					items = values[2];

				if(!selector || !property || !items)
					return;

				scope.$watch(selector, function () {
					updateSelection(scope[selector]);
				});

				function updateSelection (selected) {
					if (!selected || !scope[items])
						return;
					scope[items].forEach(function (value) {
						if(selected === value) {
							for(var i = 0; i < element[0].children.length; i++) {
								if(angular.element(element[0].children[i]).hasClass('selected'))
									angular.element(element[0].children[i]).removeClass('selected');
								if(element[0].children[i].outerText.trim() == selected[property]) {
									angular.element(element[0].children[i]).addClass('selected');
								}
							}
						};
					});
				}
			}
		}
	});