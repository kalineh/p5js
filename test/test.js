
var g = {};
var dt = 1.0 / 60.0;

function setup()
{
	createCanvas(640,480);
	frameRate(60);
	background(220);

	var entities = [];
	var count = 25;

	for (i = 0; i < count; ++i)
	{
		entities.push(new Fly());
	}

	g.entities = entities;
}

function Fly(type)
{
	var x = random(0, width);
	var y = random(0, height);
	this.pos = createVector(x, y, 1);
	this.vel = createVector(0,0,0);

	this.stateAscending = false;
	this.stateDescending = false;
	this.stateWaiting = true;
	this.stateMoving = false;
};

Fly.prototype.update = function()
{
    if (this.stateAscending) { this.updateAscending(); }
    if (this.stateDescending) { this.updateDescending(); }
    if (this.stateWaiting) { this.updateWaiting(); }
    if (this.stateMoving) { this.updateMoving(); }

    this.pos.add(this.vel);
    this.pos.z = constrain(this.pos.z, 0.0, 1.0);
}

Fly.prototype.draw = function()
{
	stroke(1);
	fill(this.getColor());

	var size = 8.0 + this.pos.z * 8.0;
	ellipse(this.pos.x, this.pos.y, size, size);
}

Fly.prototype.getColor = function()
{
	if (this.stateAscending) { return color(0,255,0); }
	if (this.stateDescending) { return color(0,128,0); }
	if (this.stateWaiting) { return color(128,128,128); }
	if (this.stateMoving) { return color(128,0,0); }

	return color(0,0,0);
}

Fly.prototype.getMoveSpeed = function()
{
	if (this.isFloor())
	{
		return 0.05;
	}

	return 0.5;
};

Fly.prototype.isFloor = function()
{
	return this.pos.z <= 0.0;
};

Fly.prototype.isCeiling = function()
{
	return this.pos.z >= 1.0;
};

Fly.prototype.stateNone = function()
{
	this.stateAscending = false;
	this.stateDescending = false;
	this.stateWaiting = false;
	this.stateMoving = false;

	this.vel.set(0,0,0);
}

Fly.prototype.startAscending = function()
{
	this.stateNone();
	this.stateAscending = true;
	this.vel.z = dt * +1.0;
}

Fly.prototype.updateAscending = function()
{
	if (this.isCeiling())
		this.startWaiting();
}

Fly.prototype.startDescending = function()
{
	this.stateNone();
	this.stateDescending = true;
	this.vel.z = dt * -1.0;
}

Fly.prototype.updateDescending = function()
{
	if (this.isFloor())
		this.startWaiting();
}

Fly.prototype.startWaiting = function()
{
	this.stateNone();
	this.stateWaiting = true;
}

Fly.prototype.updateWaiting = function()
{
	if (random(0,1000) < 50) this.startMoving();
	if (random(0,1000) < 50) this.startDescending();
	if (random(0,1000) < 50) this.startAscending();
}

Fly.prototype.startMoving = function()
{
	this.stateNone();
	this.stateMoving = true;

	this.vel = p5.Vector.random2D().mult(this.getMoveSpeed());
}

Fly.prototype.updateMoving = function()
{
	if (random(0,1000) < 5)
		this.startWaiting();
}

function draw()
{
	background(128);

	ellipse(mouseX,mouseY,15,15);

	var u = function(e) { e.update(); };
	var d = function(e) { e.draw(); };

	g.entities.forEach(u);
	g.entities.forEach(d);
}

function mousePressed()
{
	ellipse(20,20,10,10);
}

function mouseDragged()
{
}

function mouseReleased()
{
}