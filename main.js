const addDiv = () => {
  const div = document.createElement('div')
  document.body.appendChild(div);
}

if (typeof module !== 'undefined') {
  module.exports = {
    addDiv,
  };
};


 /* x: left side x position
 * y: top side y position
 * w: width of this Rectangle
 * h: height of this Rectangle
 */
function Rectangle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

// Check intersection with any other Rectangle object.
Rectangle.prototype.intersects = function(other) {
  return !(
    this.x + this.w  <= other.x            ||
    this.x           >= other.x + other.w  ||
    this.y + this.h  <= other.y            ||
    this.y           >= other.y + other.h
  );
}

// Moves this rectangle by the provided x and y distances.
Rectangle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
}

// Simple display of any rectangle
Rectangle.prototype.show = function() {
  rect(this.x, this.y, this.w, this.h);
}


/* creating the frog
 *
 * x: initial x position of the frog
 * y: initial y position of the frog
 * size: the width & height of the frog
 */
function Frog(x, y, size) {
  Rectangle.call(this, x, y, size, size);

  this.sitting_on = null;
}

// Extend Rectangle.
Frog.prototype = Object.create(Rectangle.prototype);

// Attach this frog to the other object, taking its speed.
Frog.prototype.attach = function(other) {
  this.sitting_on = other;
}

// Update the frog. If it is attached to an object, it will move with it.
Frog.prototype.update = function() {
  if(this.sitting_on !== null) {
    this.x += this.sitting_on.speed;
  }
  this.x = constrain(this.x, 0, width - this.w);
}

// Show the frog in the game window.
Frog.prototype.show = function() {
  fill(0, 255, 0, 200);
  rect(this.x, this.y, this.w, this.h);
}

 /* x: x position of the obstacle
 * y: y position of the obstacle
 * w: Obstacle width
 * h: Obstacle height
 * s: x speed of the obstacle
 */

function Obstacle(x, y, w, h, s) {
  Rectangle.call(this, x, y, w, h);
  this.speed = s;
}

// Extend Rectangle
Obstacle.prototype = Object.create(Rectangle.prototype);

// Move this obstacle by its speed, and wrap it if off the screen.
Obstacle.prototype.update = function() {
  this.move(this.speed, 0);
  if(this.x > width + grid_size) {
    this.x = - this.w - grid_size;
  }
  if(this.x < - this.w - grid_size) {
    this.x = width + grid_size;
  }
}

// Display this obstacle.
Obstacle.prototype.show = function() {
  fill(200);
  rect(this.x, this.y, this.w, this.h);
}

function Row(y, count, speed, obs_width, spacing, offset, inverted) {
  Rectangle.call(this, 0, y, width, grid_size);
  this.obstacles = [];
  this.inverted = inverted;
  for(let i = 0; i < count; i++) {
    let x = i * spacing + offset;
    this.obstacles.push(new Obstacle(x, y, obs_width, grid_size, speed));
  }
}

// Extend Rectangle.
Row.prototype = Object.create(Rectangle.prototype);

// Shows this Row, showing all obstacles on it.
Row.prototype.show = function() {
  for(let i = 0; i < this.obstacles.length; i++) {
    this.obstacles[i].show();
  }
}

// Update all obstacles on this row.
Row.prototype.update = function() {
  for(let i = 0; i < this.obstacles.length; i++) {
    this.obstacles[i].update();
  }
}

// Handle a collision with another Rectangle, collider.
// Calculates which obstacle, if any, the collider has intersected.
Row.prototype.hits = function(collider) {
  let obstacle = null;
  for(let i = 0; i < this.obstacles.length; i++) {
    if(collider.intersects(this.obstacles[i])) {
      obstacle = this.obstacles[i];
    }
  }
  return obstacle;
};

let frog;

let grid_size = 50;

let rows = [];

// Handles game reset if the frog dies, or at the initial load.
function resetGame() {
  frog = new Frog(width / 2, height - grid_size, grid_size);
}

// p5js setup function, ran on page load.
function setup() {
  width = 500;
  rows = [
    new Row(            0, 1,    0,         width,   0,   0, true),
    new Row(    grid_size, 1,    0,         width,   0,   0, true),
    new Row(2 * grid_size, 2,  0.5, 4 * grid_size, 400,  10, true),
    new Row(3 * grid_size, 3, -1.3, 2 * grid_size, 200,  30, true),
    new Row(4 * grid_size, 2,  2.3, 3 * grid_size, 250,  25, true),
    new Row(5 * grid_size, 1,    0,         width,   0,   0, true),
    new Row(6 * grid_size, 3,  1.2, 1 * grid_size, 150, 100, false),
    new Row(7 * grid_size, 2, -3.5, 1 * grid_size, 200, 150, false),
    new Row(8 * grid_size, 2,    2, 2 * grid_size, 300,   0, false),
    new Row(9 * grid_size, 2,    0,         width,   0,   0, true),
  ];
  createCanvas(width, rows.length * grid_size);
  resetGame();
}

// p5js draw function, ran on every frame.
function draw() {
  background(0);
  fill(255, 100);

  let intersects = null;

  for(let i = 0; i < rows.length; i++) {
    rows[i].show();
    rows[i].update();
    if(frog.intersects(rows[i])) {
      intersects = rows[i].hits(frog);
      if((intersects !== null) ^ rows[i].inverted) {
        resetGame();
      }
    }
  }

  frog.attach(intersects);
  frog.update();
  frog.show();
}

// p5js key pressed function, runs when any key is pressed on the keyboard
// while the game is open.
function keyPressed() {
  if(keyCode === UP_ARROW) {
    frog.move(0, -grid_size);
  } else if(keyCode === DOWN_ARROW) {
    frog.move(0, grid_size);
  } else if(keyCode === LEFT_ARROW) {
    frog.move(-grid_size, 0);
  } else if(keyCode === RIGHT_ARROW) {
    frog.move(grid_size, 0);
  }
}

