import { Component, OnInit } from '@angular/core';
import { LoginPage } from 'src/app/login/login.page';
import { FireserviceService } from '../../fireservice.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFirestore } from "@angular/fire/compat/firestore"; //import the firestore database

// interface Workout {
//   date: number,
//   workout: string,
//   sets: string,
//   reps: number,
//   time: number,
//   notes: string
// }
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

  public updateActivityInfo:boolean;

  public workoutChange: boolean;
  public setsChange: boolean;
  public repsChange: boolean;
  public timeChange: boolean;
  public notesChange: boolean;

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
    this.activity_reccomendation();
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
      location.reload();
      },err=>{
        console.log(this.Date)
        console.log(err);
      });
  }

  // edit functions below
  // (11/20/21) Will have functions implemented soon 

  editactivityinfo() {
    this.updateActivityInfo = !this.updateActivityInfo;
    // this.hideName = !this.hideName;
  }

  //change workout name 
    editWorkoutName(){
      this.workoutChange = !this.workoutChange;
    }
    editworkout(){
      let workoutNameChanges = (document.getElementById("workoutname") as HTMLInputElement).value;
      let navbar = document.getElementById("List").querySelectorAll('li');
      let workoutname = navbar[0].innerHTML.split(': ')[1]
      let updatedlist: Array<any> = []
      let newdatetype = this.inputdate+":"+workoutNameChanges
      for(var i = 0;i<navbar.length;i++){
        if(i == 0){
          updatedlist.push("Workout Name: "+workoutNameChanges)
          console.log(workoutNameChanges)
        }else{
          updatedlist.push(navbar[i].innerHTML)
          console.log(navbar[i].innerHTML)
        }
      }
      console.log(workoutname)
      console.log(newdatetype)
      let data = {
        Date:     this.inputdate,
        Workout:  updatedlist,
        uid:      this.uid,
        DateType: newdatetype
      }
      this.firestore.collection("users").doc(this.uid).collection("activity").doc(this.uid)
      .collection(this.inputdate).doc(newdatetype).set(data).then(res=>{
        console.log("Activity saved")
        },err=>{
          console.log(this.Date)
          console.log(err);
        });
      this.firestore.collection("users").doc(this.uid).collection("activity").doc(this.uid)
        .collection(this.inputdate).doc(this.inputdate+":"+workoutname).delete();

      console.log("Your workout name has been changed to: "+ workoutNameChanges);
      this.editWorkoutName();

    }
      //change workout sets
    editSets(){
      this.setsChange = !this.setsChange;
    }
    editworkoutSets(){
      let workoutSetChanges = (document.getElementById("setnum") as HTMLInputElement).value;
      let navbar = document.getElementById("List").querySelectorAll('li');
      let workoutname = navbar[0].innerHTML.split(': ')[1]
      let updatedlist: Array<any> = []
      for(var i = 0;i<navbar.length;i++){
        if(i == 1){
          updatedlist.push("Sets: "+workoutSetChanges)
        }else{
          updatedlist.push(navbar[i].innerHTML)
        }
      }
      console.log(workoutname)
      this.firestore.collection("users").doc(this.uid).collection("activity").doc(this.uid)
        .collection(this.inputdate).doc(this.inputdate+":"+workoutname).update({
       Workout: updatedlist
      }); 
      console.log("Your number of set(s) Had been changed to: "+ workoutSetChanges);
      this.editSets();

    }
      //change workout reps
    editReps(){
      this.repsChange = !this.repsChange;
    }
    editworkoutReps(){
      let navbar = document.getElementById("List").querySelectorAll('li');
      let workoutname = navbar[0].innerHTML.split(': ')[1]
      let workoutRepChanges = (document.getElementById("repnum") as HTMLInputElement).value;
      let updatedlist: Array<any> = []
      for(var i = 0;i<navbar.length;i++){
        if(i == 2){
          updatedlist.push("Reps: "+workoutRepChanges)
        }else{
          updatedlist.push(navbar[i].innerHTML)
        }
      }
      console.log(workoutname)
      this.firestore.collection("users").doc(this.uid).collection("activity").doc(this.uid)
        .collection(this.inputdate).doc(this.inputdate+":"+workoutname).update({
       Workout: updatedlist
      }); 
      console.log("Your number of rep(s) Had been changed to: "+ workoutRepChanges);
      this.editReps();
    }
      //change workout  time
    editTime(){
      this.timeChange = !this.timeChange;
    }
    editworkoutTime(){
      let workoutTimeChanges = (document.getElementById("timenum") as HTMLInputElement).value;
      let navbar = document.getElementById("List").querySelectorAll('li');
      let workoutname = navbar[0].innerHTML.split(': ')[1]
      let updatedlist: Array<any> = []
      for(var i = 0;i<navbar.length;i++){
        if(i == 3){
          updatedlist.push("Time: "+workoutTimeChanges)
        }else{
          updatedlist.push(navbar[i].innerHTML)
        }
      }
      console.log(workoutname)
      this.firestore.collection("users").doc(this.uid).collection("activity").doc(this.uid)
        .collection(this.inputdate).doc(this.inputdate+":"+workoutname).update({
       Workout: updatedlist
      }); 
      console.log("Your time Had been changed to: "+ workoutTimeChanges);
      this.editTime();

    }
      //change workout Notes
    editNotes(){
      this.notesChange = !this.notesChange;
    }
    editworkoutNote(){
      let workoutNoteChanges = (document.getElementById("note") as HTMLInputElement).value;
      let navbar = document.getElementById("List").querySelectorAll('li');
      let workoutname = navbar[0].innerHTML.split(': ')[1]
      let updatedlist: Array<any> = []
      for(var i = 0;i<navbar.length;i++){
        if(i == 4){
          updatedlist.push("Notes: "+workoutNoteChanges)
        }else{
          updatedlist.push(navbar[i].innerHTML)
        }
      }
      console.log(workoutname)
      this.firestore.collection("users").doc(this.uid).collection("activity").doc(this.uid)
        .collection(this.inputdate).doc(this.inputdate+":"+workoutname).update({
       Workout: updatedlist
      }); 
      console.log("Your note(s) Had been changed to: "+ workoutNoteChanges);
      this.editNotes();

    }


    deletedata(){
      let navbar = document.getElementById("List").querySelectorAll('li');
      var workoutName= navbar[0].innerHTML.split(': ')[1];
      this.firestore.collection("users").doc(this.uid).collection("activity").doc(this.uid)
      .collection(this.inputdate).doc(this.inputdate+":"+workoutName).delete();
    }
    //11-24-2021 added by james
    activity_reccomendation(){
      let myContainer = document.getElementById('reccomendation') as HTMLInputElement;
      this.firestore.collection("users").doc(this.uid).collection("activity").doc(this.uid).collection(this.inputdate).snapshotChanges().subscribe(res => {
        if (res.length > 0)
        {
        console.log("Match found.");
        return myContainer.innerHTML = "Good job you were active today";
        }
        else
        {
        console.log("Does not exist.");
        return myContainer.innerHTML = "You haven't done anything today yet. It's never to late to start.";
        }
    });
    
    }
}
