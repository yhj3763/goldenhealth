import { Component, OnInit } from '@angular/core';
import { LoginPage } from 'src/app/login/login.page';
import { FireserviceService } from '../../fireservice.service';
import { Router } from '@angular/router';

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
  constructor(    public router:Router,
    public fireService:FireserviceService, 
    public logininfo: LoginPage  ) { }

  ngOnInit() {
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
