import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'header[mrklHeader]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  constructor(
    private _router:Router,
  ) { }

  ngOnInit(): void {
  }

  public toMainPage($event){
    this._router.navigate(['/'], {fragment: 'introduction'});
  }

}
