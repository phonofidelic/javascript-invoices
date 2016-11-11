'use-strict';

angular.module('invoiceApp').controller('InvoicesController', ['$scope', '$http', '$log', 'InvoicesService', function($scope, $http, $log, InvoicesService) {
	// $scope.invoices = [];

	$http.get('api/invoices').then(function(response) {
		$log.log('getInvoices response:', response);
		$scope.invoices = response.data;

		$log.log($scope.invoices)
	});

	$scope.createNewInvoice = function() {
		$log.log('create new invoice')
	}
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