import { Component, Input, OnInit } from '@angular/core';
import { PrivateStringsForApp } from '../PrivateStringsForApp';

@Component({
  selector: 'app-screen-msg-display',
  templateUrl: './screen-msg-display.component.html',
  styleUrls: ['./screen-msg-display.component.css']
})

export class ScreenMsgDisplayComponent implements OnInit {
  // (property binding any component that calls this component).
  @Input() msgDisplay: string = PrivateStringsForApp.getEmptyString()

  constructor() { }

  ngOnInit(): void { }

}
