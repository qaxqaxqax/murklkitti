import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/pages/main/main.component';
import { ContentSliderComponent } from './components/content-slider/content-slider.component';
import { ContentSlideDirective } from './components/content-slider/content-slide/content-slide.directive';
import { SlideAnimationTargetDirective } from './components/content-slider/slide-animation-target/slide-animation-target.directive';
import { CSlideDirective } from './components/content-slider/c-slide/c-slide.directive';
import { ProjectComponent } from './components/pages/project/project.component';
import { ReferenceComponent } from './components/reference/reference.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AbsPipe } from './pipes/abs.pipe';
import { ScrollDrawDirective } from './directives/scroll-draw.directive';

@NgModule({
  declarations: [
    AppComponent,
    ContentSliderComponent,
    ContentSlideDirective,
    CSlideDirective,
    SlideAnimationTargetDirective,
    MainComponent,
    ProjectComponent,
    ReferenceComponent,
    HeaderComponent,
    FooterComponent,
    AbsPipe,
    ScrollDrawDirective
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
