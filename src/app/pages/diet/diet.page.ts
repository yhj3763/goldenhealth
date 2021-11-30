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
  // satfat: number
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
  public suggestiondata: any;
  users: Observable<any>;


  showMeal: boolean = false;
  showFood: boolean = false;
  showMacros: boolean = false;
  showInput: boolean = false;

  public updateDietInfo:boolean;
  public updateMealName:boolean;
  public updateFood:boolean;
  public updateCalories:boolean;
  public updateProtein:boolean;
  public updateCarbs:boolean;
  public updateFat:boolean;
  form: FormGroup;
  // ngonit function to be assigned
  //private userid: number;
  targetC: FormGroup;

  meals: Array<Meal> = [];
  list: Array<any> = [];
  testing: Array<any> = [];
  reccomendation: Array<any> = [];
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
    this.Datasuggestions();
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
      fat: ['', Validators.required],
      //additional inputs --Jackie
      satfat:['', Validators.nullValidator],//ignore if no input 
      monofat:['', Validators.nullValidator],
      polyfat:['', Validators.nullValidator],
      fiber:['', Validators.nullValidator],
      sugar:['', Validators.nullValidator],
      sodium:['', Validators.required],
      cholesterol:['', Validators.required],
      netcarbs:['', Validators.required]

      // satfat: ['', Validators.required]

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
    // this.list.push("Sat. Fat : "   + this.satfat)
    //addition inputs, if undefine/no input it will input no input inteasd of undefine 
    if (this.satfat == undefined){
      this.list.push("satfat : No Input"    )
    }else{
      this.list.push("satfat : "    + this.satfat)
    }//monofat
    if (this.monofat == undefined){
      this.list.push("monofat : No Input"    )
    }else{
      this.list.push("monofat : "    + this.monofat)
    }//polyfat
    if (this.polyfat == undefined){
      this.list.push("polyfat : No Input"    )
    }else{
      this.list.push("polyfat : "    + this.polyfat)
    }//fiber
    if (this.fiber == undefined){
      this.list.push("fiber : No Input"    )
    }else{
      this.list.push("fiber : "    + this.fiber)
    }//sugar
    if (this.sugar == undefined){
      this.list.push("sugar : No Input"    )
    }else{
      this.list.push("sugar : "    + this.sugar)
    }
    //this.list.push("satfat : "    + this.satfat),
    //this.list.push("monofat : "   + this.monofat),
    //this.list.push("polyfat : "   + this.polyfat),
    //this.list.push("fiber : "     + this.fiber),
    //this.list.push("sugar : "     + this.sugar),
    this.list.push("sodium : "    + this.sodium),
    this.list.push("cholesterol : "    + this.cholesterol),
    this.list.push("netcarbs : "  + this.netcarbs)
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

    editdietinfo() {
      this.updateDietInfo = !this.updateDietInfo;
      // this.hideName = !this.hideName;
    }

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
//Update Area______________________________________//Update Area______________________________________//Update Area______________________________________
//Update Area______________________________________//Update Area______________________________________//Update Area______________________________________
//Update Area______________________________________//Update Area______________________________________//Update Area______________________________________
//________________Update Food___________________
    editFood(){
      this.updateFood = !this.updateFood;
      }
    editdietFood(){
      let FoodnameChange = (document.getElementById("food") as HTMLInputElement).value;
      let navbar = document.getElementById("List").querySelectorAll('li');
      let MealType = navbar[0].innerHTML.split(' : ')[1]
      let Foodname = navbar[1].innerHTML.split(' : ')[1]
      let updatedlist: Array<any> = []
      let newdatetype = this.inputdate+":"+MealType+":"+FoodnameChange
      for(var i = 0;i<navbar.length;i++){
        if(i == 1){
          updatedlist.push("Food : "+FoodnameChange)
          console.log(FoodnameChange)
        }else{
          updatedlist.push(navbar[i].innerHTML)
          console.log(navbar[i].innerHTML)
        }
      }
      console.log(FoodnameChange)
      console.log(newdatetype)
      let data = {
        Date:this.inputdate,
        meal:updatedlist,
        Type:MealType,
        uid:this.uid,
        DateType:newdatetype
        }
      this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid)
      .collection(this.inputdate).doc(newdatetype).set(data).then(res=>{
        console.log("Diet saved")
        },err=>{
          console.log(this.Date)
          console.log(err);
        });
      this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid)
        .collection(this.inputdate).doc(this.inputdate+":"+MealType+":"+Foodname).delete();

      console.log("Your Food name has been changed to: "+ FoodnameChange);
      this.editFood();
      }
