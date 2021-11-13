import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.page.html',
  styleUrls: ['./bmi.page.scss'],
})
export class BmiPage implements OnInit {

  public height:any;
  public weight:any;
  public BMI:any;
  constructor() { }

  ngOnInit() {
  }

  calculate(){
    var kgweight = this.weight/2.205;
    this.BMI = (kgweight/(this.height * this.height)).toFixed(2);
    let myContainer = document.getElementById('mybmi') as HTMLInputElement;
    this.recommendation();
    return myContainer.innerHTML = this.BMI;;
    }
  recommendation(){
    let myContainer = document.getElementById('recommdation') as HTMLInputElement;
    console.log(this.BMI)
    if(this.BMI<=14.00){
      return myContainer.innerHTML = "Your BMI is dangerously high. While a diagnosis cannot be formed, people with a BMI of this level can suffer from Organ failure. Contact your primary doctor as soon as possible.";
    }else if(14.00<this.BMI&&this.BMI<18.00){
      return myContainer.innerHTML = "    You are considered underweight on the BMI scale, which can lead to malnutrition, vitamin deficiencies, or anemia. Talk with your doctor about what you can do to prevent this.      ";
    }else if(18.00<=this.BMI&&this.BMI<=24.00){
      return myContainer.innerHTML = "        You’re within a healthy range, congratulations!      ";
    }else if(24.00<this.BMI&&this.BMI<30.00){
      return myContainer.innerHTML = "You are considered Overweight on the BMI scale. This can cause health risks, so we recommend speaking to your doctor about what this means for your health.";
    }else if(30.00<=this.BMI&&this.BMI<40.00){
      return myContainer.innerHTML = "     You are considered Obese on the BMI scale. This has adverse health effects and can lead to Heart Disease, Diabetes, and many other health problems. Speak to your doctor to see whether or not you are at risk.      ";
    }else if(this.BMI>40.00){
      return myContainer.innerHTML = "    You are considered Extremely Obese. You are at greater risk of health problems such as Heart Disease, High Blood Pressure, Diabetes, and many other health issues. Speak to your doctor as soon as possible.";
    }else{
      return myContainer.innerHTML ="NONE"
    }
  }
}
/*
    0-14: Dangerously Underweight
    Your BMI is dangerously high. While a diagnosis cannot be formed, people with a BMI of this level can suffer from Organ failure. Contact your primary doctor as soon as possible.
    14.1 - 17.9 Underweight
    You are considered underweight on the BMI scale, which can lead to malnutrition, vitamin deficiencies, or anemia. Talk with your doctor about what you can do to prevent this.
    18 - 24: Healthy
    You’re within a healthy range, congratulations!
    24.1 - 29.9: 
    You are considered Overweight on the BMI scale. This can cause health risks, so we recommend speaking to your doctor about what this means for your health.
    30 - 39
    You are considered Obese on the BMI scale. This has adverse health effects and can lead to Heart Disease, Diabetes, and many other health problems. Speak to your doctor to see whether or not you are at risk.
    40 and up
    You are considered Extremely Obese. You are at greater risk of health problems such as Heart Disease, High Blood Pressure, Diabetes, and many other health issues. Speak to your doctor as soon as possible.

*/ 

