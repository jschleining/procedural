var app = angular.module('proceduralApp', [
  'ui.router',
  'ngMaterial',
  'ui.grid',
  'angularMoment',
  'headerModule',
  'dashboardModule'
]);

app.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {

  //#region Routing
  $stateProvider.
      state('root', {
        url: '',
        views: {
          'header': {
            templateUrl: 'header/header.view.html',
            controller: 'AppHeaderController',
            controllerAs: 'vm'
          },
          'workspace': {}
        }
      }).
        state('root.dashboard', {
          url: '/dashboard',
          views: {
            'workspace@': {
              templateUrl: 'dashboard/dashboard.view.html',
              controller: 'DashboardController',
              controllerAs: 'vm'
            }
          }
        });
  //#endregion

  //#region Theming
  $mdThemingProvider.definePalette('int-blue', {
    '50': '#ffffff',
    '100': '#d4ebfd',
    '200': '#9fd1fa',
    '300': '#5bb1f6',
    '400': '#3ea4f5',
    '500': '#2196f3',
    '600': '#0d87e9',
    '700': '#0b76cc',
    '800': '#0966af',
    '900': '#085592',
    'A100': '#ffffff',
    'A200': '#d4ebfd',
    'A400': '#3ea4f5',
    'A700': '#0b76cc',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100 A200 A400'
  });
  // This version of the blue palette exists because md-nav doesnt correctly support theming.
  $mdThemingProvider.definePalette('int-alt-blue', {
    '50': '#2196f3',
    '100': '#2196f3',
    '200': '#2196f3',
    '300': '#2196f3',
    '400': '#2196f3',
    '500': '#2196f3',
    '600': '#2196f3',
    '700': '#2196f3',
    '800': '#2196f3',
    '900': '#2196f3',
    'A100': '#2196f3',
    'A200': '#2196f3',
    'A400': '#2196f3',
    'A700': '#2196f3',
    'contrastDefaultColor': 'light'
  });
  $mdThemingProvider.definePalette('int-orange', {
    '50': '#ffffff',
    '100': '#ffe0b9',
    '200': '#ffc781',
    '300': '#ffa739',
    '400': '#ff991b',
    '500': '#fb8b00',
    '600': '#dc7a00',
    '700': '#be6900',
    '800': '#9f5800',
    '900': '#814700',
    'A100': '#ffffff',
    'A200': '#ffe0b9',
    'A400': '#ff991b',
    'A700': '#be6900',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 500 600 A100 A200 A400'
  });
  $mdThemingProvider.definePalette('int-red', {
    '50': '#ffffff',
    '100': '#ffffff',
    '200': '#fbcece',
    '300': '#f58c8d',
    '400': '#f27071',
    '500': '#f05455',
    '600': '#ee3839',
    '700': '#eb1c1d',
    '800': '#d51314',
    '900': '#b91011',
    'A100': '#ffffff',
    'A200': '#ffffff',
    'A400': '#f27071',
    'A700': '#eb1c1d',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 500 A100 A200 A400'
  });

  $mdThemingProvider.theme('default')
      .primaryPalette('int-blue')
      .accentPalette('int-orange')
      .warnPalette('int-red');

  // This theme exists because md-nav doesnt correctly support theming.
  $mdThemingProvider.theme('altTheme1')
      .primaryPalette('int-alt-blue')
      .accentPalette('int-alt-blue');
  //#endregion
});
