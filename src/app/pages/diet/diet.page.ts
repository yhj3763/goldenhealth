import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { LoginPage } from 'src/app/login/login.page';
import { FireserviceService } from '../../fireservice.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Meal {
  date: number,
  type: string,
  food: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number
}
@Component({
  selector: 'app-diet',
  templateUrl: './diet.page.html',
  styleUrls: ['./diet.page.scss'],
})
export class DietPage implements OnInit {
  //userinput
  // public Date:any;
  // public Targeted_Calories:any;
  // public Food_Name:any;
  // public Brand:any;
  // public Calories:any;
  // public Protein:any;
  // public Carbs:any;
  // public Fat:any;
  // public Fiber:any;
  // public Sugar:any;
  // public Sodium:any;
  // public Cholesterol:any;
  // showMeal: boolean = false;
  // showFood: boolean = false;
  // showMacros: boolean = false;
  // showInput: boolean = false;
  form: FormGroup;
  // ngonit function to be assigned
  public userid:any;
  uid = this.logininfo.uid();

  mealTypes: Array<object> = [
    { name: 'Breakfast'},
    { name: 'Lunch'},
    { name: 'Dinner'},
    { name: 'Post Workout'},
    { name: 'Pre Workout'},
    { name: 'Snack'}
  ];
  meals: Array<Meal> = [];
  //{ type: 'Breakfast', food: 'Cereal', calories: '1990', protein
  //: 15, carbs: 30, fat: 10 ' }, {type: Breakfast, food: 'eggs'}

  //uid
  // public uid = this.logininfo.uid();

  @ViewChild('barChart') barChart;
  public targetedCalories: number;
  public calories: number;
  constructor(
    public router:Router,
    public fireService:FireserviceService, 
    public logininfo: LoginPage,
    private _formBuilder: FormBuilder 

  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this._formBuilder.group({
      date: ['', Validators.required],
      meal: [this.meals, Validators.required],
      food: ['', Validators.required],
      calories: ['', Validators.required],
      protein: ['', Validators.required],
      carbs: ['', Validators.required],
      fat: ['', Validators.required]
      // userid: [this.userid, Validators.required]
      // targetedCalories: ['', Validators.required]
    })
  }

  sendData(){
    //change service 'loginWithEmail' with another for data submitted on this page
    this.fireService.sendData(this.form.value).then(res=>{
      console.log('RES', res);
      alert(res);
      
    },err=>{
      alert(err.message)
      console.log(err);
    })
  }

  savefood(){
    let data = {
      Date: '10/17/2021',
      // Food_Name:this.Food_Name,
      // Brand:this.Brand,
      Calories:this.form.get('calories'),
      // Protein:this.Protein,
      // Carbs:this.Carbs,
      // Fat:this.Fat,
      // Fiber:this.Fiber,
      // Sugar:this.Sugar,
      // Sodium:this.Sodium,
      // Cholesterol:this.Cholesterol,
      uid: this.uid
    }
    this.fireService.saveDiet(data).then(res=>{
      console.log("Diet saved")
      },err=>{
        console.log('error')
        console.log(err);
      });
  }
  createBarChart()
  {
    this.barChart = new Chart(this.barChart.nativeElement, {
    type: 'bar',
    data: {
      labels: ["Targeted"],
      datasets: [{
        label: 'Targeted vs Eaten Calories',
        barPercentage: 0.8,
        barThickness: 20,
        minBarLength: 2,
        data: [this.targetedCalories],
        backgroundColor: [
          'rgb(38,194, 129)',
          'rgb(38,194, 129)',
          'rgb(38,194, 129)'
        ]
      }]
    },
    options: {
      scales: {
          y: {
            beginAtZero: true
          }
      }
    },
  });
}

addData()
{
  this.barChart.data.datasets[0].data.push(this.calories);
  this.barChart.data.labels.push("test");
  this.barChart.update();
}

  // btnClicked() {
  //   console.log('btn Clicked. Yeaaaahhhh!');
  //   //this.createBarChart();
  //   this.showMeal = !this.showMeal;
  // }
}
