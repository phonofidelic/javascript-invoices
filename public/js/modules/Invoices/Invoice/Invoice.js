angular.module('invoiceApp').controller('InvoiceController', ['$scope', '$http', '$log', 'DataService', function($scope, $http, $log, DataService) {
	var ctrl = this;
	// $log.log('ctrl:', ctrl)
	// ctrl.selectedCustomer = {};
	// ctrl.invoice = {};	
	ctrl.selectedProducts = [];

	ctrl.getInvoice = function(invoiceId, products) {
		DataService.getInvoice(invoiceId, function(response) {
			$log.log('getInvoice response:', response);
			ctrl.invoice = response.data;

			if (angular.isDefined(ctrl.invoice.customer_id)) {
				DataService.getCustomer(ctrl.invoice.customer_id, function(response) {
					$log.log('getCustomer response:', response);
					ctrl.customer = response.data;
				});
			}
		});

		ctrl.getInvoiceItems(invoiceId, products);
	};

	ctrl.deleteInvoice = function() {

	}

	ctrl.getCustomer = function(customerId) {
		if (angular.isDefined(customerId)) {
			DataService.getCustomer(customerId, function(response) {
				$log.log('getCustomer response:', response);
				ctrl.customer = response.data;
			});
		}
	};

	ctrl.addCustomerToInvoice = function(invoice, customer) {
		$log.log('customer:', customer)
		var customerArr = customer.split(' ');
		var customerId = parseInt(customerArr[customerArr.length -1])
		$log.log('customerId:', customerId)

		DataService.addCustomerToInvoice(invoice, customerId, function(response) {
			$log.log('selectCustomer response:', response);

		});

		DataService.getCustomer(customerId, function(response) {
			$log.log('getCustomer response:', response);
			ctrl.customer = response.data;
		});

		// DataService.getCustomers(function(response) {
		// 	$log.log('getCustomers:', response);
		// 	vm.customers = response.data;
		// });
	};

	ctrl.addProduct = function(item, invoiceId) {
		if (angular.isDefined(item)) {
			var parsedItem = JSON.parse(item);
			$log.log('parsedItem:', parsedItem, 'invoiceId:', invoiceId)
			ctrl.selectedProducts.push(parsedItem)

			var formattedItem = {
				invoice_id: invoiceId,
				product_id: parsedItem.id,
				quantity: 1
			};

			DataService.addInvoiceItem({}, invoiceId, function(response) {
				$log.log('addInvoiceItem response:', response);
				$http.put('/api/invoices/' + invoiceId + '/items/' + response.data.id, formattedItem).then(function(response) {
					$log.log('addInvoiceItem put response:', response)
				});
			});
		}
	};

	ctrl.updateProductQuantity = function(invoiceId, productId, itemId, quantity) {
		$log.log('update', quantity)
		var item = {
			id: itemId,
			invoice_id: invoiceId,
			product_id: productId,
			quantity: quantity
		}
		DataService.updateInvoiceItem(invoiceId, itemId, item, function(response) {
			$log.log('updateProduct response:', response);
		});
	};

	ctrl.getInvoiceItems = function(invoiceId, products) {
		DataService.getInvoiceItems(invoiceId, function(response) {
			$log.log('getInvoiceItems response:', response);
			ctrl.invoiceItems = response.data;

			// translate invoice items data to product data
			ctrl.invoiceItems.forEach(function(invoiceItem) {
				products.forEach(function(product) {
					if(product.id === invoiceItem.product_id) {
						var selectedProduct = product;
						product.itemId = invoiceItem.id;
						ctrl.selectedProducts.push(selectedProduct);
					}
				})
			});
		});
	};
	
}]);


angular.module('invoiceApp').directive('invoiceComponent', function() {
	return {
		templateUrl: 'js/modules/Invoices/Invoice/invoice.html',
		controllerAs: 'ctrl',
		controller: 'InvoiceController'
	}
});