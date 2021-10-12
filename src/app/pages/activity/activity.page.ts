import { Component, OnInit } from '@angular/core';
import { LoginPage } from 'src/app/login/login.page';
import { FireserviceService } from '../../fireservice.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


interface Workout {
  date: number,
  workout: string,
  sets: string,
  reps: number,
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
  public Workout_name: any;
  public Set: any;
  public Reps: any;
  form: FormGroup;
  // ngonit function to be assigned
  public userid: number;

  constructor(    
    public router:Router,
    public fireService:FireserviceService, 
    private _formBuilder: FormBuilder, 
    public logininfo: LoginPage  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this._formBuilder.group({
      date: ['', Validators.required],
      workout: ['', Validators.required],
      sets: ['', Validators.required],
      reps: ['', Validators.required],
      notes: ['', Validators.required]
      // userid: [this.userid, Validators.required]
    })
  }

  sendData() {
    console.log('TODO: send form data to firebase');
  }

  saveactivity(){
    let data = {
      Date:this.Date.split('T')[0],
      Workout_name: this.Workout_name,
      Set: this.Set,
      Reps: this.Reps,
      uid:this.uid
    }
    this.fireService.saveActivity(data).then(res=>{
      console.log("Activity saved")
      console.log(this.Date)
      },err=>{
        console.log(this.Date)
        console.log(err);
      });
  }
}
