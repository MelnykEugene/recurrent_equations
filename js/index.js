function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
  }
  

function points(n,pscale){
    var x= [...Array(n).keys()].map(()=> Math.random()/pscale);
    var y= [...Array(n).keys()].map(()=> Math.random()/pscale);
    return [x,y];
}

function transform(x,y,a=2,b=2.5,c=2,d=0.25){
    var x_new=Array();
    var y_new=Array();
    for (var i =0;i<x.length;i++){
        x_new.push(Math.sin(a*y[i])-Math.cos(b*x[i]));
        y_new.push(Math.sin(c*x[i])-Math.cos(d*y[i]));
    }
    return [x_new,y_new];
}


var cv,ctx,w,h,cx,cy;
var BG_COLOR ='#000000';
var plot_scale=0.4;


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

function intToRGB(i){
	i+=1;
	var color={ 
		r:Math.min(255,50+(i*11909)%256),
		g:Math.min(255,50+(i*52973)%256),
		b:Math.min(255,50+(i*44111)%256),
		a:0.07
	};
	return color;
}

function toScreen(x,y){
	const s = plot_scale*Math.trunc(h/2);
	const nx= Math.trunc(w*0.5 + (x*s)); 
	const ny= Math.trunc(h*0.5 + (y*s)); 
	return [nx,ny];
}

function plot(x,y){
    ctx.fillStyle='#FF0000';
    ctx.fillRect(toScreen(0,0)[0],toScreen(0,0)[1],5,5);
    ctx.fillStyle='rgba(255,255,255)';
    for(var i=0;i<x.length;i++){
        var color=intToRGB(i);
        ctx.fillStyle='rgba('+color.r+','+color.g+','+color.b+','+1+')';
        ctx.fillRect(toScreen(x[i],y[i])[0],toScreen(x[i],y[i])[1],1,1);
    }
    return
}

function run(n,m,pscale,a=2,b=2.5,c=2,d=0.25){
    var [x,y]=points(n,pscale);
    var count=0;
    while(count<m){
        [x,y]=transform(x,y,a,b,c,d);
        count++;
    }
    plot(x,y);
}

var frames=1000;
var a=makeArr(0,3,frames);
console.log(a);
var b=makeArr(0,4,frames);
var c=makeArr(0,3,frames);
var d=makeArr(0,5,frames);
var currentFrame;
var n=10000;
var m=30;
var pscale=1000;
var frames_to_play=10000;


function step(){
    if (currentFrame==frames_to_play-1){
        return;
    }
    var [x,y]=points(n,pscale);
    count =0;
    while(count<m){
        [x,y]=transform(x,y,a[currentFrame%(frames-currentFrame)],b[currentFrame%frames],c[currentFrame%frames],d[currentFrame%frames]);
        count++;
    }
    ctx.fillStyle='rgba(0,0,0,0.1)';
    ctx.fillRect(0,0,w,h);

    plot(x,y);

    currentFrame+=1;
    window.requestAnimationFrame(step);
}
//run(100000,100,100);

//animate(100000,100,100,100);
currentFrame=300;
step();