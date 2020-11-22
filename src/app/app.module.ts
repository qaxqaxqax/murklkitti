import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/pages/main/main.component';
import { ContentSliderComponent } from './components/content-slider/content-slider.component';
import { ContentSlideDirective } from './components/content-slider/content-slide/content-slide.directive';
import { SlideAnimationTargetDirective } from './components/content-slider/slide-animation-target/slide-animation-target.directive';

@NgModule({
  declarations: [
    AppComponent,
    ContentSliderComponent,
    ContentSlideDirective,
    SlideAnimationTargetDirective,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
