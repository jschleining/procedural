var app = angular.module('headerModule', [
  'ui.router',
  'ngMaterial'
]);

app.controller('AppHeaderController', function ($scope) {
  var vm_ = this;
  vm_.leftTest = 'Left Test Text';
  vm_.rightTest = 'Right Test Text';
  activate_();

  /**
   * Initial activation of Header Controller.
   */
  function activate_() {
    // console.log('App Header Activated');
  }

});
