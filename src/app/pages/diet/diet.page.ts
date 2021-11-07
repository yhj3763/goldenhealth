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
  public meal:string;
  public food:any;
  public calories:any;
  public protein:any;
  public carbs:any;
  public fat:any;
  public todaytarget:any;
  public data: any;

  users: Observable<any>;


  showMeal: boolean = false;
  showFood: boolean = false;
  showMacros: boolean = false;
  showInput: boolean = false;

  form: FormGroup;
  // ngonit function to be assigned
  //private userid: number;
  targetC: FormGroup;

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
  todaydate = new Date()
  inputdate = this.todaydate.getFullYear() + "-" + 
            (("0" + (this.todaydate.getMonth() + 1)).slice(-2)) + "-"+
            (("0" + this.todaydate.getDate()).slice(-2))
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
    console.log(this.inputdate);
    this.users = this.firestore.collection("users").doc(this.uid).
          collection("diet").doc(this.uid).collection(this.inputdate).valueChanges();
    this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid).collection(this.inputdate+":Target").doc("TargetCalories").valueChanges().subscribe(res => {
            console.log(res);
            this.data = res;
            var temp = this.data['targeted_Calories'];
            this.todaytarget = temp;
          }); 
  }
  /*
  get variables from diet
      this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid).collection(this.inputdate).valueChanges().subscribe(res => {
            this.data = res;
            this."your variables" = this.data['""variabel name in firebase'];
            this."your variables" = this.data['calories'];
            this."your variables" = this.data['protein'];
            this."your variables" = this.data['carbs'];
            this."your variables" = this.data['fat'];
            //the your variable will have the datas 
          }); 

  */
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
    this.targetC = this._formBuilder.group({
      Targeted_Calories:['', Validators.required]
    })
  }

  sendData() {
    this.list.push("Meal : "      + this.meal),
    this.list.push("Food : "      + this.food),
    this.list.push("Calories : "  + this.calories),
    this.list.push("Protein : "   + this.protein),
    this.list.push("Carbs : "     + this.carbs),
    this.list.push("Fat : "       + this.fat)
    let data = {
      Date:this.Date.split('T')[0],
      meal:this.list,
      Type:this.meal,
      uid:this.uid,
      DateType:this.Date.split('T')[0]+":"+this.meal+":"+this.food,
      }
    this.fireService.saveDiet(data).then(res=>{
      console.log("Diet saved")
      location.reload();
      },err=>{
        console.log('error')
        console.log(err);
      });  
    
    }
    //get targetcalories

    //save targetcalories
    saveTargetCalories(){
      let data = {
        Date:this.inputdate,
        uid:this.uid,
        targeted_Calories:this.Targeted_Calories,
        }
      this.fireService.savetaget(data).then(res=>{
        console.log("Target saved")
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
        console.log('response ', response);
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
}
