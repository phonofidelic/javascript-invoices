'use-strict';

angular.module('invoiceApp').controller('CustomersController', ['$scope', '$http', '$log', function($scope, $http, $log) {
	var vm = this;
}]);

angular.module('invoiceApp').directive('customersDirective', function() {
	return {
		templateUrl: 'js/modules/Customers/customers.html',
		controllerAs: 'vm',
		controller: 'CustomersController'
	}
});