import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.css']
})

// This class is for showing loading circle until date is presented (Is in 'all-tenants-display' in admin's page).
export class LoadingPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

}