//________________Update Food___________________
//________________Update meal type___________________
editMeal(){
  this.updateMealName = !this.updateMealName;

}
editdietMeal(){
  let MealChange = (document.getElementById("meal") as HTMLSelectElement).value;
  console.log("Newmae"+MealChange)
  let navbar = document.getElementById("List").querySelectorAll('li');
  let MealType = navbar[0].innerHTML.split(' : ')[1]
  let Foodname = navbar[1].innerHTML.split(' : ')[1]
  let updatedlist: Array<any> = []
  let newdatetype = this.inputdate+":"+MealChange+":"+Foodname
  for(var i = 0;i<navbar.length;i++){
    if(i == 0){
      updatedlist.push("Meal : "+MealChange)
      console.log(MealChange)
    }else{
      updatedlist.push(navbar[i].innerHTML)
      console.log(navbar[i].innerHTML)
    }
  }
  console.log(MealChange)
  console.log(newdatetype)
  let data = {
    Date:this.inputdate,
    meal:updatedlist,
    Type:MealType,
    uid:this.uid,
    DateType:newdatetype
    }
  this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid)
  .collection(this.inputdate).doc(newdatetype).set(data).then(res=>{
    console.log("Diet saved")
    },err=>{
      console.log(this.Date)
      console.log(err);
    });
  this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid)
    .collection(this.inputdate).doc(this.inputdate+":"+MealType+":"+Foodname).delete();

  console.log("Your Meal Type has been changed to: "+ MealChange);
  this.editMeal();
}

//________________Update meal type___________________

//________________update Calories___________________-
editCalories(){
  this.updateCalories = !this.updateCalories;

}
editdietCalories(){
  let CaloriesChange = (document.getElementById("calories") as HTMLInputElement).value;
  let navbar = document.getElementById("List").querySelectorAll('li');
  let MealType = navbar[0].innerHTML.split(' : ')[1]
  let Foodname = navbar[1].innerHTML.split(' : ')[1]
  let updatedlist: Array<any> = []
  for(var i = 0;i<navbar.length;i++){
    if(i == 2){
      updatedlist.push("Calories : "+CaloriesChange)
      console.log(CaloriesChange)
    }else{
      updatedlist.push(navbar[i].innerHTML)
      console.log(navbar[i].innerHTML)
    }
  }
  console.log(CaloriesChange)
  console.log(this.inputdate+":"+MealType+":"+Foodname)
  this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid)
    .collection(this.inputdate).doc(this.inputdate+":"+MealType+":"+Foodname).update({
      meal:updatedlist,
    }); 
  console.log("Your Calories has been changed to: "+ CaloriesChange);
  location.reload();
  this.editCalories();
}

//________________update Calories___________________-

//________________update Protein___________________-
editProtein(){
  this.updateProtein = !this.updateProtein;

}
editdietProtein(){
  let proteinChange = (document.getElementById("protein") as HTMLInputElement).value;
  let navbar = document.getElementById("List").querySelectorAll('li');
  let MealType = navbar[0].innerHTML.split(' : ')[1]
  let Foodname = navbar[1].innerHTML.split(' : ')[1]
  let updatedlist: Array<any> = []
  for(var i = 0;i<navbar.length;i++){
    if(i == 3){
      updatedlist.push("Protein : "+proteinChange)
      console.log(proteinChange)
    }else{
      updatedlist.push(navbar[i].innerHTML)
      console.log(navbar[i].innerHTML)
    }
  }
  console.log(proteinChange)
  console.log(this.inputdate+":"+MealType+":"+Foodname)
  this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid)
    .collection(this.inputdate).doc(this.inputdate+":"+MealType+":"+Foodname).update({
      meal:updatedlist,
    }); 

  console.log("Your Protein has been changed to: "+ proteinChange);
  this.editProtein();
}
//________________update Protein___________________-


//________________update Carb___________________-
editCarbs(){
  this.updateCarbs = !this.updateCarbs;

}
editdietCarbs(){
  let CarbChange = (document.getElementById("carbs") as HTMLInputElement).value;
  let navbar = document.getElementById("List").querySelectorAll('li');
  let MealType = navbar[0].innerHTML.split(' : ')[1]
  let Foodname = navbar[1].innerHTML.split(' : ')[1]
  let updatedlist: Array<any> = []
  for(var i = 0;i<navbar.length;i++){
    if(i == 4){
      updatedlist.push("Carb : "+CarbChange)
      console.log(CarbChange)
    }else{
      updatedlist.push(navbar[i].innerHTML)
      console.log(navbar[i].innerHTML)
    }
  }
  console.log(CarbChange)
  console.log(this.inputdate+":"+MealType+":"+Foodname)
  this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid)
    .collection(this.inputdate).doc(this.inputdate+":"+MealType+":"+Foodname).update({
      meal:updatedlist,
    }); 

  console.log("Your Carb has been changed to: "+ CarbChange);
  this.editCarbs();
}
//________________update Carb___________________-
//________________update fat___________________-
editFat(){
  this.updateFat = !this.updateFat;

}
editdietFat(){
  let FatChange = (document.getElementById("fat") as HTMLInputElement).value;
  let navbar = document.getElementById("List").querySelectorAll('li');
  let MealType = navbar[0].innerHTML.split(' : ')[1]
  let Foodname = navbar[1].innerHTML.split(' : ')[1]
  let updatedlist: Array<any> = []
  for(var i = 0;i<navbar.length;i++){
    if(i == 5){
      updatedlist.push("Fat : "+FatChange)
      console.log(FatChange)
    }else{
      updatedlist.push(navbar[i].innerHTML)
      console.log(navbar[i].innerHTML)
    }
  }
  console.log(FatChange)
  console.log(this.inputdate+":"+MealType+":"+Foodname)
  this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid)
    .collection(this.inputdate).doc(this.inputdate+":"+MealType+":"+Foodname).update({
      meal:updatedlist,
    }); 

  console.log("Your Fat has been changed to: "+ FatChange);
  this.editFat();
}
//________________update fat___________________-


