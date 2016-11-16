'use-strict';
angular.module('invoiceApp').
	config(['$locationProvider', '$routeProvider',
		function($locationProvider, $routeProvider) {
			// $locationProvider.hashPrefix('!');

			$routeProvider.
				when('/', {
					template: '<invoices-directive></invoices-directive>',
					controller: 'InvoicesController',
					controllerAs: 'vm'
				}).
				when('/invoices', {
					template: '<invoices-directive></invoices-directive>',
					controller: 'InvoicesController',
					controllerAs: 'vm'
				}).
				when('/products', {
					template: '<products-directive></products-directive>',
					controller: 'ProductsController',
					controllerAs: 'vm'
				}).
				when('/customers', {
					template: '<customers-directive></customers-directive>',
					controller: 'CustomersController',
					controllerAs: 'vm'
				});
		}
	]);