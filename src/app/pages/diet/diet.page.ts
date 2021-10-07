import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.page.html',
  styleUrls: ['./diet.page.scss'],
})
export class DietPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  btnClicked() {
    console.log("btn Clicked. Yeaaaahhhh!");
    alert("Yeaaahhhhhh!");
  }

}
