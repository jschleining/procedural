var app = angular.module('proceduralApp');

app.component('dungeonGenerator', {
  bindings: {
    config: '<'
  },
  controller: 'DungeonGeneratorController',
  controllerAs: 'vm',
  templateUrl: 'global/components/dungeon-generator/dungeon-generator.view.html'
});
