gsap.config({trialWarn: false});
console.clear()
let select = s => document.querySelector(s),
		q = gsap.utils.selector(document),
		toArray = s => gsap.utils.toArray(s),
		canvas = select('#canvas'),
		ctx = canvas.getContext('2d'),
		particles = [],
		sizeObj = {width: window.innerWidth,
							 height: window.innerHeight
							},
		particleArray = [],
		resolution = Math.min(window.devicePixelRatio || 1, 2),
		colorArray = ["d6140a","ffb301","082970","fa7204","e33189","ffb501","a49e3b","3d2c74","ce1918","1c9ba2"],
		//starColorArray = ["607466","201e1f","fcfffc","b370b0","ff4000","4b244a","25171a","276fbf","183059","0e131f"],
		//starColorArray = ["ebd4cb","da9f93","b6465f","890620","2c0703","2a2b2a","1c1c1c","242325","32213a","383b53"],
		num = 2600,
		facePath = MotionPathPlugin.getRawPath("m168.81.49c-14.96,3.43-30.05,6.69-43.67,14.08-40.15,21.77-68.13,53.78-81.44,97.93-6.84,22.69-8.91,45.63-3.16,68.87,2.26,9.14.49,17.34-4.77,24.96-7.47,10.83-14.98,21.62-22.37,32.51-3.69,5.44-7.74,10.67-10.67,16.58-3.89,7.84-2.68,14.5,3.81,20.35,3.97,3.58,8.38,6.46,13.81,7.62,6.33,1.36,8.89,5.96,7.06,12.24-.49,1.7-1.24,3.32-1.85,4.98-2.52,6.84-1.07,12.37,4.48,17.14,3.64,3.13,4.35,5.24,2.75,9.63-2.14,5.88-1.27,11.01,3.13,15.57,3.54,3.67,6.23,7.87,6.97,13.05.63,4.4-.46,8.73-.73,13.09-.86,14.22,6.03,26.39,19.36,31.5,6.07,2.32,12.43,2.64,18.77,2.97,14.89.77,29.8,1.21,44.67,2.53,14.55,1.3,23.93,8.3,28.21,22.48,4.76,15.79,9.62,31.55,13.78,47.5"),
		//starPath = d="m32.21,38.12l-12.31-8.01-12.41,7.85,3.81-14.18L0,14.4l14.66-.76L20.09,0l5.25,13.71,14.65.95-11.42,9.23,3.63,14.23Z",
		starArr = []

colorArray = colorArray.map(x => Array.from(x)[0] == '#' ? x : `#${x}`);
//starColorArray = starColorArray.map(x => Array.from(x)[0] == '#' ? x : `#${x}`);
MotionPathPlugin.cacheRawPathMeasurements(facePath);

let dotRadius = gsap.utils.mapRange(0, 180, 0.05, 12)
let dotOpacity = gsap.utils.mapRange(0, 180, 0.01, 1)
let dotDuration = gsap.utils.mapRange(0, 180, 3, 13)
let dotOscDuration = gsap.utils.mapRange(0, 180, 0.35, 1)
let dotOscPosY = gsap.utils.mapRange(0, 180, -20, 20)
let dotScale = gsap.utils.mapRange(0, 180, 0.6, 0.1)

function convertToRadians(degree) {
	return degree*(Math.PI/180);
}
class Particle {
  constructor(x, y, radius, color, scale, rotation, origin, duration, oscDuration, opacity, oscPosY) {		
   	this.x = x;
   	this.y = y;
   	this.radius = radius;
   	this.color = color;
   	this.scale = scale;
   	this.rotation = rotation;
   	this.origin = origin;
   	this.duration = duration;
   	this.oscDuration = oscDuration;
   	this.opacity = opacity;
   	this.oscPosY = oscPosY;
    
	}
}
class SVGParticle {
  constructor(x, y, scale, rotation, svgPath, lineWidth,  strokeStyle, fillStyle, globalAlpha, shadowColor, id, width, height) {
		//const bbox = svgPath.getBBox();
   	this.x = x;
   	this.y = y;
   	this.scale = scale;
   	this.rotation = rotation;
   	this.path = svgPath;
		this.lineWidth = lineWidth;
		this.globalAlpha = globalAlpha;
		this.strokeStyle = strokeStyle;
		this.fillStyle = fillStyle;
		this.shadowColor = shadowColor;
		this.id = id;
    this.width = width;
    this.height = height;
    this.halfWidth = (width) / 2;
    this.halfHeight = (height) / 2;		
  }
  
}


