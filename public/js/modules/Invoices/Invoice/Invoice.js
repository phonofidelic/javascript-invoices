angular.module('invoiceApp').controller('InvoiceController', ['$scope', '$http', '$log', 'DataService', function($scope, $http, $log, DataService) {
	var ctrl = this;
	// $log.log('ctrl:', ctrl)
	// ctrl.selectedCustomer = {};
	// ctrl.invoice = {};	
	ctrl.selectedProducts = [];

	ctrl.getInvoice = function(invoiceId) {
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

			DataService.addInvoiceItem(parsedItem.id, invoiceId, function(response) {
				$log.log('addInvoiceItem response:', response);
			})
		}
	};
	
}]);


angular.module('invoiceApp').directive('invoiceComponent', function() {
	return {
		templateUrl: 'js/modules/Invoices/Invoice/invoice.html',
		controllerAs: 'ctrl',
		controller: 'InvoiceController'
	}
});