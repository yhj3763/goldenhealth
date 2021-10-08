import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireserviceService } from '../fireservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email:any;
  public password:any;
  hidePassword = true;
  passwordToggleIcon = 'eye-off';
    public userid:any;

  constructor(
    public router:Router,
    public fireService:FireserviceService
  ) { }

  ngOnInit() {
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

  login(){
    this.fireService.loginWithEmail({email:this.email,password:this.password}).then(res=>{
      console.log(res);
      localStorage.setItem('uid', res.user.uid);
      if(res.user.uid){
        this.fireService.getDetails({uid:res.user.uid}).subscribe(res=>{
          console.log(res);
          this.router.navigateByUrl('home');
        },err=>{
          console.log(err);
        });
      }
    },err=>{
      alert(err.message)
      console.log(err);
    })
  }

  uid(){
    const id = localStorage.getItem('uid');
    return id;
  }
  signup(){
    this.router.navigateByUrl('signup');
  }
}
