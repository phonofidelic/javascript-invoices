'use-strict';

angular.module('invoiceApp').controller('InvoicesController', ['$scope', '$http', '$log', 'DataService', function($scope, $http, $log, DataService) {
	var vm = this;
	vm.invoices = [];
	vm.products = [];
	vm.selectedProducts = [];

	vm.getInvoices = function() {
		DataService.getInvoices(function(response) {
			$log.log('getInvoices:', response);
			vm.invoices = response.data;
		});
	};

	vm.getCustomers = function() {
		DataService.getCustomers(function(response) {
			$log.log('getCustomers:', response);
			vm.customers = response.data;
		});
	};

	vm.getProducts = function() {
		DataService.getProducts(function(response) {
			$log.log('getProducts response:', response);

			vm.products = response.data;
		});
	};

	vm.addInvoice = function() {
		DataService.addInvoice(function(response) {
			$log.log('addInvoice:', response);
			vm.invoices.push({});
			$http.post('/api/invoices/' + response.data.id + '/items/').then(function(response) {
				$log.log('add invoice items response:', response)
				// update invoices
				vm.getInvoices();
			})
		});
	};

	vm.deleteInvoice = function(id, index) {
		DataService.deleteInvoice(id);
		vm.invoices.splice(index, 1);
	};

	vm.addInvoiceItems = function(id) {
		$http.put('/api/invoices' + id + '/items').then(function(response) {
			$log.log('addInvoiceItems response:', response);
		});
	};

	vm.addCustomer = function() {
		DataService.addCustomer(vm.newCustomer, function(response) {
			$log.log('addCustomer response:', response);
			vm.getCustomers();
		});
	};

	vm.addProduct = function() {
		vm.newProduct.price = parseFloat(vm.newProduct.price);
		DataService.addProduct(vm.newProduct, function(response) {
			$log.log('addProduct reaponse:', response);
			vm.getProducts();
		})
	}
}]);



angular.module('invoiceApp').directive('invoicesDirective', function() {
	return {
		templateUrl: 'js/modules/Invoices/invoices.html',
		controllerAs: 'vm',
		controller: 'InvoicesController'
	}
});
