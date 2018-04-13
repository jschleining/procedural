app = angular.module('proceduralApp');

app.controller('MainController', function ($scope, $rootScope, $state) {
  var vm_ = this;

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    // console.log('fromState: ', fromState, ' || toState: ', toState);

    if (toState.name === 'root') {
      $state.go('root.dashboard');
    }
    // Save the fromState for when we want to go back to the last page.
    // utilities.lastState.fromData = fromState;
    // utilities.lastState.fromParams = fromParams;
    // vm_.currentIndex = newViews.indexOf(toState.name);
  });
});
