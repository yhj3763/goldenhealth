import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FireserviceService } from '../fireservice.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public email:any;
  public password:any;
  public name:any;
  public weight:any;
  public height:any;
  public age:any;
  constructor(
    public router:Router,
    public fireService:FireserviceService
  ) { }

  ngOnInit() {
  }

  signup(){ 
    this.fireService.signup({email:this.email,password:this.password}).then(res=>{
      if(res.user.uid){
        let data = {
          email:this.email,
          password:this.password,
          name:this.name,
          weight:this.weight,
          height:this.height,
          age:this.age,
          uid:res.user.uid
        }
        this.fireService.saveDetails(data).then(res=>{
          alert('Account Created!'),
          this.router.navigateByUrl('login');

        },err=>{
          console.log(err);
        })
      }
    },err=>{
      alert(err.message);

      console.log(err);
    })
  }

  signin(){
    this.router.navigateByUrl('login');
  }

}
