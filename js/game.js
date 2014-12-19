var app = {

  init: function() {
    var arena = app.arena.init();
    var snake = app.snake.init();

    arena.addSnake(snake); 
    
    app.input.setEvents();
    var interval_id = setInterval(function() {
      console.log(snake.coordinates);

      snake.move();

      app.display.render( arena );
    }, 200);
  },

  input: {
    direction: "right",
    setEvents: function() {
      addEventListener('keydown', function(e) {
        switch(e.keyCode) {
          case 38: 
            app.input.direction = "up";
            break;
          case 39: 
            app.input.direction = "right";
            break;
          case 40:
            app.input.direction = "down";
            break;
          case 37:
            app.input.direction = "left";
            break;  
        }
      }, false);
    },
  },

  snake: {
    length: 1,
    coordinates: {x: 50, y: 50},
    speed: 14,
    init: function( ) {
      return this;
    },
    getX: function() {
      return this.coordinates.x;
    },
    getY: function() {
      return this.coordinates.y;
    },
    setPosition: function(coordinates) {
      this.coordinates = coordinates;
    },
    move: function() {
      switch(app.input.direction) {
        case "up": 
          this.coordinates.y = 
            this.coordinates.y - this.speed;
          break;
        case "right":
          this.coordinates.x = 
            this.coordinates.x + this.speed;
          break;
        case "down":
          this.coordinates.y =
            this.coordinates.y + this.speed;
          break;
        case "left":
          this.coordinates.x = 
            this.coordinates.x - this.speed;
          break;
      }
    },
  },

  arena: {
    height: 200,
    width: 200,
    matrica: [],
    snake: null,
    init: function() {
      // this.height = height;
      // this.width = width;

      this.matrica = this.generateMatrica();

      return this;
    },
    addSnake: function(snake) {
      this.snake = snake;

      var x = snake.getX();
      var y = snake.getY();

      this.matrica[y][x] = 1;


    },
    generateMatrica: function() {
      var matrica = [];

      for (var y = 0; y < this.height; y++) {
        matrica[y] = [];
        for (var x = 0; x < this.width; x++) {
          matrica[y][x] = 0;
        };
      };
      console.log(matrica);
      return this.matrica = matrica;
    },
  },

  display: {
    canvas: {},
    ctx: {},
    renderCanvas: function( arena ) {
      // Create the canvas
      if (this.canvas.toString() 
        != "[object HTMLCanvasElement]") {
        console.log('nothing');
        this.canvas = document.createElement("canvas");
        this.canvas.style.border = "3px solid black";
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = arena.height;
        this.canvas.height = arena.width;
        document.body.appendChild(this.canvas);
      }

      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.width);

      // Add snake
      this.ctx.rect(arena.snake.getX(), arena.snake.getY(), 10, 10);
      this.ctx.fillStyle = 'green';
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'black';
      this.ctx.stroke();
    },
    renderHtmlTable: function( arena ) {

    },
    render: function( arena ) {
      this.renderCanvas(arena);
    },
  },
}

$(function() {

  app.init();

});