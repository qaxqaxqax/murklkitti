import { animate, AnimationBuilder, AnimationFactory, keyframes, style } from '@angular/animations';
import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, ElementRef, forwardRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { Project, ProjectService } from 'src/app/services/project.service';
import { CSlideDirective } from '../../content-slider/c-slide/c-slide.directive';
import { ContentSliderComponent, SlideTo } from '../../content-slider/content-slider.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy , AfterViewInit{

  public slideInUp:AnimationFactory;
  public slideOutUp:AnimationFactory;
  public slideInDown:AnimationFactory;
  public slideOutDown:AnimationFactory;
  public next$:Subject<Subject<CSlideDirective>> = new Subject<Subject<CSlideDirective>>();
  public prev$:Subject<Subject<CSlideDirective>> = new Subject<Subject<CSlideDirective>>();
  public slide$:Subject<SlideTo> = new Subject<SlideTo>();
  public slideAnimation:{in:AnimationFactory, out:AnimationFactory} = null;

  @ViewChild('contentSliderRef', {static: false, read: ContentSliderComponent}) sliderRef:ContentSliderComponent;
  background = 'introduction';


  private scrollSub:Subscription;
  private routeSub:Subscription;

  constructor(
    private _ab:AnimationBuilder,
    public  project:ProjectService,
    private _router:Router,
    private _route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setBaseAnimations();
    let timer:number = 0;
    this.scrollSub = fromEvent(document, 'wheel').subscribe((event:WheelEvent) => {
      if((Date.now() - timer >= 0) || !timer){
        if(event.deltaY > 0){
          this.next();
        }else if(event.deltaY < 0){
          this.prev();
        }
        timer = Date.now() + 2000;
      }
    });
  }

  ngAfterViewInit(){
    this.routeSub = this._route.fragment.subscribe((fragment) => {
      if(!fragment || fragment == "introduction"){
        this.slideToFirst().pipe(take(1), delay(0)).subscribe((slide:CSlideDirective) => {
          this.setBackground(slide);
          window.requestAnimationFrame(() => {
            this._router.navigate(['/'], {fragment: fragment});
          });
        });
      }
      if(fragment && !document.querySelector(`.${fragment}`)){
        this.slide(fragment);
      }
    });
  }

  ngOnDestroy(){
    if(this.scrollSub){ this.scrollSub.unsubscribe(); }
    if(this.routeSub){ this.routeSub.unsubscribe(); }
  }

  private next(){
    this.foregroundNext().pipe(take(1), delay(0)).subscribe((slide:CSlideDirective) => {
      this.setBackground(slide);
      window.requestAnimationFrame(() => {
        this._router.navigate(['/'], {fragment: (<Project>slide.CSlidePayload).id});
      });
    });
  }

  private prev(){
    this.foregroundPrev().pipe(take(1), delay(0)).subscribe((slide:CSlideDirective) => {
      this.setBackground(slide);
      window.requestAnimationFrame(() => {
        this._router.navigate(['/'], {fragment: (<Project>slide.CSlidePayload).id});
      });
    });
  }

  private slide(fragment:string){
    let index:number = this.project.references.findIndex((project:Project) => { return project.id == fragment });
    if(index!=-1){
      this.slideTo(index).pipe(take(1), delay(0)).subscribe((slide:CSlideDirective) => {
        this.setBackground(slide);
        window.requestAnimationFrame(() => {
          this._router.navigate(['/'], {fragment: fragment});
        });
      });
    }else if(fragment == 'contact'){
      this.slideToContact().pipe(take(1), delay(0)).subscribe((slide:CSlideDirective) => {
        this.setBackground(slide);
        window.requestAnimationFrame(() => {
          this._router.navigate(['/'], {fragment: fragment});
        });
      });
    }
  }

  setBackground(slide:CSlideDirective){
    if(slide.CSlidePayload && slide.CSlidePayload.id){
      this.background = (<Project>slide.CSlidePayload).id;
    }
  }

  private foregroundNext(){
    this.slideAnimation = { out: this.slideInDown, in: this.slideOutDown };
    let done$ = new Subject<CSlideDirective>();
    window.requestAnimationFrame(() => { 
      this.next$.next(done$); 
    }); 
    return done$;
  }

  private foregroundPrev(){
    this.slideAnimation = { in: this.slideInUp, out: this.slideOutUp };
    let done$ = new Subject<CSlideDirective>();
    window.requestAnimationFrame(() => { 
      this.prev$.next(done$); 
    });
    return done$;
  }

  private slideTo(index:number){
    let done$ = new Subject<CSlideDirective>();
    window.requestAnimationFrame(() => {
      this.slideAnimation = { in: this.slideInUp, out: this.slideOutUp };
      window.requestAnimationFrame(() => { 
        this.slide$.next({index: index+1, done$: done$});
      });
    });
    return done$;
  }

  private slideToContact(){
    let done$ = new Subject<CSlideDirective>();
    window.requestAnimationFrame(() => {
      this.slideAnimation = { in: this.slideInUp, out: this.slideOutUp };
      window.requestAnimationFrame(() => { 
        this.slide$.next({index: this.project.references.length+1, done$: done$});
      });
    });
    return done$;
  }

  private slideToFirst(){
    let done$ = new Subject<CSlideDirective>();
    window.requestAnimationFrame(() => {
      this.slideAnimation = { in: this.slideInUp, out: this.slideOutUp };
      window.requestAnimationFrame(() => { 
        this.slide$.next({index: 0, done$: done$});
      });
    });
    return done$;
  }

  private setBaseAnimations(animationDuration:string = '750ms', easing:string = 'ease-out'){
    this.slideInUp = this._ab.build([
      style({'transform': 'translate(0%, -100%)'}),
      animate(`${animationDuration} ${easing}`, keyframes([
        style({'transform': 'translate(0%, -100%)'}),
        style({'transform': 'translate(0%, 0%)'})
      ])),
      style({'transform': 'translate(0%, 0%)'})
    ]);
    this.slideOutUp = this._ab.build([
      style({'transform': 'translate(0%, 0%)'}),
      animate(`${animationDuration} ${easing}`, keyframes([
        style({'transform': 'translate(0%, 0%)'}),
        style({'transform': 'translate(0%, 100%)'})
      ])),
      style({'transform': 'translate(0%, 100%)'})
    ]);
    this.slideInDown = this._ab.build([
      style({'transform': 'translate(0%, 100%)'}),
      animate(`${animationDuration} ${easing}`, keyframes([
        style({'transform': 'translate(0%, 100%)'}),
        style({'transform': 'translate(0%, 0%)'})
      ])),
      style({'transform': 'translate(0%, 0%)'})
    ]);
    this.slideOutDown = this._ab.build([
      style({'transform': 'translate(0%, 0%)'}),
      animate(`${animationDuration} ${easing}`, keyframes([
        style({'transform': 'translate(0%, 0%)'}),
        style({'transform': 'translate(0%, -100%)'})
      ])),
      style({'transform': 'translate(0%, -100%)'})
    ]);
  }

}

