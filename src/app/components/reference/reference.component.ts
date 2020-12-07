import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mrkl-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferenceComponent implements OnInit {

  @Input('project') id:string;

  constructor() { }

  ngOnInit(): void {
  }

}
