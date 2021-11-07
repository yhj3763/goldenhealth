import { Component, OnInit } from '@angular/core';
import { LoginPage } from 'src/app/login/login.page';
import { FireserviceService } from '../../fireservice.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFirestore } from "@angular/fire/compat/firestore"; //import the firestore database

interface Workout {
  date: number,
  workout: string,
  sets: string,
  reps: number,
  time: number,
  notes: string
}
// { date: '11/9/69', workout: 'push-ups', sets: '6', reps
// : 9, notes: N/A}, 
@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {
  private uid = this.logininfo.uid();
  public Date:any;
  public Workout: any;
  public Sets: any;
  public Reps: any;
  public Time: number;
  public Notes: any;
  form: FormGroup;
  // ngonit function to be assigned
  public userid: number;
  users: Observable<any>;
  todaydate = new Date();
  inputdate = this.todaydate.getFullYear() + "-" + 
              (("0" + (this.todaydate.getMonth() + 1)).slice(-2)) + "-"+
              (("0" + this.todaydate.getDate()).slice(-2))
  constructor(    
    public router:Router,
    public fireService:FireserviceService, 
    private _formBuilder: FormBuilder, 
    public logininfo: LoginPage,
    public firestore: AngularFirestore
    ) { }

  ngOnInit() {
    this.buildForm();
    console.log(this.inputdate);
    this.users = this.firestore.collection("users").doc(this.uid).
          collection("activity").doc(this.uid).collection(this.inputdate).valueChanges();
  }

  buildForm() {
    this.form = this._formBuilder.group({
      date: ['', Validators.required],
      workout: ['', Validators.required],
      sets: ['', Validators.required],
      reps: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['', Validators.required]
      // userid: [this.userid, Validators.required]
    })
  }


  workout_list: Array<any> = [];
  /* 
    [0] Workout Name
    [1] Sets
    [2] Reps：
    [3] Notes
  */
  sendData(){
    this.workout_list.push("Workout Name: "+this.Workout),
    this.workout_list.push("Sets: "+this.Sets),
    this.workout_list.push("Reps："+this.Reps),
    this.workout_list.push("Time: "+this.Time),
    this.workout_list.push("Notes: "+this.Notes)
    let data = {
      Date:     this.Date.split('T')[0],
      Workout:  this.workout_list,
      uid:      this.uid,
      DateType: this.Date.split('T')[0]+":"+this.Workout
    }
    this.fireService.saveActivity(data).then(res=>{
      console.log("Activity saved")
      },err=>{
        console.log(this.Date)
        console.log(err);
      });
  }
}
