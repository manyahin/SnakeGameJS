var app = {

  init: function() {
    // Detect keyboard events.
    app.input.setEvents();

    var arena = app.arena.init();
    var snake = app.snake.init();

    arena.addSnake(snake); 

    var apple = app.apple.init();

    arena.addApple(apple);
    
    app.game.start(arena);
  },

  game: {
    intervalId: null,
    score: 0,
    speed: 100,
    start: function(arena) {
      app.game.intervalId = setInterval(function() {
        arena.snake.move();

        // Check if snake over board
        // Minus one pixel from border. One graph pixel is 10 pixels.
        if (
          arena.snake.getX() < 0 || arena.snake.getX() > arena.getWidth() - 1 * 10 || 
          arena.snake.getY() < 0 || arena.snake.getY() > arena.getHeight() - 1 * 10
          )
        {
          // Game end
          app.game.stop(app.game.intervalId);
          // app.game.restart(arena);
        }

        // Check if snake eat hisself
        if (arena.snake.eatHimSelf())
        {
          // Stop game
          app.game.stop(app.game.intervalId);
        }


        // Render display
        app.display.render( app.arena );

        // Check if snake eat apple
        if (JSON.stringify(app.snake.getCoordinates()) == JSON.stringify(app.apple.getCoordinates()))
        {
          this.scrore++;
          app.snake.length++;
          // app.game.speed = app.game.speed - 10;

          // Put new apple on arena
          app.apple.generateNewCoordinates();
        }
      }, app.game.speed);
    },
    stop: function(intevalId) {
      clearInterval(intevalId);
    },
    restart: function(arena) {
      arena.snake.setPosition({x: 100, y: 100});
    }
  },

  input: {
    direction: "right",
    setEvents: function() {
      addEventListener('keydown', function(e) {
        switch(e.keyCode) {
          case 38: 
            if (app.input.direction != "down")
              app.input.direction = "up";
            break;
          case 39: 
            if (app.input.direction != "left")
              app.input.direction = "right";
            break;
          case 40:
            if (app.input.direction != "up")
              app.input.direction = "down";
            break;
          case 37:
            if (app.input.direction != "right")  
              app.input.direction = "left";
            break;  
        }
      }, false);
    },
  },

  apple: {
    coordinates: null, // {x: 10, y: 20}
    init: function() {
      // Generate coordinates for first apple
      app.apple.generateNewCoordinates();

      return this;
    },
    setCoordinates: function( coordinates ) {
      this.coordinates = coordinates;
    },
    getCoordinates: function() {
      return this.coordinates;
    },
    generateNewCoordinates: function() {
      app.apple.setCoordinates({
        x: (Math.round(Math.random() * ((app.arena.getWidth() - 10) / 10))) * 10,
        y: (Math.round(Math.random() * ((app.arena.getHeight() - 10) / 10))) * 10
      });
      // Check that apple is not "under" snake
      // Yes, I know, it is bad way
      for (var i = 0; i < app.snake.getHistory().length; i++)
      {
        if (
          app.apple.getCoordinates().x == app.snake.getHistory()[i].x &&
          app.apple.getCoordinates().y == app.snake.getHistory()[i].y
          )
          app.apple.generateNewCoordinates();
      }
    }
  },

  snake: {
    length: 3,
    coordinates: {x: 120, y: 120},
    speed: 10,
    history: [],
    init: function( ) {
      // Safe first snake coordinate in history. 
      var firstStep = {x: this.getX(), y: this.getY()};
      this.history.push(firstStep);

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

      // Hack, push every time new object to history.
      this.history.push({x: this.getX(), y: this.getY()});

      // Remove a tail of the snake 
      if (this.history.length > this.length) {
        this.history.shift();
      }
    },
    getHistory: function() {
      return this.history;
    },
    getCoordinates: function() {
      return this.coordinates;
    },
    eatHimSelf: function() {
      // Remove a head from the history
      var coordinates = _.initial(this.history)
      // Check if a head on same coordinates that the snake
      return _.some(coordinates, this.coordinates);
    }
  },

  arena: {
    height: 250,
    width: 250,
    matrica: [],
    snake: null,
    apple: null,
    init: function() {
      // this.height = height;
      // this.width = width;

      this.matrica = this.generateMatrica();

      return this;
    },
    getWidth: function() {
      return this.width;
    },
    getHeight: function() {
      return this.height;
    },
    addSnake: function(snake) {
      this.snake = snake;

      var x = snake.getX();
      var y = snake.getY();

      this.matrica[y][x] = 1;
    },
    addApple: function(apple) {
      this.apple = apple;
      var coordinates = this.apple.getCoordinates();
      this.matrica[coordinates.y][coordinates.x] = 1;
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

      // Render apple first
      appleCoordinates = arena.apple.getCoordinates();
      this.renderPixel(arena, appleCoordinates, 'red')

      // Render snake.
      snakeCoordinates = arena.snake.getHistory();
      for (var i = 0; i < snakeCoordinates.length; i++) {
        this.renderPixel(arena, snakeCoordinates[i], 'green');
      };

      
      // this.arena.snake.history.each(function(i, el) {
      //   console.log(i, el)
      // })

      // this.renderPixel(arena, arena.snake.coordinates);
      // this.renderPixel(arena, {x: arena.snake.coordinates.x + 10, 
      //   y: arena.snake.coordinates.y});
    },
    renderPixel: function( arena, coordinates, color ) {
      this.ctx.beginPath();

      this.ctx.rect(coordinates.x, coordinates.y, 10, 10);
      this.ctx.closePath();

      this.ctx.fillStyle = color;
      this.ctx.fill();      
    },
    clearCanvas: function( arena ) {
      
    }
  },
}

$(function() {

  app.init();

});