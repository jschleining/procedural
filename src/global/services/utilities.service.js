var app = angular.module('proceduralApp');

app.service('Utilities', function () {
  var vm_ = this;
  vm_.getRandom = getRandom_;
  vm_.detectBoundaryCollision = detectBoundaryCollision_;

  // Return an inclusive random number between two integers.
  function getRandom_(min, max)
  {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Basic Boundary Box Collision Detection
  function detectBoundaryCollision_(boxA, boxB) {
    // basic collision detection: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (boxA.x < boxB.x + boxB.width &&
        boxA.x + boxA.width > boxB.x &&
        boxA.y < boxB.y + boxB.height &&
        boxA.height + boxA.y > boxB.y) {
      return true;
    }
    return false;
  }

  // likely broken and will need new inputs added. didnt want to delete it entirely from the dungeon generator.
  function drawGrid_() {
    // https://codereview.stackexchange.com/questions/114702/drawing-a-grid-on-canvas
    // the render logic should be focusing on the rendering
    var drawGrid = function(ctx, w, h, tileSize) {
      // fill in the background with black
      ctx.fillStyle = '#000';
      // ctx.fillRect(0, 0, vm_.localSettings.width * vm_.localSettings.tileSize, vm_.localSettings.width * vm_.localSettings.tileSize);
      ctx.fillRect(0, 0, w, h);

      ctx.beginPath();
      for (var x=0;x<=w;x+=tileSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      // set the color of the line
      ctx.strokeStyle = 'rgb(64, 64, 64)';
      ctx.lineWidth = 1;
      // the stroke will actually paint the current path
      ctx.stroke();

      // for the sake of the example 2nd path
      ctx.beginPath();
      for (var y=0;y<=h;y+=tileSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      // set the color of the line
      ctx.strokeStyle = 'rgb(64, 64, 64)';
      // just for fun
      ctx.lineWidth = 1;
      // for your original question - you need to stroke only once
      ctx.stroke();
    };

    drawGrid(vm_.ctx, vm_.canvas.width, vm_.canvas.height, vm_.localSettings.tileSize);
  }
});
