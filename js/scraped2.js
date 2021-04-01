var cv,ctx,w,h,cx,cy
var BG_COLOR ='#000000';

var plot_scale=0.25;
var plot_x=0.0;
var plot_y=0.0;
var steps_per_frame=500;
var delta_per_step=1e-5;
var delta_min=1e-7;
var t_start=-1.0;
var t_end=3.0
const iters=800;



function createCanvas(){
	cv=document.getElementById('canvas');
	cv.width=document.body.clientWidth;
	cv.height=window.innerHeight;

	if(cv.getContext){
		ctx=cv.getContext('2d');
		ctx.strokeStyle='white';
		w=cv.width;
		h=cv.height;
		cx=w/2;
		cy=h/2;
	}	else alert('This browser doesn\'t support canvas'); 
}

createCanvas();

function clearCanvas(){
	ctx.fillStyle=BG_COLOR;
	ctx.fillRect(0,0,2*w,2*h);
} 

function resetPlot(){
	plot_scale=0.25;

}

function Vertex(x,y,color){
	this.x=x;
	this.y=y;
	this.color=color;
}

function toScreen(x,y){
	const s = plot_scale*Math.trunc(h/2);
	const nx= Math.trunc(w*0.5 + (x-plot_x)*s); 
	const ny= Math.trunc(h*0.5 + (y-plot_y)*s); 
	return [nx,ny];
}


/*monomial order x-y-t*/
/*degree 3 polynomial is defined by these 20 coefficients*/
/*((Math.round(Math.random())*2)-1) gives 0 or 1

function Degree3equation(){
	this.xxx=((Math.round(Math.random())*2)-1); 
	this.xxy=((Math.round(Math.random())*2)-1);  
	this.xxt=((Math.round(Math.random())*2)-1);
	this.xyy=((Math.round(Math.random())*2)-1);
	this.xyt=((Math.round(Math.random())*2)-1);
	this.xty=((Math.round(Math.random())*2)-1);
	this.xtt=((Math.round(Math.random())*2)-1);
	this.yyy=((Math.round(Math.random())*2)-1);
	this.yyt=((Math.round(Math.random())*2)-1);
	this.ytt=((Math.round(Math.random())*2)-1);
	this.ttt=((Math.round(Math.random())*2)-1);
	this.xx=((Math.round(Math.random())*2)-1);
	this.xy=((Math.round(Math.random())*2)-1);
	this.xt=((Math.round(Math.random())*2)-1);
	this.yy=((Math.round(Math.random())*2)-1);
	this.yt=((Math.round(Math.random())*2)-1);
	this.tt=((Math.round(Math.random())*2)-1);
	this.x=((Math.round(Math.random())*2)-1);
	this.y=((Math.round(Math.random())*2)-1);
	this.t=((Math.round(Math.random())*2)-1);
}

Degree3equation.prototype.eval=function(x,y,t){
	var sum=0;
	sum+=this.xxx*Math.pow(x,3);
	sum+=this.xxy*(x*x*y);
	sum+=this.xxt*(x*x*t);
	sum+=this.xyy*(x*y*y);
	sum+=this.xyt*(x*y*t);
	sum+=this.xtt*(x*t*t);
	sum+=this.yyy*Math.pow(y,3);
	sum+=this.yyt*(y*y*t);
	sum+=this.ytt*(y*t*t);
	sum+=this.ttt*Math.pow(t,3);
	sum+=this.xx*x*x;
	sum+=this.xy*x*y;
	sum+=this.xt*x*t;
	sum+=this.yy*y*y;
	sum+=this.yt*y*t;
	sum+=this.tt*t*t;
	sum+=this.x*x +  this.y*y +this.t*t;
	return sum;

}

*/

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function Degree2Poly(){
	/*this.xx=getRandomInt(3)-1;*/

	this.xx=getRandomInt(3)-1;
	this.xy=getRandomInt(3)-1;
	this.xt=getRandomInt(3)-1;
	this.yy=getRandomInt(3)-1;
	this.yt=getRandomInt(3)-1;
	this.tt=getRandomInt(3)-1;
	this.x=getRandomInt(3)-1;
	this.y=getRandomInt(3)-1;
	this.t=getRandomInt(3)-1;
}

