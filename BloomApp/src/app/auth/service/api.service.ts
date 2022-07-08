import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AssignmentPattern } from 'typescript';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from 'environments/environment';


@Injectable({ providedIn: 'root' })
export class ApiService {
 

  constructor(private _http: HttpClient, 
    private toaster: ToastrManager,
    private location: Location, private router: Router) {
    
  }

  register(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}register`, data);
  }

  addManagement(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}addManagement`, data);
  }

  updatePrimaryContact(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}updatePrimaryContact`, data);
  }


  login(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}login`, data);
  }

  genericErrorToaster(Msg:string = '') {
    let error = Msg || 'Oops! something went wrong, please try again later.'
    this.toaster.errorToastr(error);

  }

  updateSurveyCompliance(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}updateSurveyCompliance`, data);
  }

  updateManagementCompany(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}updateManagementCompany`, data);
  }

  updateSingleCommunity(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}updateSingleCommunity`, data);
  }
  
  
  getcommunityById(data:any): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}getcommunityById?id=${data}`);
  }

}