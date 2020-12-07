import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { Project, ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectComponent implements OnInit, OnDestroy {

  id:string = null;
  prev:Project = null;
  next:Project = null;
  routeSub:Subscription;

  delta = 0;
  scaleLeft = 1;
  scaleRight = 1;

  @ViewChild('navigatorController', {read:ElementRef}) controllerRef:ElementRef<HTMLDivElement>;
  @ViewChild('navigatorBackground', {read:ElementRef}) navigatorBgRef:ElementRef<HTMLDivElement>;

  constructor(
    public project:ProjectService,
    private _route:ActivatedRoute,
    private _router:Router,
    public elRef:ElementRef,
    private _event:EventService
  ) { }

  ngOnInit(): void {
    this.routeSub = new Subscription();
    this._event.scroll = fromEvent(this.elRef.nativeElement, 'scroll');
    this.routeSub.add(this._route.queryParams.subscribe((params) => {
      if(params.name){
        this.id = params.name;
        this.elRef.nativeElement.scrollTop = 0;
        this.initProjectNavigatorParameters(this.id);
      }else{
        this._router.navigate(['/']);
      }
    }));
  }

  ngOnDestroy(): void {
    if(this.routeSub){ this.routeSub.unsubscribe(); }
  }

  initProjectNavigatorParameters(id:string){
    let index = this.project.references.findIndex((project:Project) => { return project.id == id; });
    if(index == -1){
      this._router.navigate(['/']);
    }else if(index == 0){
      this.next = this.project.references[index+1];
      this.prev = this.project.references[this.project.references.length-1];
    }else if(index == (this.project.references.length-1)){
      this.next = this.project.references[0];
      this.prev = this.project.references[index-1];
    }else{
      this.next = this.project.references[index+1];
      this.prev = this.project.references[index-1];
    }
  }

  onNavWheel(event){
    this.elRef.nativeElement.scrollTop += event.deltaY;
  }

  handleEnterAnimation(event){
    this.animateMove(event);
  }

  handleLeaveAnimation(event){
    this.delta = 0;
  }

  handleMoveAnimation(event){
    this.animateMove(event);
  }

  animateMove(event){
    const box = this.controllerRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - box.x;

    const deltaX = 100 - 100 * x / box.width;
    let delta = 0;
    if(deltaX == 50){
      delta = 0;
    }else if(deltaX > 50){
      delta = deltaX - 50;
      this.scaleLeft = 1 + Math.abs(delta) / 250;
      this.scaleRight = 1;
    }else if(deltaX < 50){
      delta = -1 * (50 - deltaX);
      this.scaleLeft = 1;
      this.scaleRight = 1 + Math.abs(delta) / 250;
    }
    this.delta = delta;
  }

}
