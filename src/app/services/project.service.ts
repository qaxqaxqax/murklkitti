import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  references:Project[] = [
    {
      title: "frankenstein",
      type: "BOOK COVER",
      id: 'book-cover'
    },
    {
      title: "FIRST THE CRAFT BEER CO.",
      type: "LABEL ILLUSTRATION",
      id: 'label'
    },
    {
      title: "FUTURIUM",
      type: "CONCEPTUAL IDENTITY",
      id: 'conceptual-identity'
    },
    {
      title: "VELO BUDAPEST",
      type: "MINI-GAME",
      id: 'mini-game'
    },
    {
      title: "ZIRC VÁROS",
      type: "WEBSITE",
      id: 'website' 
    }
  ];

  constructor() {
    
  } 
}

export interface Project{
  id:string,
  title:string,
  type:string
}
