import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {


  public url;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;

  }

}
