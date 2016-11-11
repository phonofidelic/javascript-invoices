'use-strict';

angular.module('invoiceApp').controller('InvoicesController', ['$scope', '$http', '$log', 'InvoicesService', function($scope, $http, $log, InvoicesService) {
	$scope.invoices = [];
	$scope.selectedProducts = [];


	$scope.getInvoices = function() {
		$http.get('/api/invoices').then(function(response) {
			$log.log('getInvoices response:', response);
			$scope.invoices = response.data;
		});
	};

	$scope.addInvoice = function() {
		$log.log('create new invoice');
		$scope.invoices.push({});
		$http.post('/api/invoices', {}).then(function(response) {
			$log.log('invoice put response:', response);
			$http.post('/api/invoices/' + response.data.id + '/items', {invoiceItems: []}).then(function(response) {
				$log.log('addInvoiceItems response:', response);
			});
			$scope.getInvoices();
		});
	};

	$scope.deleteInvoice = function(id, index) {
		$http.delete('api/invoices/' + id).then(function(response) {
			$log.log('invoice delete response:', response);
			$scope.invoices.splice(index, 1);
		});
	};

	$scope.addInvoiceItems = function(id) {
		$http.put('/api/invoices' + id + '/items').then(function(response) {
			$log.log('addInvoiceItems response:', response);
		});
	};

	$scope.getInvoiceItems = function(id) {
		$http.get('/api/invoices/' + id + '/items').then(function(response) {
			$log.log('getInvoiceItems response:', response);

		});
	};

	$scope.getCustomers = function() {
		$http.get('/api/customers').then(function(response) {
			$log.log('customers response:', response, '*****');
			$scope.customers = response.data;
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

	$scope.getProducts = function() {
		$http.get('/api/products').then(function(response) {
			$log.log('products response:', response);
			$scope.products = response.data;
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

angular.module('invoiceApp').factory('InvoicesService', ['$http', '$log', function($http, $log) {
	function InvoicesService() {};

	InvoicesService.prototype.getInvoices = function(url) {
		return $http.get(url).then(function(response) {
			$log.log('getInvoices response:', response);
		});
	};
	return InvoicesService;
}]);

angular.module('invoiceApp').directive('invoicesDirective', function() {
	return {
		templateUrl: 'js/modules/Invoices/invoices.html',
		controller: 'InvoicesController'
	}
});