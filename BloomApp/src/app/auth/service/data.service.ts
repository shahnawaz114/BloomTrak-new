import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { InterceptorSkipHeader } from 'app/auth/helpers/jwt.interceptor';
import { DeviceDetectorService } from 'ngx-device-detector';

// export interface Person {
//   id: string;
//   isActive: boolean;
//   age: number;
//   name: string;
//   gender: string;
//   company: string;
//   email: string;
//   phone: string;
//   disabled?: boolean;
// }

@Injectable({
  providedIn: 'root'
})
export class DataService {
  [x: string]: any;
  geodata: any = null;
  devicedata: any = null;
  // transactionPriorityArray: any = [
  //   'Cashout', 'Deposit', 'Bonus'
  // ]
  // paymentTypePriority: any = ['EURO', 'BTC'];
  public openModal = new BehaviorSubject<boolean>(false);
  // public refreshList = new BehaviorSubject<boolean>(false);

  // public openwithdrawal = new BehaviorSubject<boolean>(false);
  public opentIdentificaitonModal = new BehaviorSubject<any>(false);
  public openDeposit = new BehaviorSubject<any>(false);
  minimumAmount: any = { id: 1, min_deposit: 5, min_property_Invest: 88, min_tick_Invest: 0.1, min_withdrawl: 0, first_autoplay_invest: 44, autoplay_invest: 88, max_deposit: 144000, daily_withdrawal: 20000, vip_daily_withdrawal: 100000, min_tick_Invest_inbithome: 1 };
  cpUserData: any = "eyJ1ZXJuYW1lIjoic2l4cHJvZml0ZGV2IiwidXNlcm5hbWUiOiJzaXhwcm9maXRkZXYiLCJtZXJjaGFudF9pZCI6ImU1OGRlZWNiM2ViMzk1MmViMDhiYjViYTU3YmY1NmUyIiwiZW1haWwiOiJwcm9jcnlwdG9sZWFkZXJAZ21haWwuY29tIiwicHVibGljX25hbWUiOiJCSVRPTUFUSUMiLCJ0aW1lX2pvaW5lZCI6MTU3MzY2MDY2MX0=";


  constructor(private http: HttpClient,
    private deviceService: DeviceDetectorService,
  ) { }

  getIp() {
    let headers = new HttpHeaders().set(InterceptorSkipHeader, '')
    return this.http.get('https://jsonip.com');
  }

  getGeoData() {
    let headers = new HttpHeaders().set(InterceptorSkipHeader, '')
    return this.http.get('https://geolocation-db.com/json/');
  }

  loginLog(input_data) {
    return this.http.post(environment.baseApiUrl + 'loginLog/?lang=en', input_data)
  }

  deleteProject(id) {
    return this.http.post(`${environment.baseApiUrl}deleteProject/`, id);
  }

  deleteManagenment(id) {
    return this.http.post(`${environment.baseApiUrl}deleteManagenment`, id);
  }

  editProject(data) {
    return this.http.post(`${environment.baseApiUrl}editProject/`, data);
  }

  startShiftByID(data) {
    return this.http.post(`${environment.baseApiUrl}startShiftByID`, data);
  }

  assignShift(data) {
    return this.http.post(`${environment.baseApiUrl}assignShift`, data);
  }

  sms(data) {
    return this.http.post(`${environment.baseApiUrl}sms`, data);
  }

  getAppliedShiftById(data) {
    return this.http.post(`${environment.baseApiUrl}getAppliedShiftById`, data);
  }

  verifyOtp(data){
    return this.http.post(`${environment.baseApiUrl}verifyOtp`, data);
  }

  editManagementByID(data):Observable<any> {
    return this.http.post(`${environment.baseApiUrl}editManagementByID`, data);
  }

  updateManagementId(data) {
    return this.http.post(`${environment.baseApiUrl}updateManagementId`, data);
  }

  editCommunity(data) {
    return this.http.post(`${environment.baseApiUrl}editCommunity`, data);
  }

  
  editAgencies(data:any) {
    return this.http.post(`${environment.baseApiUrl}editAgencies`, data);
  }

  addManagement(data) {
    return this.http.post(`${environment.baseApiUrl}addManagement`, data);
  }

  editshift(data) {
    return this.http.post(`${environment.baseApiUrl}editshift`, data);
  }
  
  applyShift(data) {
    return this.http.post(`${environment.baseApiUrl}applyShift`, data);
  }

  updateAprroval(data) {
    return this.http.post(`${environment.baseApiUrl}updateAprroval`, data);
  }

  getCommunityShiftByID(searchStr = '',for_cp1, currentUser1,cpType,tpUsr) {
    if(tpUsr == 'typeUser'){
      return this.http.get(`${environment.baseApiUrl}getCommunityShiftByID/${currentUser1}?searchStr1=${searchStr}&for_cp=${for_cp1}&typeUser=${cpType.cpType2}`);
    }else{
      return this.http.get(`${environment.baseApiUrl}getCommunityShiftByID/${currentUser1}?searchStr2=${searchStr}&for_cp=${for_cp1}&typeUser=${null}&typeUser1=${cpType.cpType2}`);
    }
  }

