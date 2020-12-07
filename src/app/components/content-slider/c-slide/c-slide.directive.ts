import { Directive, TemplateRef, Input } from '@angular/core';

@Directive({
  selector: '[CSlide]'
})
export class CSlideDirective {

  @Input() CSlidePayload:any = null;
  @Input() data:object = {
    active: false
  }
  get active(){
    return this.data['active'];
  }

  constructor(
    public _tpl:TemplateRef<any>
  ) {  }

  markActive():CSlideDirective{
    this.data = Object.assign(this.data, {active: true});
    return this;
  }

  markInactive():CSlideDirective{
    this.data = Object.assign(this.data, {active: false});
    return this;
  }

}
