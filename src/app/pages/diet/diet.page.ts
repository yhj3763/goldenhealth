import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { LoginPage } from 'src/app/login/login.page';
import { FireserviceService } from '../../fireservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.page.html',
  styleUrls: ['./diet.page.scss'],
})
export class DietPage implements OnInit {
  //userinput
  public Date:any;
  public Targeted_Calories:any;
  public Food_Name:any;
  public Brand:any;
  public Calories:any;
  public Protein:any;
  public Carbs:any;
  public Fat:any;
  public Fiber:any;
  public Sugar:any;
  public Sodium:any;
  public Cholesterol:any;
  showControl: boolean = false;

  //uid
  public uid = this.logininfo.uid();

  @ViewChild('barChart') barChart;
  public targetedCalories: number;
  public calories: number;
  constructor(
    public router:Router,
    public fireService:FireserviceService, 
    public logininfo: LoginPage  
  ) { }

  ngOnInit() {
  }
  savefood(){
    let data = {
      Date:this.Date,
      Food_Name:this.Food_Name,
      Brand:this.Brand,
      Calories:this.Calories,
      Protein:this.Protein,
      Carbs:this.Carbs,
      Fat:this.Fat,
      Fiber:this.Fiber,
      Sugar:this.Sugar,
      Sodium:this.Sodium,
      Cholesterol:this.Cholesterol,
      uid:this.uid
    }
    this.fireService.saveDiet(data).then(res=>{
      console.log("Diet saved")
      },err=>{
        console.log(err);
      });
  }
  createBarChart()
  {
    this.barChart = new Chart(this.barChart.nativeElement, {
    type: 'bar',
    data: {
      labels: ["Targeted"],
      datasets: [{
        label: 'Targeted vs Eaten Calories',
        barPercentage: 0.8,
        barThickness: 20,
        minBarLength: 2,
        data: [this.targetedCalories],
        backgroundColor: [
          'rgb(38,194, 129)',
          'rgb(38,194, 129)',
          'rgb(38,194, 129)'
        ]
      }]
    },
    options: {
      scales: {
          y: {
            beginAtZero: true
          }
      }
    },
  });
}

addData()
{
  this.barChart.data.datasets[0].data.push(this.calories);
  this.barChart.data.labels.push("test");
  this.barChart.update();
}

  btnClicked() {
    console.log('btn Clicked. Yeaaaahhhh!');
    // alert('Yeaaahhhhhh!');
    //this.createBarChart();
    this.showControl = !this.showControl;
  }

}
