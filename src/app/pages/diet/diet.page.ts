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
  public graphdata:any;
  // New inputs below - Alex
  public satfat:any;
  public monofat:any;
  public polyfat:any;
  public fiber:any;
  public sugar:any;
  public sodium:any;
  public cholesterol:any;
  public netcarbs:any;
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
  testing: Array<any> = [];
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
    this.addTargetedData();
    this.addData();
  }

  ionViewWillEnter(){
    this.createBarChart();
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
  createBarChart(){
      this.barChart = new Chart(this.barChart.nativeElement, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Breakfast',
              data: [],
              backgroundColor: [
                'rgb(209, 25, 19)'
              ],
              maxBarThickness: 50,
              stack: 'Stack 0'
            },
            {
              label: 'Lunch',
              data: [],
              backgroundColor:[
                'rgb(242, 242, 24)'
              ],
              maxBarThickness: 50,
              stack: 'Stack 0'
            },
            {
              label: 'Dinner',
              data: [],
              backgroundColor:[
                'rgb(325, 170, 90)'
              ],
              maxBarThickness: 50,
              stack: 'Stack 0'
            },
            {
              label: 'Snacks',
              data: [],
              backgroundColor:[
                'rgb(39, 245, 238)'
              ],
              maxBarThickness: 50,
              stack: 'Stack 0'
            },
            {
              label: 'Workout',
              data: [],
              backgroundColor:[
                'rgb(33, 196, 77)'
              ],
              maxBarThickness: 50,
              stack: 'Stack 0'
            },
            {
              label: 'Targeted',
              data: [],
              backgroundColor:[
                'rgb(400, 222, 80)'
              ],
              maxBarThickness: 50,
              stack: 'Stack 1'
            }
          ]
        },
        options: {
          scales: {
              x:{
                stacked: true,
              },
              y: {
                beginAtZero: true,
                stacked: true
              }
          }
        }
      });
    }

    addTargetedData()
  {
    var chartdata;
    var chartdate;
    this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid).collection(this.inputdate+":Target")
    .doc("TargetCalories").valueChanges().subscribe(res => {
      console.log(res)
      this.graphdata = res;
      console.log(this.graphdata)
      var datedata = this.graphdata['Date'];
      console.log(datedata)

      var datachart = this.graphdata['targeted_Calories'];
      console.log(datachart)

      chartdata = datachart;
      console.log(chartdata)

      chartdate = datedata;
      console.log(chartdate)

      this.barChart.data.labels.push(chartdate);
      this.barChart.data.datasets[5].data.push(chartdata);
      this.barChart.update();
    });
  }

addData()
  {
    var datafoodbuffer;
    var datafoodbuffer2;
    var foodtype: Array<any> = [];
    var foodcalarraybreakfast: Array<any> = [];
    var foodcalarraylunch: Array<any> = [];
    var foodcalarraydinner: Array<any> = [];
    var foodcalarraysnacks: Array<any> = [];
    var foodcalarrayworkout: Array<any> = [];
    var foodarraybuf;
    var foodcaloriebuffer: number;
    var foodstringbuffer;
    var numberbufferbreakfast: number;
    var numberbufferlunch: number;
    var numberbufferdinner: number;
    var numberbuffersnacks: number;
    var numberbufferworkout: number;
    this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid).collection(this.inputdate)
    .valueChanges().subscribe(res => {
      console.log(res)
      this.testing.push(res)
      console.log(this.testing)
      /*console.log(this.testing[0])*/
      console.log(this.testing[0].length)
      for(var i = 0; i<this.testing[0].length;i++){
        console.log(this.testing[0][i]['meal'][0])
      datafoodbuffer = this.testing[0][i]['meal'][0]
      datafoodbuffer2 = this.testing[0][i]['meal'][2]
      foodtype.push(datafoodbuffer.split(':')[1]+':'+datafoodbuffer2.split(':')[1]);
      console.log(foodtype);
    }
    for(var j = 0; j<foodtype.length; j++)
    {
      foodarraybuf = foodtype[j];
      console.log(foodarraybuf.split(':'));
      foodstringbuffer = foodarraybuf.split(':')[0];
      console.log(foodstringbuffer);
      if(foodstringbuffer === " Breakfast")
      {
        foodcaloriebuffer = parseInt(foodarraybuf.split(':')[1], 10);
        foodcalarraybreakfast.push(foodcaloriebuffer);
        for(var k = 0; k<foodcalarraybreakfast.length; k++)
        {
          numberbufferbreakfast = foodcalarraybreakfast.reduce((a, b) => a+b, 0);
        }
        foodcaloriebuffer = 0;
      }
      if(foodstringbuffer === " Lunch")
      {
        foodcaloriebuffer = parseInt(foodarraybuf.split(':')[1], 10);
        foodcalarraylunch.push(foodcaloriebuffer);
        for(var l = 0; l<foodcalarraylunch.length; l++)
        {
          numberbufferlunch = foodcalarraylunch.reduce((a, b) => a+b, 0);
        }
        foodcaloriebuffer = 0;
      }
      if(foodstringbuffer === " Dinner")
      {
        foodcaloriebuffer = parseInt(foodarraybuf.split(':')[1], 10);
        foodcalarraydinner.push(foodcaloriebuffer);
        for(var g = 0; g<foodcalarraydinner.length; g++)
        {
          numberbufferdinner = foodcalarraydinner.reduce((a, b) => a+b, 0);
        }
        foodcaloriebuffer = 0;
      }
      if(foodstringbuffer === " Pre Workout")
      {
        foodcaloriebuffer = parseInt(foodarraybuf.split(':')[1], 10);
        foodcalarrayworkout.push(foodcaloriebuffer);
        for(var g = 0; g<foodcalarrayworkout.length; g++)
        {
          numberbufferworkout = foodcalarrayworkout.reduce((a, b) => a+b, 0);
        }
        foodcaloriebuffer = 0;
      }
      if(foodstringbuffer === " Post Workout")
      {
        foodcaloriebuffer = parseInt(foodarraybuf.split(':')[1], 10);
        foodcalarrayworkout.push(foodcaloriebuffer);
        for(var g = 0; g<foodcalarrayworkout.length; g++)
        {
          numberbufferworkout = foodcalarrayworkout.reduce((a, b) => a+b, 0);
        }
        foodcaloriebuffer = 0;
      }
      if(foodstringbuffer === " Snacks")
      {
        foodcaloriebuffer = parseInt(foodarraybuf.split(':')[1], 10);
        foodcalarraysnacks.push(foodcaloriebuffer);
        for(var v = 0; v<foodcalarraysnacks.length; v++)
        {
          numberbuffersnacks = foodcalarraysnacks.reduce((a, b) => a+b, 0);
        }
        foodcaloriebuffer = 0;
      }
    }
    this.barChart.data.datasets[0].data.push(numberbufferbreakfast);
    this.barChart.data.datasets[1].data.push(numberbufferlunch);
    this.barChart.data.datasets[2].data.push(numberbufferdinner);
    this.barChart.data.datasets[3].data.push(numberbuffersnacks);
    this.barChart.data.datasets[4].data.push(numberbufferworkout);
    this.barChart.update();
    foodcalarraybreakfast = [];
    foodcalarraylunch = [];
    foodcalarraydinner = [];
    foodcalarraysnacks = [];
    foodcalarraysnacks = [];
    });
}
}
