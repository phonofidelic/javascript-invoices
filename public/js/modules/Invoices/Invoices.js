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

	// get customers
	DataService.getCustomers(function(response) {
		$log.log('getCustomers:', response);
		vm.customers = response.data;
	});

	// get products
	$http.get('/api/products').then(function(response) {
		$log.log('products response:', response);
		vm.products = response.data;
	});

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

	$scope.getInvoiceItems = function(id) {
		$http.get('/api/invoices/' + id + '/items').then(function(response) {
			$log.log('getInvoiceItems response:', response);

		});
	};

	$scope.selectCustomer = function(invoice, customer) {
		// $log.log('customer:', customer)
		// var parsedCustomer = JSON.parse(customer);
		var parsedCustomer = customer;
		$log.log('parsedCustomer:', parsedCustomer.id)
		$http.put('/api/invoices/' + invoice.id, { customer_id: parsedCustomer.id }).then(function(response) {
			$log.log('selectCustomer put response:', response);
			$scope.getInvoices();
		}).catch(function(err) {
			$log.error('selectCustomer error:', err);
		});
	};

	$scope.addProduct = function(item, invoiceId) {
		if (angular.isDefined(item)) {
			var parsedItem = JSON.parse(item);
			$scope.selectedProducts.push(parsedItem);
			$log.log('addProduct:', parsedItem)
			$http.put('/api/invoices/' + invoiceId + '/items/' + parsedItem.id, parsedItem).then(function(response) {
				$log.log('product put response');
				// $scope.selectedProducts.push(parsedItem);
				$log.log('selectedProducts:', $scope.selectedProducts);
			}).catch(function(err) {
				$log.error('addProduct error:', err);
			});			
		};
	};

	$scope.deleteProduct = function(index) {
		$scope.selectedProducts.splice(index, 1);
	}

	// getInvoices();
}]);

angular.module('invoiceApp').service('DataService', ['$http', '$log', function($http, $log) {
	// invoices operations
	this.getInvoices = function(callback) {
		$http.get('/api/invoices').then(callback);
	};

	// post invoices

	// get one invoice
	this.getInvoice = function(invoiceId, callback) {
		$http.get('/api/invoices/' + invoiceId).then(callback);
	};

	// post one invoice
	this.addInvoice = function(callback) {
		$http.post('/api/invoices', {}).then(callback);
	};

	// put one invoice
	this.addCustomerToInvoice = function(invoiceId, customerId, callback) {
		$http.put('/api/invoices/' + invoiceId, {customer_id: customerId}).then(callback);
	}

	// delete one invoice
	this.deleteInvoice = function(id) {
		$http.delete('api/invoices/' + id).then(function(response) {
			$log.log('invoice delete response:', response);
		});
	}

	// customers operations
	this.getCustomers = function(callback) {
		$http.get('/api/customers').then(callback);
	};

	this.getCustomer = function(customerId, callback) {
		$http.get('/api/customers/' + customerId).then(callback);
	}

	// this.selectCustomer = function(invoice, customerId, callback) {
	// 	$http.put('/api/invoices/' + invoice.id, {customer_id: customerId}).then(callback);
	// }

	// product operations
	this.addInvoiceItem = function(item, invoiceId, callback) {
		$http.post('/api/invoices/' + invoiceId + '/items', {item}).then(callback);
	}

	this.updateInvoiceItem = function(invoiceId, itemId, item, callback) {
		$http.put('/api/invoices/' + invoiceId + '/items/' + itemId, item).then(callback);
	};

	this.getInvoiceItems = function(invoiceId, callback) {
		$http.get('/api/invoices/' + invoiceId + '/items').then(callback);
	};

	this.test = function() {
		$log.log('testing')
	}
}]);

angular.module('invoiceApp').directive('invoicesDirective', function() {
	return {
		templateUrl: 'js/modules/Invoices/invoices.html',
		controllerAs: 'vm',
		controller: 'InvoicesController'
	}
});