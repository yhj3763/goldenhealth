import { Component, OnInit } from '@angular/core';
import { LoginPage } from 'src/app/login/login.page';
import { AngularFirestore } from "@angular/fire/compat/firestore"; //import the firestore database
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FireserviceService } from '../fireservice.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  private uid = this.logininfo.uid();
  users: Observable<any>;
  info: Observable<any>;
  public data: any;
  public height: any;
  public bmi:any;

  public updatePersonalInfo:boolean;


  public nameChange: boolean;
  public HeightChange: boolean;
  public WeightChange: boolean;



  public emailChange: boolean;
  hidePassword = true;
  passwordToggleIcon = 'eye-off';


  public hideName: boolean;
  public hideEmail: boolean;

  constructor(
    public router:Router,
    public fireService:FireserviceService, 
    public logininfo: LoginPage,
    public firestore: AngularFirestore,
  ) {}
  ngOnInit() {
    this.users = this.firestore.collection("users").doc(this.uid).collection("PersonalInfo").valueChanges();
    this.firestore.collection("users").doc(this.uid).collection("PersonalInfo").doc(this.uid)
                  .valueChanges().subscribe(res => {
                    this.data = res;
                    var kgweight = this.data['weight']/2.205;
                    var BMI = (kgweight/(this.data['height']/100 * this.data['height']/100)).toFixed(2);
                    console.log(BMI); 
                    this.bmi = BMI;
                    

    }); 

  }
  logout(){
  //this.fireService.logout();
  const test_id = this.uid;
  localStorage.removeItem('test_id');
  this.router.navigateByUrl('');
}
//not done , working on it 
/*(){
  let myContainer = document.getElementById('recommdation') as HTMLInputElement;
  console.log("this"+this.bmi)
  console.log(14.00<this.bmi&&this.bmi<18.00)
  if(this.bmi<=14.00){
    myContainer.innerHTML = "Your BMI is dangerously low. While a diagnosis cannot be formed, people with a BMI of this level can suffer from Organ failure. Contact your primary doctor as soon as possible.";
  }else if(14.00<this.bmi&&this.bmi<18.00){
    myContainer.innerHTML = "You are considered underweight on the BMI scale, which can lead to malnutrition, vitamin deficiencies, or anemia. Talk with your doctor about what you can do to prevent this.      ";
  }else if(18.00<=this.bmi&&this.bmi<=24.00){
    myContainer.innerHTML = "You’re within a healthy range, congratulations!      ";
  }else if(24.00<this.bmi&&this.bmi<30.00){
    myContainer.innerHTML = 'You are considered Overweight on the BMI scale. This can cause health risks, so we recommend speaking to your doctor about what this means for your health.';
  }else if(30.00<=this.bmi&&this.bmi<40.00){
    myContainer.innerHTML = "You are considered Obese on the BMI scale. This has adverse health effects and can lead to Heart Disease, Diabetes, and many other health problems. Speak to your doctor to see whether or not you are at risk.      ";
  }else if(this.bmi>40.00){
    myContainer.innerHTML = "You are considered Extremely Obese. You are at greater risk of health problems such as Heart Disease, High Blood Pressure, Diabetes, and many other health issues. Speak to your doctor as soon 

*/


  editpersonalinfo() {
    this.updatePersonalInfo = !this.updatePersonalInfo;
    // this.hideName = !this.hideName;
  }

    editUserName(){
      this.nameChange = !this.nameChange;
    }
    editname(){
      let nameChanges = (document.getElementById("changename") as HTMLInputElement).value;
      this.firestore.collection("users").doc(this.uid).collection("PersonalInfo").doc(this.uid).update({
        name: nameChanges
        }); 
      console.log("Your Name Had been changed to: "+ nameChanges)
      this.editUserName()

    }



    editUserEmail(){
      this.emailChange = !this.emailChange;
    }
    editemail(){
      let emailChanges = (document.getElementById("changeemail") as HTMLInputElement).value;
      let oldemail = (document.getElementById("oldemail") as HTMLInputElement).value;
      let password = (document.getElementById("password") as HTMLInputElement).value;
      this.fireService.auth
        .signInWithEmailAndPassword(oldemail, password)
        .then(function(userCredential) {
            userCredential.user.updateEmail(emailChanges)
        })
      this.firestore.collection("users").doc(this.uid).collection("PersonalInfo").doc(this.uid).update({
        email: emailChanges
          }); 
      console.log("Your Email Had been changed to: "+ emailChanges)

    }
    public getType() {
      return this.hidePassword ? 'password' : 'text';
    }
    togglePassword(){
      this.hidePassword = !this.hidePassword;
      if(this.passwordToggleIcon == 'eye-off'){
        this.passwordToggleIcon = 'eye';
      }else{
        this.passwordToggleIcon = 'eye-off';
      }
      return;
    }


    editUserHeight(){
      this.HeightChange = !this.HeightChange;
    }
    editHeight(){
      let HeightChanges = (document.getElementById("changeHeight") as HTMLInputElement).value;
      this.firestore.collection("users").doc(this.uid).collection("PersonalInfo").doc(this.uid).update({
        height: HeightChanges
        }); 
      console.log("Your Height Had been changed"+ HeightChanges)
      this.editUserHeight()
      }

      editUserWeight(){
        this.WeightChange = !this.WeightChange;
      }
      editWeight(){
        let WeightChanges = (document.getElementById("changeWeight") as HTMLInputElement).value;
        this.firestore.collection("users").doc(this.uid).collection("PersonalInfo").doc(this.uid).update({
          weight: WeightChanges
          }); 
          console.log("Your Weight Had been changed"+ WeightChanges)
          this.editUserWeight()
          
        }
  
}

