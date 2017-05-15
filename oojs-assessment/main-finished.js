// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// setup ball counter

var ballCount = 0;
var counter = document.querySelector('p');

// function to generate random number

function random(min,max) {
    var num = Math.floor(Math.random()*(max-min)) + min;
    return num;
}

// define Shape constructor

function Shape() {
    this.x = random(0,width);
    this.y = random(0,height);
    this.velX = random(-7,7);
    this.velY = random(-7,7);
    this.exists = true;
}

// define EvilCircle constructor

function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, exists);
    
    this.color = 'white';
    this.size = 10;
    this.velX = 20;
    this.velY = 20;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

// define EvilCircle draw method

EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};

// define EvilCircle checkBounds method

EvilCircle.prototype.checkBounds = function() {
    if((this.x + this.size) >= width) {
        this.x -= this.size;
    }
    
    if((this.x - this.size) <= 0) {
        this.x += this.size;
    }
    
    if((this.y + this.size) >= height) {
        this.y -= this.size;
    }
    
    if((this.y - this.size) <= 0) {
        this.y += this.size;
    }
};

// define EvilCircle setControls method

EvilCircle.prototype.setControls = function() {
    var _this = this;
    window.onkeydown = function(e) {
        if (e.keyCode === 37) { // left
            _this.x -= _this.velX;
        } else if (e.keyCode === 39) { // right
            _this.x += _this.velX;
        } else if (e.keyCode === 38) { // up
            _this.y -= _this.velY;
        } else if (e.keyCode === 40) { // down
            _this.y += _this.velY;
        }
    }
};

// define EvilCircle collision detection

EvilCircle.prototype.collisionDetect = function() {
    for(var j = 0; j < balls.length; j++) {
        if(balls[j].exists) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                ballCount--;
            }
        }
    }
};

// define Ball constructor

function Ball(x, y, velX, velY, exists) {
    Shape.call(this, x, y, velX, velY, exists);
    
    this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
    this.size = random(10,20);
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// define ball draw method

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

// define ball update method

Ball.prototype.update = function() {
    if((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
};

// define ball collision detection

Ball.prototype.collisionDetect = function() {
    for(var j = 0; j < balls.length; j++) {
        if(!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
            }
        }
    }
};

// define array to store balls

var balls = [];

// create controllable EvilCircle 

var evil = new EvilCircle();
evil.setControls();

// define loop that keeps drawing the scene constantly

function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,width,height);
    
    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();
    
    while(balls.length < 25) {
        var ball = new Ball();
        balls.push(ball);
        ballCount++;
    }

    for(var i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    
    counter.textContent = 'Ball count: ' + ballCount;
    
    requestAnimationFrame(loop);
}

loop();