for(let i = 0; i < num; i++) {
	let pos = MotionPathPlugin.getPositionOnPath([facePath][0], i/num, true);
	let radius = dotRadius(Math.abs(pos.angle));
	let opacity = dotOpacity(Math.abs(pos.angle));
	let origin = [-0, -0];
	let color = gsap.utils.random(colorArray);
	let p = new Particle(pos.x, pos.y, radius, color, 1, 0, origin, dotDuration(Math.abs(pos.angle)), dotOscDuration(Math.abs(pos.angle)), opacity, dotOscPosY(Math.abs(pos.angle))  );
	particleArray.push(p);	
}

gsap.utils.shuffle(particleArray)

function draw() {
	
  ctx.fillStyle = 'rgba(2,14,38, 0.081)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);		
 
	particleArray.forEach((particle, count) => {
		ctx.save();
		ctx.globalAlpha = particle.opacity;		
		ctx.fillStyle = particle.color;
   	ctx.translate(particle.x+sizeObj.width/1.8 , particle.y+sizeObj.height/4.5 );    
		ctx.scale(particle.scale, particle.scale)
		ctx.beginPath();
		
		ctx.arc(0, 0, particle.radius , 0,2 *  Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	})
 	
	starArr.forEach((particle, i) => {
		ctx.save();
		//ctx.globalCompositeOperation = "lighter";
		ctx.globalAlpha = particle.globalAlpha;	
		let particlePath = new Path2D(particle.path);
		ctx.translate(particle.x, particle.y);  
		ctx.rotate(convertToRadians(particle.rotation))
		ctx.scale(particle.scale, particle.scale)
		ctx.translate(-particle.halfWidth, -particle.halfHeight);  
		ctx.fillStyle = particle.fillStyle;
		ctx.fill(particlePath);
		ctx.restore()
  	
	})
}

function createStar(x, y, scale, rotation) {
	//let color = gsap.utils.random(starColorArray);
	let star = new SVGParticle(Math.abs(x + sizeObj.width/1.8)+310, Math.abs(y+sizeObj.height/4.5), scale, rotation, starPath, 0, null, color, 1, null, 1, 40, 38);
	starArr.push(star);
	//console.log(starArr.length)
	let tl = gsap.timeline({
		onComplete: function() {
			let index = starArr.indexOf(star);
			starArr.splice(index, 1)
		},		
	});
	tl.to(star, {
		duration: 4,
		globalAlpha: 0,
		x: '+=130',
		rotation: `+=${gsap.utils.random(-1030, 130)}`,
		ease: 'sine.in'
	})
	.from(star, {
		duration: 4,
		scale: 0,

		ease: 'sine.in'
	}, 0)
	
}

window.onresize = function (e) {

	sizeObj.width = window.innerWidth;
	sizeObj.height = window.innerHeight;
	canvas.width = sizeObj.width;
	canvas.height = sizeObj.height;
	
}
window.onresize() ;
let tl = gsap.timeline();
tl.from(particleArray, {
	scale: 0.13,
	duration: (i, c) => c.duration,
	stagger: {
		amount: 30,
		repeat: -1, 
	},	
	ease: 'slow(0.3, 0.8, true)'
}, 0)
	

.from(particleArray, {
	x: '-=310',
	duration: (i, c) => c.duration,
	stagger: {
		amount: 30,
		repeat: -1
	},
	radius: 0.2,
	ease: 'power1.in'
}, 0)
.to(particleArray, {
	y: (i, c) => `-=${c.oscPosY}`,
	duration: (i, c) => c.oscDuration,
	stagger: {
		amount: 30,
		repeat: -1,
		yoyo: true,
	},	
	ease: 'sine.inOut'
}, 0).seek(100)

gsap.ticker.add(draw)