  getCommunityShift(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getCommunityShift/${id}`,);
  }

  getManagementNames(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getManagementNames`);
  }

  getMNGTUser(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getMNGTUser`);
  }

  getCommunityShifts(searchStr = '',page,shiftType, currentUser1,limit): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getCommunityShifts/${currentUser1}?searchStr=${searchStr}&pageNo=${page}&typeUser=${shiftType}&limitNum=${limit}`,);
  }
 

  getLoginLogs(id) {
    return this.http.get(`${environment.baseApiUrl}loginLogHistory/${id}`);

  }

  getAllUsers(searchStr = ''): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAllUsers?searchStr=${searchStr}`);
  }

  getcommunity(searchStr = '', page, limit): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getcommunity?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}`);
  }

  getAgency(searchStr = '', page, limit, community_id = null,is_for): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAgencies?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}&community_id=${community_id}&is_for=${is_for}`);
  }

  getManagement(searchStr = '', page): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getManagement?searchStr=${searchStr}&pageNo=${page}`);
  }

  getshift(searchStr = '', page, limit,userShift): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getshift?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}&typeUser=${userShift}`)
  }

  getCommunityId(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}communityID`);
  }

  getUserId(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}userID`);
  }

  getMNMGcommunity(searchStr = '', page, limit,): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getMNMGcommunity?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}`);
  }

  getAgencyId(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}agenciesID`);
  }

  getProjectId(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}projectID`);
  }

  addProject(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addProject`, data);
  }

  agenciesID(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}agenciesID`);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}register`, data);
  }

  addAgency(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addAgencies`, data);
  }

  assignContract(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}assignContract`, data);
  }

  updatePrimaryContact(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updatePrimaryContact`, data);
  }

  updateAgencyPassword(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updateAgenciesPassword`, data);
  }

  updateCommunityPassword(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updateCommunityPassword`, data);
  }

  updateSurveyCompliance(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updateSurveyCompliance`, data);
  }

  updateManagementCompany(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updateManagementCompany`, data);
  }

  updateSinleCOm(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updateSingleCommunity`, data);
  }

  deleteUser(data): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}deleteCommunity`, data);
  }

  deleteUserById(data): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}deleteUser`, data);
  }

  deleteActivity(data): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}deleteAgencies`, data);
  }

  genericErrorToaster(Msg: string = '') {
    let error = Msg || 'Oops! something went wrong, please try again later.'
    this.toaster.errorToastr(error);
  }

  getAllDriver(searchStr = ''): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAllDriver?searchStr=${searchStr}`);
  }

  getProjectById(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getProjectById?id=${id}`);
  }

  getManagementById(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getManagementById?id=${id}`);
  }

  getcommunityById(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getcommunityById?id=${id}`);
  }

  getAgenciesByID(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAgenciesByID?id=${id}`);
  }

  getUserById(id,is_for): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getUserById?id=${id}&is_for=${is_for}`);
  }

  getshiftById(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getshiftById?id=${id}`);
  }

  deleteshift(id): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}deleteshift`, id);
  }

  getUser(searchStr = '', page, limit,is_for ): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getUser?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}&is_for=${is_for}`);
  }

  getContract(searchStr = '', page, limit,): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getContract?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}`);
  }

  getProject(searchStr = '', page, limit, community_id = null, agency_id = null): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getProject?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}`);
  }

  addUser(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addUser`, data);
  }

  addContract(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addContract`, data);
  }

  editUser(data: any,is_for): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}editUser?is_for=${is_for}`, data);
  }

  // getBookingList(data): Observable<any> {
  //   // let params = '';
  //   // params += (data.start_date) ? `&start_date=${data.start_date}` : '';
  //   // params += (data.end_date) ? `&end_date=${data.end_date}` : '';
  //   // params += (data.typeUser) ? `&typeUser=${data.typeUser}` : '';
  //   return this.http.get(`${environment.baseApiUrl}bookingListing?enc=${data}`);
  // }

  // sortFtransactions(transactions) {
  //   let ot = transactions;
  //   // ot = ot.sort((a, b) => {
  //   //   return this.transactionPriorityArray.indexOf(a.order_type)
  //   //     - this.transactionPriorityArray.indexOf(b.order_type)
  //   // });
  //   // ot = ot.sort((a, b) => {
  //   //   if (a.payment_type && b.payment_type) {
  //   //     return this.paymentTypePriority.indexOf(a.payment_type)
  //   //       - this.paymentTypePriority.indexOf(b.payment_type)
  //   //   } else return 1;
  //   // });
  //   ot = ot.sort((a, b) => {
  //     let acd = this.changeDatetoTime(a.created_at)
  //     let bcd = this.changeDatetoTime(b.created_at)
  //     return bcd - acd
  //   });
  //   return ot;
  // }

  changeDatetoTime(crdt) {
    return new Date(crdt.replace('T', ' ').replace('.000Z', '').replace(/-/g, '/') + '').getTime();
  }

  // reqforAntiCode(input_data) {
  //   return this.http.post(`${environment.baseApiUrl}reqforAntiCode`, input_data);
  // }


  getGeoDevData() {
    this.getGeoData().subscribe(
      res => {
        this.geodata = res;
      }, error => {

      }
    );
  }

  getDeviceData() {
    this.devicedata = this.deviceService.getDeviceInfo();
    sessionStorage.setItem("device_type", this.devicedata['os']);
  }

  getgeoDevObject() {
    let locData: any = {};
    if (this.geodata) {
      locData.geoData = this.geodata;
      locData.ip_address = this.geodata.IPv4 ? this.geodata.IPv4 :
        this.geodata.IPv6 ? this.geodata.IPv6 : '';
      locData.area = this.geodata.city ? this.geodata.city
        : this.geodata.country ? this.geodata.country : '';
    }

    if (this.devicedata) {
      locData.deviceData = this.devicedata;
      locData.platform = this.devicedata.browser;
      locData.device = this.devicedata.os;
    }

    return locData;
  }

}
