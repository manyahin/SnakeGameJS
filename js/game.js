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
    coordinates: {x: 15, y: 15},
    speed: 10,
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
    height: 500,
    width: 500,
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
        this.canvas = document.createElement("canvas");
        this.canvas.style.border = "3px solid black";
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = arena.height;
        this.canvas.height = arena.width;
        document.body.appendChild(this.canvas);
      }

      this.ctx.clearRect(0, 0, arena.width, arena.width);
      // color in the background
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, arena.width, arena.width);

      // console.log(this.ctx)
      // Paint it black.
      this.ctx.fillStyle = "#FFBB22";
      this.ctx.rect(0, 0, arena.width, arena.height);
      this.ctx.fill();

      // Save the initial background.
      // this.back = this.ctx.getImageData(0, 0, 30, 30);

    },
    renderHtmlTable: function( arena ) {
      $('.arena').html(' ');

      var table = $('<table>')
          .css('border','1px solid black');
      
      for (y = 1; y <= arena.height; y++) {
          var tr = $('<tr>');
          for (x = 1; x <= arena.width; x++) {
              var td = $('<td>')
                  .attr('data-x',x)
                  .attr('data-y',y)

                  .html('');
              
              tr.append(td);   
          }
          table.append(tr);
      }
      
      $('.arena').append(table);
    },
    markPixel: function(x, y) {
      $('[data-x="'+x+'"][data-y="'+y+'"]').css('background-color', 'green');
    },
    render: function( arena ) {
      // HTML
      // this.renderHtmlTable( arena );
      // this.markPixel(arena.snake.getX(), arena.snake.getY());

      // HTML Canvas
      this.renderCanvas( arena );
      this.renderPixel(arena, arena.snake.coordinates);
    },
    renderPixel: function( arena, coordinates ) {
      this.ctx.beginPath();

      this.ctx.rect(coordinates.x, coordinates.y, 10, 10);
      this.ctx.closePath();

      this.ctx.fillStyle = 'green';
      this.ctx.fill();      
    },
    clearCanvas: function( arena ) {
      
    }
  },
}

$(function() {

  app.init();

});