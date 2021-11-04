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
                    console.log(res);
                    this.data = res;
                    var kgweight = this.data['weight']/2.205;
                    var BMI = (kgweight/(this.data['height']/100 * this.data['height']/100)).toFixed(2);
                    console.log(BMI); 
                    this.bmi = BMI;
    }); 
 }
  
}
