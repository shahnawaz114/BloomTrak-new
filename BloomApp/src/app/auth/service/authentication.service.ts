import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { UserBalanceService } from './user-balance.service';
import { CoreTranslationService } from '@core/services/translation.service';


const TOKEN_KEY = 'Carental-admin-auth-token';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;
  public profilePicUpdate = new BehaviorSubject<boolean>(false);

  loggedOut: boolean;
  tempToken: string = '';

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   * @param {UserBalanceService} _userBalanceService
   */
  constructor(
    private _http: HttpClient,
    private encryptionService: EncryptionService,
    private _userBalanceService: UserBalanceService,
    public toastr: ToastrManager,
    private _coreTranslationService: CoreTranslationService
  ) {
    this.checkToken();
  }

  checkToken() {
    let locToken = this.encryptionService.decode(localStorage.getItem(TOKEN_KEY));
    if (locToken) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(locToken));
      this.currentUser = this.currentUserSubject.asObservable();
    } else {
      this.currentUserSubject = new BehaviorSubject<User>(null);
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }

  updateTokenValue(updatedUser: any) {
    if (updatedUser && updatedUser.token) {
      localStorage.setItem(TOKEN_KEY, this.encryptionService.encode(JSON.stringify(updatedUser)));
      this.currentUserSubject.next(updatedUser);
    }
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   * User login
   *
   * @param email
   * 
   * @param password
   * @returns user
   */
  login(email: string, password: string, user_role: any,  adminLogin = false,loginManagement = false, ipdata = null) {
    let data:any = {
      "password": password.trim(),
      "adminLogin": adminLogin,
      "loginManagement": loginManagement,
      "user_role": user_role,
      'ip_data': ipdata
    }
    
    let url = '';
    if( user_role == '3')  { 
      url = 'loginManagement';
      data.email = email.trim();
    } else if( user_role == '6')  { 
      url = 'admLogin';
      data.email = email.trim();
    } else {
      data.phone_no = email.trim();
      url = 'login';
    }
    
    let enc_data = this.encryptionService.encrypt(JSON.stringify(data));
    return this._http
      .post<any>(`${environment.baseApiUrl}${url}`, data)
      // .pipe(
      //   map(user => {
      //     return this.encryptionService.getDecode(user);
      //   })
      // );
  }

  verifyTwoFA(data): Observable<any> {
    let enc_data = this.encryptionService.encrypt(JSON.stringify(data));
    return this._http.post(`${environment.baseApiUrl}twoFactAuthVerify`, { enc: enc_data })
  }

  verifyAntiPhising(data): Observable<any> {
    let enc_data = this.encryptionService.encrypt(JSON.stringify(data));
    return this._http.post(`${environment.baseApiUrl}verifyAntiPhising`, { enc: enc_data })
  }
  
  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(TOKEN_KEY);
    // notify
    this.currentUserSubject.next(null);
    // clearBalance stored balance
    this._userBalanceService.resetBalance();
    // set logout flag
    this.loggedOut = true;

  }

  setLogin(user) {
    if (user && user.token) {
      localStorage.setItem(TOKEN_KEY, this.encryptionService.encode(JSON.stringify(user)));
      this.currentUserSubject.next(user);
      this.loggedOut = false;
    }
  }

  errorToaster(data: any, toToast = true) {
    if (data.error && data.msg) {
      if (data.auth == false) {
        if (!this.loggedOut) {
          // show toaster for session out;
          if (toToast) {
            this._coreTranslationService.getTransalate('COMMONERRORS.SESSIONOUT').subscribe(
              res => {

                this.toastr.errorToastr(res);
              }
            );
          }
        }
        this.loggedOut = true;
      } else {
        // show default retuned error;
        if (toToast) {
          this.toastr.errorToastr(data.msg);
        }
      }
    }
  }




}
