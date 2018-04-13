var app = angular.module('dashboardModule', [
  'ui.router',
  'ngMaterial'
]);

app.controller('DashboardController', function ($scope) {
  var vm_ = this;
  vm_.settings = {
    minWidth: 15,    // tiles
    maxWidth: 31,   // tiles
    minHeight: 11,   // tiles
    maxHeight: 21,  // tiles
    minAttempts: 10,
    maxAttempts: 10000,
    minExtraSize: 0,
    maxExtraSize: 3,
    tileSize: 32
  };
  vm_.mapSize = {
    width: vm_.settings.maxWidth,
    height: vm_.settings.maxHeight,
    tileSize: vm_.settings.tileSize,
    name: '',
    roomAttempts: 50,
    roomExtraSize: 0
  };

  vm_.updateSliders = updateSliders_;

  activate_();

  /**
   * Initial activation of Dashboard Controller.
   */
  function activate_() {

  }

  function updateSliders_() {
    vm_.mapSize.width = vm_.settings.minWidth;
    vm_.mapSize.height = vm_.settings.minHeight;

    switch(vm_.mapSize.tileSize) {
      case 8:
        vm_.settings.maxWidth = 121;
        vm_.settings.maxHeight = 81;
        break;
      case 16:
        vm_.settings.maxWidth = 61;
        vm_.settings.maxHeight = 41;
        break;
      case 24:
        vm_.settings.maxWidth = 45;
        vm_.settings.maxHeight = 31;
        break;
      case 32:
      default:
        vm_.settings.maxWidth = 31;
        vm_.settings.maxHeight = 21;
        break;
    }
  }

});
