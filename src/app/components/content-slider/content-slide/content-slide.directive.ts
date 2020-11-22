import { Directive, OnInit, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[ContentSlide]'
})
export class ContentSlideDirective implements OnInit, OnDestroy {

  constructor(
    public _elRef: ElementRef
  ) {
    this._elRef.nativeElement.directive = this;
  }

  ngOnInit(){}

  ngOnDestroy(){}

}
