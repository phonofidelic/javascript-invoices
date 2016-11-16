'use-strict';

angular.module('invoiceApp').controller('CustomersController', ['$scope', '$http', '$log', 'DataService', function($scope, $http, $log, DataService) {
	var vm = this;

	vm.getCustomers = function() {
		DataService.getCustomers(function(response) {
			$log.log('getCustomers response:', response);
			vm.customers = response.data;
		});
	};

	vm.addCustomer = function() {
		DataService.addCustomer(vm.newCustomer, function(response) {
			$log.log('addCustomer respponse:', response);
			vm.getCustomers();
		});
	};

	vm.deleteCustomer = function(id, index) {
		DataService.deleteCustomer(id, function(response) {
			$log.log('deleteCustomer response:', response);
			vm.customers.splice(index, 1);
		});
	};

	vm.editCustomer = function(id, data) {
		DataService.editCustomer(id, data, function(response) {
			vm.getCustomers();
		});
	};
}]);

angular.module('invoiceApp').directive('customersDirective', function() {
	return {
		templateUrl: 'js/modules/Customers/customers.html',
		controllerAs: 'vm',
		controller: 'CustomersController'
	}
});