import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DashboardService {
  // Public
  public apiData: any;
  public onApiDataChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onApiDataChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getApiData()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get Api Data
   */
  getApiData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/dashboard-data').subscribe((response: any) => {
        this.apiData = response;
        this.onApiDataChanged.next(this.apiData);
        resolve(this.apiData);
      }, reject);
    });
  }

  getDashboardData(role): Observable<any>{
    let dshbrdApi = role == 'Community' ? 'CMdashboard' : 'dashboard'
    return this._httpClient.get(`${environment.baseApiUrl}${dshbrdApi}`);
  }

  // getTodaysData(): Observable<any>{
  //   return this._httpClient.get(`${environment.baseApiUrl}todayBooking`);
  // }

  getMemoData(): Observable<any>{
    return this._httpClient.get(`${environment.baseApiUrl}getMemo`);
  }

  updateMemoData(data): Observable<any>{
    return this._httpClient.post(`${environment.baseApiUrl}updateMemo`, data);
  }

  // getAllHolidays(): Observable<any> {
  //   return this._httpClient.get(`${environment.baseApiUrl}getAllHolidays`)
  // }

  updateHoliday(encdates): Observable<any> {
    return this._httpClient.post(`${environment.baseApiUrl}updateHoliday`, encdates);
  }
}
