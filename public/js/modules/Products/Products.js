'use-strict';

angular.module('invoiceApp').controller('ProductsController', ['$scope', '$http', '$log', 'DataService', function($scope, $http, $log, DataService) {
	var vm = this;

	vm.getProducts = function() {
		DataService.getProducts(function(response) {
			$log.log('getProducts response:', response);

			vm.products = response.data;
		});
	};

	vm.addProduct = function() {
		vm.newProduct.price = parseFloat(vm.newProduct.price);
		$log.log('vm.newProduct:', vm.newProduct);
		DataService.addProduct(vm.newProduct, function(response) {
			$log.log('addProduct response:', response);
			vm.getProducts();
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