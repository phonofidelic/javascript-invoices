'use-strict';

angular.module('invoiceApp').controller('ProductsController', ['$scope', '$http', '$log', 'DataService', function($scope, $http, $log, DataService) {
	var vm = this;

	vm.getProducts = function() {
		DataService.getProducts(function(response) {
			$log.log('getProducts response:', response);

			vm.products = response.data;
		});
	};


}]);

angular.module('invoiceApp').directive('productsDirective', function() {
	return {
		templateUrl: 'js/modules/Products/products.html',
		controllerAs: 'vm',
		controller: 'ProductsController'
	}
});