//Update Area______________________________________//Update Area______________________________________//Update Area______________________________________
//Update Area______________________________________//Update Area______________________________________//Update Area______________________________________
//Update Area______________________________________//Update Area______________________________________//Update Area______________________________________



  deletedata(){
    let navbar = document.getElementById("List").querySelectorAll('li');
    var mealtype= navbar[0].innerHTML.split(' : ')[1]
    var food= navbar[1].innerHTML.split(' : ')[1]
    this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid)
    .collection(this.inputdate).doc(this.inputdate+":"+mealtype+":"+food).delete();
    location.reload();

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
                'rgba(209, 25, 19, 0.3)'
              ],
              borderColor: [
                'rgb(209, 25, 19)'
              ],
              borderWidth: 1,
              barPercentage: 0.5,
              maxBarThickness: 100,
              stack: 'Stack 0'
            },
            {
              label: 'Lunch',
              data: [],
              backgroundColor:[
                'rgba(242, 242, 24, 0.3)'
              ],
              borderColor: [
                'rgb(242, 242, 24)'
              ],
              borderWidth: 1,
              barPercentage: 0.5,
              maxBarThickness: 100,
              stack: 'Stack 0'
            },
            {
              label: 'Dinner',
              data: [],
              backgroundColor:[
                'rgba(325, 170, 90, 0.3)'
              ],
              borderColor: [
                'rgb(325, 170, 90)'
              ],
              borderWidth: 1,
              barPercentage: 0.5,
              maxBarThickness: 100,
              stack: 'Stack 0'
            },
            {
              label: 'Snacks',
              data: [],
              backgroundColor:[
                'rgba(39, 245, 238, 0.3)'
              ],
              borderColor: [
                'rgb(39, 245, 238)'
              ],
              borderWidth: 1,
              barPercentage: 0.5,
              maxBarThickness: 100,
              stack: 'Stack 0'
            },
            {
              label: 'Workout',
              data: [],
              backgroundColor:[
                'rgba(33, 196, 77, 0.3)'
              ],
              borderColor: [
                'rgb(33, 196, 77)'
              ],
              borderWidth: 1,
              barPercentage: 0.5,
              maxBarThickness: 100,
              stack: 'Stack 0'
            },
            {
              label: 'Targeted',
              data: [],
              backgroundColor:[
                'rgba(400, 222, 80, 0.3)'
              ],
              borderColor: [
                'rgb(400, 222, 80)'
              ],
              borderWidth: 1,
              barPercentage: 0.5,
              maxBarThickness: 100,
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
Datasuggestions()
{
  var caloriedata: number;
  var pullcalorie;
  var datafoodbuffersuggestion; //food calories
  var foodcalorienumber: number;
  var foodtype: Array<any> = []; //Data for food type + Calories
    //var foodarraybuf;
  var foodcaloriebuffersuggestion: number;
  this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid).collection(this.inputdate+":Target")
    .doc("TargetCalories").valueChanges().subscribe(res => {
      this.suggestiondata = res;
    pullcalorie = this.suggestiondata['targeted_Calories']; //pulled data from firebase
    caloriedata = pullcalorie; //targeted calories
    });
      //total calories for the day :(
    this.firestore.collection("users").doc(this.uid).collection("diet").doc(this.uid).collection(this.inputdate)
    .valueChanges().subscribe(res => {
      //console.log(res)
      this.reccomendation.push(res)
      //console.log(this.testing)
      /*console.log(this.testing[0])*/
      //console.log(this.testing[0].length)
      for(var i = 0; i < this.reccomendation[0].length; i++){
      //console.log(this.testing[0][i]['meal'][0])
      datafoodbuffersuggestion = this.reccomendation[0][i]['meal'][2]
      foodcalorienumber = parseInt(datafoodbuffersuggestion.split(': ')[1], 10);
      foodtype.push(foodcalorienumber);
      console.log(foodtype);
    }
  for(var p = 0; p<foodtype.length; p++)
  {
    foodcaloriebuffersuggestion = foodtype.reduce((a,b) => a+b, 0);
    console.log(foodcaloriebuffersuggestion);
  }

  let myContainer = document.getElementById('reccomendation') as HTMLInputElement;
  //if statements
  if(caloriedata < foodcaloriebuffersuggestion){
    return myContainer.innerHTML = "You have exceded your target calories for the day.";
  }else if(caloriedata > foodcaloriebuffersuggestion){
    return myContainer.innerHTML = "You have not yet met your target calories";
  }else if (caloriedata = foodcaloriebuffersuggestion){
    // (11/22/2021) fixed below -James
    return myContainer.innerHTML = "You have met your target calories! Good job! :D !!";
  }
  });

 }
}
