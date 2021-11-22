import { Component, ɵgetComponentViewDefinitionFactory } from '@angular/core';
import { FireserviceService } from '../../fireservice.service';
import { AngularFirestore } from "@angular/fire/compat/firestore"; 
import { LoginPage } from 'src/app/login/login.page';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';




@Component({
  selector: 'app-rate-pressure',
  templateUrl: './rate-pressure.page.html',
  styleUrls: ['./rate-pressure.page.scss'],
})
export class RatePressurePage {

   private uid = this.logininfo.uid();
   public age: any;
   public data: any;
   users: Observable<any>;
   info: Observable<any>;
  
  constructor(
	public router:Router,
	public fireService:FireserviceService, 
    public logininfo: LoginPage,
    public firestore: AngularFirestore
  ) {}
   
  ngOnInit() {	

	// Element declaration
	const canvas = <HTMLCanvasElement> document.getElementById('canvas'); 
	const colorR = document.getElementById('color-r');
	const colorG = document.getElementById('color-g');
	const colorB = document.getElementById('color-b');
	var heartbeat = document.getElementById('heartbeat');
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

	var oldLength =0;

	var localstream;
	

	// Initial flexible threshold
	let threshold = upperThreshold;
	
	
	document.getElementById('startbutton').addEventListener("click", function(){
        
		oldLength=window.history.length;
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
				stable.innerHTML =``
			}
			
	
			
		}
		
	var age = 0;
	this.users = this.firestore.collection("users").doc(this.uid).collection("PersonalInfo").valueChanges();
	this.firestore.collection("users").doc(this.uid).collection("PersonalInfo").doc(this.uid)
		.valueChanges().subscribe(res => {
			this.data = res;
			age =this.data['age'];
		     
		});
   
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

	var heartMeasure = 35000 / (intervals.reduce((a, b) => a + b, 0) / intervals.length);
	
	if(stabilizingCount > beatsLimit)
	{
   
		if(heartMeasure<40)
		{
		   stabilizingCount = 0;
		   alert("The value for Heart Rate is not stable. Try it again!");
		}
        else
		{
			heartbeat.innerHTML = heartMeasure.toFixed(0);
			stopVideoOnly(localstream);

			
		}

		if(age>=18 && age<=35)
	    {
		   if(heartMeasure>73)
		   {
			  if(heartMeasure>100)
			  {
				 alert("A heartrate above 100 can be a sign of an irregular heartbeat, which can lead to more health problems down the line. We highly recommend seeking professional attention from your primary doctor.");
			  }
			  else
			  {
			 	alert("Your heartrate is shown to be below avg. Some things You can do to improve this is to start taking daily walks for upwards of 30 minutes");
			  }

		   }
		   else if(heartMeasure>=66 && heartMeasure<=73)
	       {
			   alert("Your heartrate is within a healthy range, keep it up! If you want to lower it further, cardiovascular exercises will help. A lower heart rate can prevent heart failure, as your heart has to work less hard to pump.");
	       }
		   else if(heartMeasure>=49 && heartMeasure<=65)
		   {
			   alert("You are in it to win it! Congratulations on having a healthy heart.");
		   }
	
	    }
	    else if(age>=36 && age<=55)
	    {
		   if(heartMeasure>75)
		   {
			   if(heartMeasure>100)
			   {
				   alert("A heartrate above 100 can be a sign of an irregular heartbeat, which can lead to more health problems down the line. We highly recommend seeking professional attention from your primary doctor.");
			   }
			   else
			   { 
				   alert("Your heartrate is shown to be below avg. Some things You can do to improve this is to start taking daily walks for upwards of 30 minutes");
			   }
		   }
		   else if(heartMeasure>=67 && heartMeasure<=74)
		   {
			  alert("Your heartrate is within a healthy range, keep it up! If you want to lower it further, cardiovascular exercises will help. A lower heart rate can prevent heart failure, as your heart has to work less hard to pump.");
		   }
		   else if(heartMeasure>=50 && heartMeasure<=64)
		   {
			  alert("You are in it to win it! Congratulations on having a healthy heart.");
		   }
	    }
	    else if(age>55)
	    {
		   if(heartMeasure>75)
		   {
			  if(heartMeasure>100)
			  {
				alert("A heartrate above 100 can be a sign of an irregular heartbeat, which can lead to more health problems down the line. We highly recommend seeking professional attention from your primary doctor.");
			  }
			  else
			  { 
				alert("Your heartrate is shown to be below avg. Some things You can do to improve this is to start taking daily walks for upwards of 30 minutes");
			  } 
		    }
		    else if(heartMeasure>=65 && heartMeasure<=74)
		    {
			    alert("Your heartrate is within a healthy range, keep it up! If you want to lower it further, cardiovascular exercises will help. A lower heart rate can prevent heart failure, as your heart has to work less hard to pump.");
		    }
		    else if(heartMeasure>=50 && heartMeasure<=64)
		    {
			   alert("You are in it to win it! Congratulations on having a healthy heart.");
		    }
	    }

		
	}

	stable.innerHTML =(stabilizingCount > beatsLimit)
	    ? ``
	    :`Please hold the camera. <br/> Value is stabilized: ${stabilizingCount}/${beatsLimit}`

	
 	
	
    if(stabilizingCount > beatsLimit )
	{
		stopVideoOnly(localstream);
		//stabilizingCount=0;	
	}
  } 
    
	setInterval(updateContent, 1);

  }
}
