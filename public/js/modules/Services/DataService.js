angular.module('invoiceApp').service('DataService', ['$http', '$log', function($http, $log) {
	// invoices operations
	this.getInvoices = function(callback) {
		$http.get('/api/invoices').then(callback);
	};

	// get one invoice
	this.getInvoice = function(invoiceId, callback) {
		$http.get('/api/invoices/' + invoiceId).then(callback);
	};

	// post one invoice
	this.addInvoice = function(callback) {
		$http.post('/api/invoices', {}).then(callback);
	};

	// delete one invoice
	this.deleteInvoice = function(id) {
		$http.delete('api/invoices/' + id).then(function(response) {
			$log.log('invoice delete response:', response);
		});
	};

	// put one invoice
	this.addDataToInvoice = function(invoiceId, data, callback) {
		$http.put('/api/invoices/' + invoiceId, data).then(callback);
	}

	// customers operations
	this.getCustomers = function(callback) {
		$http.get('/api/customers').then(callback);
	};

	this.getCustomer = function(customerId, callback) {
		$http.get('/api/customers/' + customerId).then(callback);
	}

	this.addCustomer = function(data, callback) {
		$http.post('/api/customers/', data).then(callback);
	};

	this.deleteCustomer = function(customerId, callback) {
		$http.delete('/api/customers/' + customerId).then(callback);
	};

	this.editCustomer = function(customerId, data, callback) {
		$http.put('/api/customers/' + customerId, data).then(callback);
	};

	// product operations
	this.addInvoiceItem = function(item, invoiceId, callback) {
		$http.post('/api/invoices/' + invoiceId + '/items', {item}).then(callback);
	};

	this.updateInvoiceItem = function(invoiceId, itemId, item, callback) {
		$http.put('/api/invoices/' + invoiceId + '/items/' + itemId, item).then(callback);
	};

	this.deleteInvoiceItem = function(invoiceId, itemId, callback) {
		$http.delete('/api/invoices/' + invoiceId + '/items/' + itemId).then(callback).catch(function(err) {
			$log.error('deleteInvoiceItem error:', err);
		});
	};

	this.getInvoiceItems = function(invoiceId, callback) {
		$http.get('/api/invoices/' + invoiceId + '/items').then(callback);
	};

	this.getProducts = function(callback) {
		$http.get('/api/products').then(callback);
	};

	this.addProduct = function(data, callback) {
		$http.post('api/products/', data).then(callback);
	};

	this.deleteProduct = function(productId, callback) {
		$http.delete('/api/products/' + productId).then(callback);
	};

	this.editProduct = function(productId, data, callback) {
		$http.put('/api/products/' + productId, data).then(callback);
	};
}]);