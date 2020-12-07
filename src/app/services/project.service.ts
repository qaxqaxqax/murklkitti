import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  references:Project[] = [
    {
      title: "mary shelley's frankenstein",
      type: "BOOK COVER",
      id: 'book-cover'
    },
    {
      title: "ZIRC VÁROS",
      type: "WEBSITE",
      id: 'website' 
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
      title: "KECSKEMÉTI SÖRMANUFAKTÚRA",
      type: "LOGO & WEBSITE",
      id: 'logo'
    },
  ];

  constructor() {
    
  } 
}

export interface Project{
  id:string,
  title:string,
  type:string
}
