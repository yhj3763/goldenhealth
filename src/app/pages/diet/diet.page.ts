import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-diet',
  templateUrl: './diet.page.html',
  styleUrls: ['./diet.page.scss'],
})
export class DietPage implements OnInit {

  @ViewChild('barChart') barChart;
  public targetedCalories: number;
  public calories: number;
  constructor() { }

  ngOnInit() {
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
    this.createBarChart();
  }

}
