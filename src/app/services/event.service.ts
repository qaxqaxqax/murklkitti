import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  scroll = fromEvent(document, 'scroll');

  constructor() { }
}
