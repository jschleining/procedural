var app = angular.module('proceduralApp');

app.controller('DungeonGeneratorController', ['Utilities', function (Utilities) {
  var vm_ = this;

  //#region vars
  // Passed in Grid Settings
  vm_.localSettings = vm_.config;
  // Canvas
  vm_.canvas = null;
  vm_.canvasElementId = 'grid';
  vm_.ctx = null;
  // Regions and Tiles
  vm_.canvasTiles = {};
  vm_.currentRegion = -1;
  vm_.masterGrid = {};
  vm_.regions = {};
  //#endregion

  //#region function definitions
  vm_.canCarve = canCarve_;
  vm_.carveTile = carveTile_;
  vm_.checkForOverlap = checkForOverlap_;
  vm_.carveRegion = carveRegion_;
  vm_.drawDungeon = drawDungeon_;
  vm_.generateRoom = generateRoom_;
  vm_.generateRooms = generateRooms_;
  vm_.getTile = getTile_;
  vm_.growMaze = growMaze_;
  vm_.removeFromRegion = removeFromRegion_;
  vm_.resetValues = resetValues_;
  vm_.startRegion = startRegion_;
  vm_.updateGrid = updateGrid_;
  //#endregion

  /**
   * Initial activation of Dungeon Generator Controller.
   */
  vm_.$onInit = function() {
    // Most code for the dungeon generator is from:
    // https://github.com/munificent/hauberk/blob/db360d9efa714efb6d937c31953ef849c7394a39/lib/src/content/dungeon.dart

    // Define canvas and context for drawing.
    vm_.canvas = document.getElementById(vm_.canvasElementId);
    vm_.ctx = vm_.canvas.getContext('2d');

    vm_.updateGrid();
  };

  /**
   * Create or recreate the grid.
   */
  function updateGrid_() {
    vm_.resetValues();
    // create Region 0 with defaults.
    vm_.carveRegion(0, 0, vm_.localSettings.width, vm_.localSettings.height, 'none', true);

    // Create the rooms and draw them.
    vm_.generateRooms();

    for (var y = 1; y < (vm_.canvasTiles.y - 1); y += 2) {
      for (var x = 1; x < (vm_.canvasTiles.x - 1); x += 2) {
        var masterId = x + '-' + y;
        if (vm_.masterGrid[masterId].type === 'none') {
          vm_.growMaze(vm_.masterGrid[masterId]);
        }
      }
    }

    vm_.drawDungeon();

    console.log('master grid ', vm_.masterGrid);
    console.log('regions', vm_.regions);
  }

  /**
   * Reset grid values to default.
   */
  function resetValues_() {
    vm_.localSettings = vm_.config;
    vm_.regions = {};
    vm_.currentRegion = -1;
    // Resize the Canvas
    vm_.canvas.width  = vm_.localSettings.width * vm_.localSettings.tileSize;
    vm_.canvas.height = vm_.localSettings.height * vm_.localSettings.tileSize;
    vm_.canvasTiles = {
      x: vm_.localSettings.width,
      y: vm_.localSettings.height
    };
  }

  /**
   * Create a new region.
   */
  function carveRegion_(x, y, width, height, tileType, regionZero) {
    // NOTE: Region 0 is empty space.
    vm_.startRegion();

    // Loop through the tiles and define them.
    for (var tileY = y; tileY < height; tileY++) {
      for (var tileX = x; tileX < width; tileX++) {
        if (regionZero) {
          var tileCoordinates = {
            x: tileX,
            y: tileY
          };
          vm_.carveTile(tileCoordinates, tileType, regionZero);
        } else {
          var masterId = tileX + '-' + tileY;
          var tile = vm_.getTile(masterId);
          vm_.carveTile(tile, tileType);
        }
      }
    }
  }

  /**
   * Define a new Region.
   */
  function startRegion_() {
    vm_.currentRegion++;
  }

  /**
   * Define a tile and add it to a region.
   */
  function carveTile_(tileInput, type, regionZero) {
    var tile = {};

    if (regionZero) {
      tile.x = tileInput.x;
      tile.y = tileInput.y;
      tile.masterId = tile.x + '-' + tile.y;
    } else {
      tile = tileInput;
      vm_.removeFromRegion(tile);
    }

    // If currentRegion does not exist, create it.
    if (!vm_.regions[vm_.currentRegion]) {
      vm_.regions[vm_.currentRegion] = {};
    }

    // Create/Update the tile.
    tile.type = type;
    tile.region = vm_.currentRegion;
    tile.regionId = vm_.currentRegion + '-' + tile.x + '-' + tile.y;

    // Add the tile to the new region and update the master grid.
    vm_.masterGrid[tile.masterId] = tile;
    vm_.regions[vm_.currentRegion][tile.regionId] = tile;
  }

  /**
   * Generate all of the rooms to appear in the grid.
   */
  function generateRooms_() {
    var rooms = [];

    for (var currentRoom = 0; currentRoom < vm_.config.roomAttempts; currentRoom++) {
      var thisRoom = vm_.generateRoom();
      var overlaps = vm_.checkForOverlap(thisRoom, rooms);

      if (overlaps) {
        // if the room overlaps, make another attempt to create a room as long as there are attempts left.
        continue;
      } else {
        //TODO: Remove each tile from its current region so it can be added to the new region.
        // create a new region
        var width = thisRoom.x + thisRoom.width;
        var height = thisRoom.y + thisRoom.height;
        vm_.carveRegion(thisRoom.x, thisRoom.y, width, height, 'floor');

        // Push the room into the array for the next iteration.
        rooms.push(thisRoom);
      }
    }
  }

  /**
   * Generate a single room to attempt to place on the grid.
   */
  function generateRoom_() {
    // TODO: This function seems like it can be cleaned up.
    // Pick a random room size. The funny math here does two things:
    // - It makes sure rooms are odd-sized to line up with maze.
    // - It avoids creating rooms that are too rectangular: too tall and
    //   narrow or too wide and flat.
    // TODO: This isn't very flexible or tunable. Do something better here.
    // set size to 2-6 (plus twice the extra size added) and then adds 1 to force it to an odd number for the grid.
    var size = Utilities.getRandom(1, 3 + vm_.config.roomExtraSize) * 2 + 1;
    // prepare to increase one dimension by half the size + 1, to keep it an odd number.
    var rectangularity = Utilities.getRandom(0, 1 + Math.floor(size / 2)) * 2;
    var width = size;
    var height = size;

    // increase one dimension's size
    if (Utilities.getRandom(0, 1) === 0) {
      width += rectangularity;
    } else {
      height += rectangularity;
    }

    // set the location of the room
    var x = Utilities.getRandom(0, Math.floor((vm_.canvasTiles.x - (width + 2)) / 2)) * 2 + 1;
    var y = Utilities.getRandom(0, Math.floor((vm_.canvasTiles.y - (height + 2)) / 2)) * 2 + 1;

    return {
      x: x,
      y: y,
      width: width,
      height: height
    };
  }

  /**
   * Loop through all currently placed rooms and ensure current room does not overlap.
   */
  function checkForOverlap_(thisRoom, otherRooms) {
    if (otherRooms.length > 0) {
      for (var room = 0; room < otherRooms.length; room++) {
        var otherRoom = otherRooms[room];
        if (Utilities.detectBoundaryCollision(thisRoom, otherRoom)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Remove a tile from a region.
   */
  function removeFromRegion_(tile) {
    delete vm_.regions[tile.region][tile.regionId];
  }

  /**
   * Retrieve a tile from Master Grid based on its id.
   */
  function getTile_(tileId) {
    return vm_.masterGrid[tileId];
  }

  function growMaze_(start) {
    /// Implementation of the "growing tree" algorithm from here:
    /// http://www.astrolog.org/labyrnth/algrithm.htm.

    // what directions can the tiles turn
    var directions = {
      n: {x: 0, y: -1},
      e: {x: 1, y: 0},
      s: {x: 0, y: 1},
      w: {x: -1, y: 0}
    };

    var cells = [];
    var lastDirection = null;
    var tileType = 'path';
    var windingPercent = 0;

    vm_.startRegion();
    vm_.carveTile(start, tileType);
    cells.push(start);

    while(cells.length > 0) {
      var cell = cells[cells.length - 1];
      // See which adjacent cells are open.
      var unmadeCells = [];

      // Add the directions that can be carved to the unmade array.
      angular.forEach(directions, function(cardinal, key) {
        if (vm_.canCarve(cell, cardinal)) {
          unmadeCells.push(key);
        }
      });

      if (unmadeCells.length > 0) {
        // Based on how "windy" passages are, try to prefer carving in the
        // same direction.
        var dir;
        var turnCheck = Utilities.getRandom(1, 100);
        var exists = unmadeCells.indexOf(lastDirection);
        if (exists !== -1 && turnCheck > windingPercent) {
          dir = lastDirection;
        } else {
          dir = unmadeCells[Utilities.getRandom(0, unmadeCells.length - 1)];
        }

        console.log('dir', dir);
        var cell1Coords = {
          x: cell.x + directions[dir].x,
          y: cell.y + directions[dir].y
        };
        var cell2Coords = {
          x: cell.x + (directions[dir].x * 2),
          y: cell.y + (directions[dir].y * 2)
        };
        var cell1Id = cell1Coords.x + '-' + cell1Coords.y;
        var cell2Id = cell2Coords.x + '-' + cell2Coords.y;
        var cell1 = vm_.getTile(cell1Id);
        var cell2 = vm_.getTile(cell2Id);
        vm_.carveTile(cell1, tileType);
        vm_.carveTile(cell2, tileType);
        cells.push(cell2);
        lastDirection = dir;
      } else {
        // No adjacent uncarved cells.
        cells.pop();
        // This path has ended.
        lastDirection = null;
      }
    }
  }

  /**
   * Confirm whether the desired tile can be carved out or not.
   */
  function canCarve_(position, direction) {
    /// Gets whether or not an opening can be carved from the given starting
    /// [Cell] at [pos] to the adjacent Cell facing [direction]. Returns `true`
    /// if the starting Cell is in bounds and the destination Cell is filled
    /// (or out of bounds).</returns>
    // bool _canCarve(Vec pos, Direction direction) {
    //   // Must end in bounds.
    //   if (!bounds.contains(pos + direction * 3)) return false;
    //
    //   // Destination must not be open.
    //   return getTile(pos + direction * 2) == Tiles.wall;
    // }

    // Must be able to move at least 2 spaces, that's why 3.
    if (position.x + (direction.x * 3) < 0 ||
        position.x + (direction.x * 3) > vm_.localSettings.width ||
        position.y + (direction.y * 3) < 0 ||
        position.y + (direction.y * 3) > vm_.localSettings.height) {
      // out of bounds
      return false;
    }

    // Will move 2 tiles every time it moves, that's why 2.
    var tileDestination = {
      x: position.x + (direction.x * 2),
      y: position.y + (direction.y * 2)
    };
    var id = tileDestination.x + '-' + tileDestination.y;
    return vm_.getTile(id).type === 'none';
  }

  /**
   * Draw the dungeon on the canvas..
   */
  function drawDungeon_() {
    var drawDungeon = function(ctx) {
      var fillColor = '';
      var strokeColor = '';
      angular.forEach(vm_.regions, function(region, key) {
        //https://stackoverflow.com/questions/5092808/how-do-i-randomly-generate-html-hex-color-codes-using-javascript
        if (key === '0') {
          fillColor = '#000';
          strokeColor = '#555';
        } else {
          var max = 240;
          var min = 180;
          var shade1 = Utilities.getRandom(min, max);
          var shade2 = Utilities.getRandom(min, max);
          var shade3 = Utilities.getRandom(min, max);
          // fillColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
          fillColor = 'rgb(' + shade1 + ', ' + shade2 + ', ' + shade3 + ')';
          strokeColor = '#000';
        }
        ctx.fillStyle = fillColor;
        angular.forEach(region, function(tile) {
          ctx.fillRect( tile.x * vm_.localSettings.tileSize,
                        tile.y * vm_.localSettings.tileSize,
                        vm_.localSettings.tileSize, vm_.localSettings.tileSize);
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1;
          ctx.strokeRect( tile.x * vm_.localSettings.tileSize,
                          tile.y * vm_.localSettings.tileSize,
                          vm_.localSettings.tileSize, vm_.localSettings.tileSize);
        });
      });
    };

    drawDungeon(vm_.ctx);
  }
}]);
