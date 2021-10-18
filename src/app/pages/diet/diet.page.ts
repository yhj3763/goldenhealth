import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { LoginPage } from 'src/app/login/login.page';
import { FireserviceService } from '../../fireservice.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from "@angular/fire/compat/firestore"; //import the firestore database
import { Observable } from 'rxjs';

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
  public Date:any;
  public Targeted_Calories:any;
  public meal:any;
  public food:any;
  public calories:any;
  public protein:any;
  public carbs:any;
  public fat:any;
  
  users: Observable<any>;


  showMeal: boolean = false;
  showFood: boolean = false;
  showMacros: boolean = false;
  showInput: boolean = false;

  form: FormGroup;
  // ngonit function to be assigned
  //private userid: number;

  mealTypes: Array<object> = [
    { name: 'Breakfast'},
    { name: 'Lunch'},
    { name: 'Dinner'},
    { name: 'Post Workout'},
    { name: 'Pre Workout'},
    { name: 'Snack'}
  ];

  meals: Array<Meal> = [];
  list: Array<any> = [];
  /**list
   [0] meal type
   [1] food name
   [2] calories
   [3] protein
   [4] carbs
   [5] fat
   */
  //{ type: 'Breakfast', food: 'Cereal', calories: '1990', protein
  //: 15, carbs: 30, fat: 10 ' }, {type: Breakfast, food: 'eggs'}

  //uid
  private uid = this.logininfo.uid();

  @ViewChild('barChart') barChart;
  public targetedCalories: number;
  constructor(
    public router:Router,
    public fireService:FireserviceService, 
    public logininfo: LoginPage,
    public firestore: AngularFirestore,
    private _formBuilder: FormBuilder 

  ) { }

  ngOnInit() {
    this.buildForm();
    this.getdata();
    this.users = this.firestore.collection("users").
                doc(this.uid).collection("diet").valueChanges();
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

  buildarray(){
    this.meals.push()
  }
  sendData() {
    this.list.push("Meal : "      + this.meal),
    this.list.push("Food : "      + this.food),
    this.list.push("Calories : "  + this.calories),
    this.list.push("Protein : "   + this.protein),
    this.list.push("Carbs : "     + this.carbs),
    this.list.push("Fat : "       + this.fat)
    let data = {
      Date:this.Date.split('T')[0]+ ":"+this.meal,
      //Targeted_Calories:this.Targeted_Calories,
      meal:this.list,
      uid:this.uid
      }
    this.fireService.saveDiet(data).then(res=>{
      console.log("Diet saved")
      location.reload();
      },err=>{
        console.log('error')
        console.log(err);
      });  
    
    }

    //getdatafrom firebase base on today 
    getdata(){
      this.firestore.collection("users").doc(this.uid).collection("diet").
        valueChanges().subscribe((response) => {
        console.log('reponse ', response);
        //(document.getElementById('display') as HTMLFormElement).innerhtml = response[0][0];*/
      })
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

  // mealClicked() {
  //   console.log('testing!');
  //   this.showFood = !this.showFood;
  // }

  // macrosClicked() {
  //   console.log('testing, again!');
  //   this.showFood = !this.showFood;
  //   this.showMacros = !this.showMacros;
  // }

  // addClicked() {
  //   console.log('testing, again, again!');
  //   this.showMeal = !this.showMeal;
  //   this.showMacros = !this.showMacros;
  //   this.showInput = !this.showInput;
  // }
}
