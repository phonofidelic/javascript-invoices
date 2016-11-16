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

	ctrl.getCustomer = function(customerId) {
		if (angular.isDefined(customerId)) {
			DataService.getCustomer(customerId, function(response) {
				$log.log('getCustomer response:', response);
				ctrl.customer = response.data;
			});
		}
	};

	ctrl.addCustomerToInvoice = function(invoice, customer) {
		customer = JSON.parse(customer);
		$log.log('customer:', customer)
		// var customerArr = customer.split(' ');
		// var customerId = parseInt(customerArr[customerArr.length -1])
		// $log.log('customerId:', customerId)

		DataService.addDataToInvoice(invoice, {customer_id: customer.id}, function(response) {
			$log.log('selectCustomer response:', response);

		});

		DataService.getCustomer(customer.id, function(response) {
			$log.log('getCustomer response:', response);
			ctrl.customer = response.data;
		});
	};

	ctrl.addProduct = function(item, invoiceId) {
		if (angular.isDefined(item)) {
			var parsedItem = JSON.parse(item);
			$log.log('parsedItem:', parsedItem, 'invoiceId:', invoiceId)

			var formattedItem = {
				invoice_id: invoiceId,
				product_id: parsedItem.id,
				quantity: 1
			};

			DataService.addInvoiceItem({}, invoiceId, function(response) {
				$log.log('addInvoiceItem response:', response);
				$http.put('/api/invoices/' + invoiceId + '/items/' + response.data.id, formattedItem).then(function(response) {
					$log.log('addInvoiceItem put response:', response);

					// add itemId to selectedProductsItem for deletion reference
					parsedItem.itemId = response.data.id;
					parsedItem.quantity = response.data.quantity;
					ctrl.selectedProducts.push(parsedItem)
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
			ctrl.getTotal();
		});
	};

	ctrl.deleteProduct = function(invoiceId, itemId, products, index) {
		console.log(invoiceId, itemId)
		DataService.deleteInvoiceItem(invoiceId, itemId, function(response) {
			$log.log('deleteProduct response:', response);
			ctrl.getTotal();
		});

		ctrl.selectedProducts.splice(index, 1);

		// ctrl.getInvoiceItems(invoiceId, products);
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
						product.quantity = invoiceItem.quantity;
						ctrl.selectedProducts.push(selectedProduct);
					}
				});
			});
		});
	};

	ctrl.getTotal = function() {
		var total = 0;
		ctrl.selectedProducts.forEach(function(item) {
			total += (item.price * item.quantity);
		});
		$log.log('total:', total);
		ctrl.invoice.total = total.toFixed(2);
		ctrl.invoice.discountedTotal = total.toFixed(2);

		ctrl.applyDiscount(ctrl.invoice.total, ctrl.invoice.discount)
		ctrl.addTotalToInvoice();
	};

	ctrl.applyDiscount = function(total, discount) {
		// if (angular.isDefined(discount) && discount != null) {
			discount = discount / 100;
			var newTotal = total - total * discount;

			$log.log('discount:', discount, newTotal);

			ctrl.invoice.discountedTotal = newTotal;

			ctrl.addDiscountToInvoice();
		// 	return;
		// }
		// ctrl.invoice.discount = 0;
		// ctrl.addDiscountToInvoice();
	};

	ctrl.addTotalToInvoice = function() {
		DataService.addDataToInvoice(ctrl.invoice.id, {total: ctrl.invoice.total}, function(response) {
			$log.log('addTotalToInvoice response:', response);
		});
	};

	ctrl.addDiscountToInvoice = function() {
		DataService.addDataToInvoice(ctrl.invoice.id, {discount: ctrl.invoice.discount}, function(response) {
			$log.log('addTotalToInvoice response:', response);
			ctrl.addTotalToInvoice();
		});
	};

	ctrl.getDiscountedTotal = function() {

	};
	
}]);


angular.module('invoiceApp').directive('invoiceComponent', function() {
	return {
		templateUrl: 'js/modules/Invoices/Invoice/invoice.html',
		controllerAs: 'ctrl',
		controller: 'InvoiceController'
	}
});