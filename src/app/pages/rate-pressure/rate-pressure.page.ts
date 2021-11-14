import { Component } from '@angular/core';

@Component({
  selector: 'app-rate-pressure',
  templateUrl: './rate-pressure.page.html',
  styleUrls: ['./rate-pressure.page.scss'],
})
export class RatePressurePage {

  constructor() {
  }

  ngOnInit() {	

  
	// Element declaration
	const canvas = <HTMLCanvasElement> document.getElementById('canvas'); 
	const colorR = document.getElementById('color-r');
	const colorG = document.getElementById('color-g');
	const colorB = document.getElementById('color-b');
	const heartbeat = document.getElementById('heartbeat');
	const beatLabel = document.getElementById('beat-label');
	const stable = document.getElementById('stable');
	const context = canvas.getContext('2d');
	const video = document.getElementById('video') as HTMLVideoElement;

	//var resetheartbeat=<HTMLFormElement>document.getElementById("heartbeat");
	//resetheartbeat.reset();

	// Constants declaration
	const itemsLimit = 100;
	const beatsLimit = 15;
	const lowerThreshold = 0.2;
	const upperThreshold = 0.8;

	const darkDetectionFactor = 5;

	// Heartbeat buffer
	const buffer = [];
	const beats = [];
	let stabilizingCount = 0;

	var localstream;

	var oldLength = -1;
	

	// Initial flexible threshold
	let threshold = upperThreshold;
	document.getElementById('startbutton').addEventListener("click", function(){

		if(navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: {
			facingMode: ["user"]
		  }} ).then(function(stream) {
			localstream = stream;
			video.srcObject = stream;
			video.play();

			});
			}
		});

		function stopVideoOnly(localstream){
			localstream.getTracks().forEach(function(track){
				if(track.readyState =='live' && track.kind =='video'){
					track.stop();
				}
			})
		}

	
		function listen(currentLength){
			if(currentLength != oldLength){
				stopVideoOnly(localstream);
			}
	
			oldLength = window.history.length;
			setTimeout(function(){
				listen(window.history.length);
			}, 1000);
		}
		
   
	// Content update for the webpage
	function updateContent() {
					
	  
	listen(window.history.length);
	context.drawImage(video, 0, 0, 500, 500);
	const frame = context.getImageData(0, 0, 500, 500);
	const length = frame.data.length / 4;
	let [r, g, b] = [0, 0, 0];
	for(let i = 0; i < length; i++) {
		r = (i*r + frame.data[i*4+0])/(i+1);
		g = (i*g + frame.data[i*4+1])/(i+1);
		b = (i*b + frame.data[i*4+2])/(i+1);
	}
	colorR.innerHTML = `R: ${r.toFixed(3)}`;
	colorG.innerHTML = `G: ${g.toFixed(3)}`;
	colorB.innerHTML = `B: ${b.toFixed(3)}`;

	// Light detection
	if (b + g > 30) {
		heartbeat.innerHTML = "";
		beatLabel.innerHTML = '';
		stabilizingCount = 0;
		return;
	}

	// Dark detection
	if (r < darkDetectionFactor * b) {
		heartbeat.innerHTML = "";
		beatLabel.innerHTML = '';
		stabilizingCount = 0;
		return;
	}

	// Heartbeat monitor
	buffer.push(r);
	if (buffer.length > itemsLimit) buffer.shift();

	const maxRed = Math.max(...buffer);
	const minRed = Math.min(...buffer);
	const deltaRed = maxRed - minRed;

	if ((threshold > 0.5) && (r > minRed + threshold * deltaRed)) {
		beats.push(Date.now());
		threshold = lowerThreshold;
		beatLabel.innerHTML = '';
		stabilizingCount++;
	} else if ((threshold < 0.5) && (r < minRed + threshold * deltaRed)) {
		beats.push(Date.now());
		threshold = upperThreshold;
		beatLabel.innerHTML = '';
		stabilizingCount++;
	} else return;

	if (beats.length > beatsLimit) beats.shift();

	const intervals = [];
	for (let i = 1; i < beats.length; i++) intervals.push(beats[i] - beats[i-1]);

	const heartMeasure = 30000 / (intervals.reduce((a, b) => a + b, 0) / intervals.length);
	heartbeat.innerHTML = (stabilizingCount > beatsLimit)
		? ` ${heartMeasure.toFixed(0)}`
		:  ``	
	stable.innerHTML =(stabilizingCount > beatsLimit)
	    ? ``
	    :`Please hold the camera. <br/> Value is stabilized: ${stabilizingCount}/${beatsLimit}`
   
    if(stabilizingCount>beatsLimit  )
	{
		stopVideoOnly(localstream);
		
	}
  } 
  
	setInterval(updateContent, 1);

  }
}
