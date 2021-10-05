import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.page.html',
  styleUrls: ['./bmi.page.scss'],
})
export class BmiPage implements OnInit {

  public height:any;
  public weight:any;
  constructor() { }

  ngOnInit() {
  }

  calculate(){
    var kgweight = this.weight/2.205;
    var BMI = (kgweight/(this.height * this.height)).toFixed(2);
    let myContainer = document.getElementById('mybmi') as HTMLInputElement;
    
    return myContainer.innerHTML = BMI;;
    }
}
