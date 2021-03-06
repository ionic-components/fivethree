import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'fiv-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() icon: string;
  @Input() text: string;
  @Output() click = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}
