import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[SlideAnimationTarget]'
})
export class SlideAnimationTargetDirective implements OnInit, OnDestroy{

  constructor(
    public _elRef: ElementRef
  ){
    this._elRef.nativeElement.directive = this;
  }

  ngOnInit(){}

  ngOnDestroy(){}

}
