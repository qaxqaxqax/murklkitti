import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, ContentChildren, QueryList, AfterContentInit, ViewChild, ViewContainerRef, DoCheck, ElementRef, ContentChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CSlideDirective } from './c-slide/c-slide.directive';
import { AnimationFactory, AnimationPlayer } from '@angular/animations';
import { ContentSlideDirective } from './content-slide/content-slide.directive';
import { take, filter, delay } from 'rxjs/operators';
import { SlideAnimationTargetDirective } from './slide-animation-target/slide-animation-target.directive';

@Component({
  selector: 'mrkl-content-slider',
  templateUrl: './content-slider.component.html',
  styleUrls: ['./content-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentSliderComponent implements OnInit, OnDestroy, AfterContentInit, DoCheck{

  _render:CSlideDirective[] = [];

  @Input() circular: boolean = true;
  _next$:Subject<Subject<CSlideDirective>> = new Subject<Subject<CSlideDirective>>();
  __nextSubscription:Subscription = null;
  @Input() set next$(next$:Subject<Subject<CSlideDirective>>){
    this.unsubscribeFrom(this.__nextSubscription);
    this._next$ = next$;
    this.watchNext();
  }
  get next$():Subject<Subject<CSlideDirective>>{
    return this._next$;
  }
  _prev$:Subject<Subject<CSlideDirective>> = new Subject<Subject<CSlideDirective>>();
  __prevSubscription:Subscription = null;
  @Input() set prev$(prev$:Subject<Subject<CSlideDirective>>){
    this.unsubscribeFrom(this.__prevSubscription);
    this._prev$ = prev$;
    this.watchPrev();
  }
  get prev$():Subject<Subject<CSlideDirective>>{
    return this._prev$;
  }
  _slide$:Subject<SlideTo> = new Subject<SlideTo>();
  __slideSubscription:Subscription = null;
  @Input() set slide$(slide$:Subject<SlideTo>){
    this.unsubscribeFrom(this.__slideSubscription);
    this._slide$ = slide$;
    this.watchSlide();
  }
  @Input() renderAll:boolean = false;
  @Input() animation:{in: AnimationFactory, out: AnimationFactory} = null;

  @ViewChild('contentHolder', {read: ViewContainerRef, static: true}) content_holder:ViewContainerRef;
  __slidesSubscription:Subscription = new Subscription();
  @ContentChildren(CSlideDirective, {descendants: false, read: CSlideDirective}) slide_templates:QueryList<CSlideDirective>;

  slides$:Subject<ContentSlideDirective[]> = new Subject<ContentSlideDirective[]>();
  slides:ContentSlideDirective[] = [];
  slideAnimationTargets$:Subject<SlideAnimationTargetDirective[]> = new Subject<SlideAnimationTargetDirective[]>();
  slideAnimationTargets:SlideAnimationTargetDirective[] = []

  playerOut:AnimationPlayer = null;
  playerIn :AnimationPlayer = null;

  constructor(
    public _elRef: ElementRef
  ){}

  ngOnInit() {
  }

  ngAfterContentInit(){
    this.drawFirstSlide();
    this.__slidesSubscription.add(this.slide_templates.changes.subscribe((slide_templates:QueryList<CSlideDirective>) => {
      this.drawSlidesOnChange();
    }));
    this.__slidesSubscription.add(this.slides$.subscribe((slides:ContentSlideDirective[]) => {
      this.slides = slides;
    }));
    this.__slidesSubscription.add(this.slideAnimationTargets$.subscribe((targets:SlideAnimationTargetDirective[]) => {
      this.slideAnimationTargets = targets;
    }));
  }

  ngDoCheck(){
    const slideElements = this._elRef.nativeElement.children;
    const slides:ContentSlideDirective[] = [];
    const animationTargets:SlideAnimationTargetDirective[] = [];
    for(let i:number = 0; i < slideElements.length; i++){
      if(slideElements[i].hasAttribute('ContentSlide')){
        slides.push(<ContentSlideDirective>slideElements[i].directive);
      }
      if(slideElements[i].hasAttribute('SlideAnimationTarget')){
        animationTargets.push(<SlideAnimationTargetDirective>slideElements[i].directive);
      }
    }
    if(!isArraysEqual(this.slides, slides)){
      this.slides$.next(slides);
    }
    if(!isArraysEqual(this.slideAnimationTargets, animationTargets)){
      this.slideAnimationTargets$.next(animationTargets);
    }
  }

  ngOnDestroy(){
    this.unsubscribeFrom(this.__nextSubscription);
    this.unsubscribeFrom(this.__prevSubscription);
    this.unsubscribeFrom(this.__slideSubscription);
    this.unsubscribeFrom(this.__slidesSubscription);
  }

  private watchNext(){
    this.__nextSubscription = this._next$.subscribe((done$) => {
      if(!done$){ done$ = new Subject<CSlideDirective>(); }
      if(this.renderAll){
        this._activateNext();
        done$.next(this.getActiveSlide());
      }else{
        if(this.animation){
          this._renderNextInterval(done$);
        }else{
          this._renderAndActivateNext();
          done$.next(this.getActiveSlide());
        }
      }
    });
  }

  private watchPrev(){
    this.__prevSubscription = this._prev$.subscribe((done$) => {
      if(!done$){ done$ = new Subject<CSlideDirective>(); }
      if(this.renderAll){
        this._activatePrev();
        done$.next(this.getActiveSlide());
      }else{
        if(this.animation){
          this._renderPrevInterval(done$);
        }else{
          this._renderAndActivatePrev();
          done$.next(this.getActiveSlide());
        }
      }
    });
  }

  private _activateNext(){
      let i:number = 0;
      while(i<this._render.length && !this._render[i].active){
        i++;
      }
      if(i<this._render.length){
        if(i!=this._render.length-1){
          this.deactivateAll();
          this._render[i+1].markActive();
        }else{
          if(this.circular){
            this.deactivateAll();
            this._render[0].markActive();
          }
        }
      }
  }

  private _activatePrev(){
    let i:number = 0;
    while(i<this._render.length && !this._render[i].active){
      i++;
    }
    if(i<this._render.length){
      if(i!=0){
        this.deactivateAll();
        this._render[i-1].markActive();
      }else{
        if(this.circular){
          this.deactivateAll();
          this._render[this._render.length-1].markActive();
        }
      }
    }
  }

  private _renderAndActivateNext(){
    let slide_templates:CSlideDirective[] = this.slide_templates.toArray();
    let i:number = 0;
    while(i<slide_templates.length && !slide_templates[i].active){
      i++;
    }
    if(i<slide_templates.length){
      if(i!=slide_templates.length-1){
        this.deactivateAll();
        this.render([slide_templates[i+1].markActive()]);
      }else{
        if(this.circular){
          this.deactivateAll();
          this.render([slide_templates[0].markActive()]);
        }
      }
    }
  }

  private _renderAndActivatePrev(){
    let slide_templates:CSlideDirective[] = this.slide_templates.toArray();
    let i:number = 0;
    while(i<slide_templates.length && !slide_templates[i].active){
      i++;
    }
    if(i<slide_templates.length){
      if(i!=0){
        this.deactivateAll();
        this.render([slide_templates[i-1].markActive()]);
      }else{
        if(this.circular){
          this.deactivateAll();
          this.render([slide_templates[slide_templates.length-1].markActive()]);
        }
      }
    }
  }

  private _renderNextInterval(done$:Subject<any>){
    let slide_templates:CSlideDirective[] = this.slide_templates.toArray();
    let i:number = 0;
    while(i<slide_templates.length && !slide_templates[i].active){
      i++;
    }
    if(i<slide_templates.length){
      this.slideAnimationTargets$.pipe(delay(0)).pipe(filter((targets) => { return targets.length == 2 })).pipe(take(1)).subscribe((targets:SlideAnimationTargetDirective[]) => {
        if(this.animation){
          if(targets[0] != targets[targets.length-1]){
            if(this.playerIn){ this.playerIn.destroy(); }
            if(this.playerOut){ this.playerOut.destroy(); }
            this.playerIn = this.animation.in.create(targets[0]._elRef.nativeElement);
            this.playerOut = this.animation.out.create(targets[targets.length-1]._elRef.nativeElement);
            
            this.playerIn.onStart(() => {
              this.deactivateAll();
              slide_templates[i].markActive();
            });

            this.playerIn.play();
            this.playerOut.play();

            this.playerIn.onDone(() => {
              if(slide_templates.length >= 3){
                if(i == slide_templates.length - 2){
                  this.deactivateAll();
                  this.render([slide_templates[i+1].markActive()]);
                }else if(i == slide_templates.length - 1){
                  if(this.circular){
                    this.deactivateAll();
                    this.render([slide_templates[0].markActive()]);
                  }
                }else{
                  this.deactivateAll();
                  this.render([slide_templates[i+1].markActive()]);
                }
              }else if(slide_templates.length == 2){
                if(i == 0){
                  this.deactivateAll();
                  this.render([slide_templates[1].markActive()]);
                }else if(i == 1){
                  if(this.circular){
                    this.deactivateAll();
                    this.render([slide_templates[0].markActive()]);
                  }
                }
              }
              done$.next(this.getActiveSlide());
            });
          }
        }
      });
      if(slide_templates.length >= 3){
        if(i == slide_templates.length - 2){
          this.deactivateAll();
          this.render([slide_templates[i].markActive(), slide_templates[i+1]]);
        }else if(i == slide_templates.length - 1){
          if(this.circular){
            this.deactivateAll();
            this.render([slide_templates[i].markActive(), slide_templates[0]]);
          }
        }else{
          this.deactivateAll();
          this.render([slide_templates[i].markActive(), slide_templates[i+1]]);
        }
      }else if(slide_templates.length == 2){
        if(i == 0){
          this.deactivateAll();
          this.render([slide_templates[0].markActive(), slide_templates[1]]);
        }else if(i == 1){
          if(this.circular){
            this.deactivateAll();
            this.render([slide_templates[1].markActive(), slide_templates[0]]);
          }
        }
      }
    }
  }

  private _renderPrevInterval(done$:Subject<any>){
    let slide_templates:CSlideDirective[] = this.slide_templates.toArray();
    let i:number = 0;
    while(i<slide_templates.length && !slide_templates[i].active){
      i++;
    }
    if(i<slide_templates.length){
      this.slideAnimationTargets$.pipe(delay(0)).pipe(filter((targets) => { return targets.length == 2; })).pipe(take(1)).subscribe((targets:SlideAnimationTargetDirective[]) => {
          if(this.animation){
            if(targets[0] != targets[targets.length-1]){
              if(this.playerIn){ this.playerIn.destroy(); }
              if(this.playerOut){ this.playerOut.destroy(); }

              this.playerIn = this.animation.in.create(targets[0]._elRef.nativeElement);
              this.playerOut = this.animation.out.create(targets[targets.length-1]._elRef.nativeElement);

              this.playerIn.onStart(() => {
                this.deactivateAll();
                slide_templates[i].markActive();
              });

              this.playerIn.play();
              this.playerOut.play();

              this.playerIn.onDone(() => {
                if(slide_templates.length >= 3){
                  if(i == 1){
                    this.deactivateAll();
                    this.render([slide_templates[0].markActive()]);
                  }else if(i == 0){
                    if(this.circular){
                      this.deactivateAll();
                      this.render([slide_templates[slide_templates.length - 1].markActive()]);
                    } // else dont deactivate
                  }else{
                    this.deactivateAll();
                    this.render([slide_templates[i-1].markActive()]);
                  }
                }else if(slide_templates.length == 2){
                  if(i == 0){
                    this.deactivateAll();
                    if(this.circular){
                      this.render([slide_templates[1].markActive()]);
                    }
                  }else if(i == 1){
                    this.deactivateAll();
                    this.render([slide_templates[0].markActive()]);
                  }
                }
                done$.next(this.getActiveSlide());
              });
            }
          }
        });

      if(slide_templates.length >= 3){
        if(i == 1){
          this.deactivateAll();
          this.render([slide_templates[0], slide_templates[1].markActive()]);
        }else if(i == 0){
          if(this.circular){
            this.deactivateAll();
            this.render([slide_templates[slide_templates.length - 1], slide_templates[0].markActive()]);
          } // else dont deactivate
        }else{
          this.deactivateAll();
          this.render([slide_templates[i-1], slide_templates[i].markActive()]);
        }
      }else if(slide_templates.length == 2){
        if(i == 0){
          this.deactivateAll();
          if(this.circular){
            this.render([slide_templates[1], slide_templates[0].markActive()]);
          }
        }else if(i == 1){
          this.deactivateAll();
          this.render([slide_templates[0], slide_templates[1].markActive()]);
        }
      }
    }
  }

  private watchSlide(){
    this.__slideSubscription = this._slide$.subscribe((to:SlideTo) => {
      if(this.renderAll){
        this._activateSlide(to);
        to.done$.next();
      }else{
        if(this.animation){
          this._renderAnimateAndActivateSlide(to);
        }else{
          this._renderAndActivateSlide(to);
          to.done$.next(this.getActiveSlide());
        }
      }
    });
  }

  private _activateSlide(to:SlideTo){
    if(to.index<this._render.length){
      this.deactivateAll();
      this._render[to.index].markActive();
    }
  }

  private _renderAndActivateSlide(to:SlideTo){
    let slide_templates:CSlideDirective[] = this.slide_templates.toArray();
    if(to.index<slide_templates.length){
      this.deactivateAll();
      this.render([slide_templates[to.index].markActive()]);
    }
  }


  private _renderAnimateAndActivateSlide(to:SlideTo){
    let i:number = to.index;
    let slide_templates:CSlideDirective[] = this.slide_templates.toArray();
    if(i<slide_templates.length){
      let activeIndex:number = this.getActiveSlideIndex();
      if(i != activeIndex){
        this.slideAnimationTargets$.pipe(delay(0)).pipe(filter((targets) => { return targets.length == 2; })).pipe(take(1)).subscribe((targets:SlideAnimationTargetDirective[]) => {
          if(this.animation){
            if(targets[0] != targets[targets.length-1]){
              if(this.playerIn){ this.playerIn.reset(); }
              if(this.playerOut){ this.playerOut.reset(); }
              this.playerIn = this.animation.in.create(targets[0]._elRef.nativeElement);
              this.playerOut = this.animation.out.create(targets[targets.length-1]._elRef.nativeElement);
              
              this.playerIn.onStart(() => {
                this.deactivateAll();
                slide_templates[i].markActive();
              });

              this.playerIn.play();
              this.playerOut.play();

              this.playerIn.onDone(() => {
                this.deactivateAll();
                this.render([slide_templates[i].markActive()]);
                to.done$.next(this.getActiveSlide());
              });
            }
          }
        });
        this.deactivateAll();
        this.render([slide_templates[i], slide_templates[activeIndex].markActive()]);
      }
    }
  }

  private drawFirstSlide(){
    if(this.slide_templates.first){
      if(this.renderAll){
        this.render(this.slide_templates.toArray().map((slide, index) => {
          return index == 0 ? slide.markActive() : slide
        }));
      }else{
        this.render([this.slide_templates.first.markActive()]);
      }
    }
  }

  private drawSlidesOnChange(){
    if(this.renderAll){
      this.render(this.slide_templates.toArray());
      let i:number = 0;
      while(i<this._render.length && !this._render[i].active){
        i++;
      }
      if(i>=this._render.length && this.slide_templates.first){
        this._render[0].markActive();
      }
    }
  }

  private render(slide_templates:CSlideDirective[]){
    this._render = slide_templates;
    setTimeout(() => {
      this.ngDoCheck();
    }, 0);
  }

  private deactivateAll(){
    this.slide_templates.map((template:CSlideDirective) => {
      return template.markInactive();
    });
  }

  private getActiveSlideIndex():number{
    let i:number = 0;
    let slide_templates = this.slide_templates.toArray();
    while(i<slide_templates.length && !slide_templates[i].active){
      i++;
    }
    if(i<slide_templates.length){
      return i;
    }
    return null;
  }

  public getActiveSlide():CSlideDirective{
    let activeIndex = this.getActiveSlideIndex();
    if(activeIndex != null){
      return this.slide_templates.toArray()[activeIndex];
    }
    return null;
  }

  private unsubscribeFrom(subscription:Subscription){
    if(subscription){
      subscription.unsubscribe();
    }
  }

}

export interface SlideTo{
  index:number;
  done$:Subject<CSlideDirective>;
}

function isArraysEqual(arr1:any[], arr2:any):boolean{
  if(arr1.length != arr2.length){ return false; }
  let i:number = 0;
  while(i < arr1.length && arr1[i] == arr2[i]){
    i++;
  }
  if(i >= arr1.length){
    return true;
  }
  return false;
}