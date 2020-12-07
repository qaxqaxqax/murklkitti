import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from '../services/event.service';

@Directive({
  selector: '[mrklScrollDraw]'
})
export class ScrollDrawDirective implements OnInit, OnDestroy{

  sub:Subscription;

  viewportHeight:number = window.innerHeight || document.documentElement.clientHeight;

  constructor(
    private _event:EventService,
    public elRef:ElementRef,
    private _renderer: Renderer2
  ) { }

  ngOnInit(){
    this._renderer.setStyle(this.elRef.nativeElement, 'opacity', '0');
    this._renderer.setStyle(this.elRef.nativeElement, 'transition', 'opacity 500ms ease');
    this.sub = this._event.scroll.subscribe((event) => {
      const scrollArea:HTMLDivElement = event.target as HTMLDivElement;
      const top = this.getDstanceFromTop(this.elRef);
      if(top - scrollArea.scrollTop - (this.viewportHeight/2) < 0){
        this._renderer.setStyle(this.elRef.nativeElement, 'opacity', '1');
      }
    });
  }

  ngOnDestroy(){
    if(this.sub){ this.sub.unsubscribe(); }
  }
  
  getDstanceFromTop(elRef:ElementRef){
    let elem = elRef.nativeElement;
    let distance = 0;
    do {
        distance += elem.offsetTop;
        elem = elem.offsetParent;

    } while (elem);
    distance = distance < 0 ? 0 : distance;
    return distance;
  }

}
