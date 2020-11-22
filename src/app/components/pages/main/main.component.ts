import { AnimationFactory } from '@angular/animations';
import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, forwardRef, OnInit, QueryList, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ContentSlideDirective } from '../../content-slider/content-slide/content-slide.directive';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, AfterViewInit, AfterContentInit {

  public slide$:Subject<number> = new Subject<number>();
  public slideAnimation:{in:AnimationFactory, out:AnimationFactory} = null;

  @ContentChildren(forwardRef(() => ContentSlideDirective), {descendants: false}) directives!:QueryList<ContentSlideDirective>;
  @ContentChildren('foo', {descendants: false}) foo!:QueryList<ElementRef>;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(){
  }

  ngAfterContentInit(){
    console.log(this.foo.first);
    console.log(this.directives.first);
    this.directives.changes.subscribe((x) => {
      console.log(x);
    });
  }

}