function Degree2PolySet(xx,xy,xt,yy,yt,tt,x,y,t){
	this.xx=xx;
	this.xy=xy;
	this.xt=xt;
	this.yy=yy;
	this.yt=yt;
	this.tt=tt;
	this.x=x;
	this.y=y;
	this.t=t;
}

Degree2Poly.prototype.eval=function(x,y,t){
	let sum=0;
	sum+=this.xx*x*x;
	sum+=this.xy*x*y;
	sum+=this.xt*x*t;
	sum+=this.yy*y*y;
	sum+=this.yt*y*t;
	sum+=this.tt*t*t;
	sum+=this.x*x +  this.y*y +this.t*t;
	return sum;
}

Degree2PolySet.prototype.eval=function(x,y,t){
	let sum=0;
	sum+=this.xx*x*x;
	sum+=this.xy*x*y;
	sum+=this.xt*x*t;

	sum+=this.yy*y*y;

	sum+=this.yt*y*t;
	sum+=this.tt*t*t;
	sum+=this.x*x;

	sum+=this.y*y;

	sum+=this.t*t;
	return sum;
}


function intToRGB(i){
	i+=1;
	var color={ 
		r:Math.min(255,50+(i*11909)%256),
		g:Math.min(255,50+(i*52973)%256),
		b:Math.min(255,50+(i*44111)%256),
		a:0.1
	};
	return color;
}


function generatePoints(equationX,equationY,t){
	var points=[];

	var iter=0;

	var x=t;
	var y=t;

	points.push(new Vertex(x,y,intToRGB(0)));

	while (iter<iters){
		iter+=1;
		var xn=equationX.eval(x,y,t);
		var yn=equationY.eval(x,y,t);
		points.push(new Vertex(xn,yn,intToRGB(iter)));
		x=xn;
		y=yn;
	}
	return points;
}

function draw(points){
	for(var i=0;i<points.length;i++){
		var point = points[i];
		var color='rgba('+point.color.r+','+point.color.g+','+point.color.b+','+1+')';
		ctx.fillStyle=color;
		ctx.fillRect(point.x+w/2,point.y+h/2,2,2);
	}
}

var t=t_start;
var rolling_delta=delta_per_step;
var speed_mult=1.0;


eq1=new Degree2PolySet(-1,0,1,0,0,0,0,1,0);
eq2=new Degree2PolySet(1,-1,0,-1,1,-1,1,1,0);

console.log(eq1.eval(-3,-3,-3));
console.log(eq2.eval(-3,-3,-3));

var trail_type=1;
var fade_speeds=[10,2,0,255];
var fade_speed=fade_speeds[trail_type];
var vertex_array=[];

for(var i=0;i<iters*steps_per_frame;i++){
	vertex_array[i]=new Vertex(0,0,intToRGB(i%iters));
}

var history=[];

for(var i=0;i<iters;i++){
	history[i]=new Vertex(0,0,intToRGB(i%iters));
}


	var steps=steps_per_frame;

function render(){
	if (fade_speed>=1){
		ctx.fillStyle='rgba('+fade_speed+','+fade_speed+','+fade_speed+',0.1)';
		ctx.fillRect(0,0,2*w,2*h);
	}

	var delta=delta_per_step*speed_mult;
	rolling_delta= rolling_delta*0.99+ delta*0.01;

	for (var step=0;step<steps;step++){
		isOffScreen=true;
		var x=t;
		var y=t;

		for (var iter=0;iter<iters;iter++){
			var nx=eq1.eval(x,y,t);
			var ny=eq2.eval(x,y,t);
			x=nx;
			y=ny;
			var screenPt=toScreen(x,y); 


			vertex_array[step*iters+iter].x=screenPt[0];
			vertex_array[step*iters+iter].y=screenPt[1];

			if(step*iters+iter<10) console.log(iter+' '+nx);

		}	
		if(isOffScreen){
			t+=0.01;
		} 
		else {
			t+=rolling_delta;
		}
	}


	requestAnimationFrame(render,1000/60);
}

render();


/*if (screenPt[0]>0&&screenPt[1]>0&&screenPt[0]<w&&screenPt[1]<h){
				var dx = history[iter].x-x;
				var dy = history[iter].y-y;
				var dist = 500*Math.sqrt(dx*dx+dy*dy);
				rolling_delta=Math.min(rolling_delta,Math.max(delta/(dist+1e-5),delta_min*speed_mult));
				isOffScreen=false;
			}
			
			history[iter].x=x;
			history[iter].y=y;*/
