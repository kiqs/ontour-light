'use strict';

define(['App'], function(App) {

	App.controller('MenuController', ['$scope', 'SearchService', function($scope, SearchService) {

		$scope.menu = {
			activeTab: {
				title: "artist",
				param: "artist"
			},
			searchValue: '',
			activeTag: '',
			festivalsOnly: false,
			activeItem: ''
		};

		$scope.menu.tabs = [
			{
				title: "artist",
				param: "artist"
			},
			{
				title: "location",
				param: "geo"
			}
		];

		$scope.switchTab = function(tab) {
			$scope.menu.activeTab = tab;
		};

		$scope.menu.tags = ["rock", "pop", "alternative", "indie", "electronic", "classic rock", "hip-hop", "dance", "jazz"];

		$scope.switchTag = function(tag) {
			$scope.menu.activeTag = $scope.menu.activeTag == tag ? '' : tag;
		};

		$scope.pages = {
			page: 1,
			total: 1,
			totalPages: 1
		};

		$scope.search = function(item) {
			$scope.menu.autocompleteItems = [];
			$scope.menu.searchValue = item;

			(function go() {
				SearchService.search(
					$scope.menu.activeTab.param, 
					$scope.menu.searchValue, 
					$scope.menu.searchValue, 
					$scope.menu.festivalsOnly, 
					$scope.menu.activeTag, 
					$scope.pages.page)
				.success(function(response) {
					$scope.getEvents(response, $scope.menu.activeTab.param);

					$scope.pages.page++;

					if ($scope.pages.page <= $scope.pages.totalPages) {
						go();
					} else {
						// App.vent.trigger('addPaths');
					}
				});
			}());
		};

		$scope.getEvents = function(data, param) {
			if (data.error == 8 || data.events.total == 0) {
				$scope.pages.totalPages = 0;
				return false;
			}

			console.log($scope.pages.page);

			$scope.pages.totalPages = data.events["@attr"].totalPages;
			$scope.pages.total = data.events["@attr"].total;

			if ($scope.pages.page == $scope.pages.totalPages && /1$/.test($scope.pages.total)) {
				// App.vent.trigger('addEvent', data.events.event);
			} else {
				data.events.event.forEach(function(value, index, list) {
					// App.vent.trigger('addEvent', value);
					
					if ($scope.pages.page == 1 && index == 0) {
						// App.vent.trigger('setView', list, param);
					}
				});
			}
		};

		$scope.setFestivalsOnly = function() {
			$scope.menu.festivalsOnly = $scope.menu.festivalsOnly == false ? true : false;
		};

		$scope.years = ['2014', '2015', '2016', '2017'];

		$scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		$scope.days = [];

		for (var i = 1; i < 32; i++) {
	        $scope.days.push(i);
	    }

	}]);

});