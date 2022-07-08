import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { shift, User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import moment from 'moment';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {
  searchSub: any = null;
  public page = new Page();
  loadingList: boolean;
  searchStr: string = '';
  public rows: any = [];
  todaysDate: any;
  btnShow: boolean = false;
  addShiftType: FormGroup;
  editFormData!: FormGroup;
  mngmCommunity: any = [];
  allCommunity: any = [];
  currenUserId: any = ''
  public currentUser: User;
  minDate: any;
  approvedHide: boolean = false;
  shiftTypeDrpHide : boolean = false ;

  id: { id: any; };
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef<any>;
  @ViewChild('deleteShift') deleteShift: ElementRef<any>;
  @ViewChild('appliedList') appliedList: ElementRef<any>;
  // @ViewChild('clockInModal') clockInModal: ElementRef<any>;

  shiftType: any = '';
  cpType: any;
  user = new shift();
  formArray: any[] = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'value',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };
  dropdownSettings1: IDropdownSettings = {
    singleSelection: true,
    idField: 'value',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    closeDropDownOnSelection: true,
    allowSearchFilter: true
  };
  dropdownSettings2: IDropdownSettings = {
    singleSelection: true,
    idField: 'value',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };
  dropdownSettings3: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'community_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  Hours: any = [
    { hour: 1 },
    { hour: 2 },
    { hour: 3 },
    { hour: 4 },
    { hour: 5 },
    { hour: 6 },
    { hour: 7 },
    { hour: 8 },
    { hour: 9 },
    { hour: 10 },
  ]

  Minutes: any = [
    { minute: 1 },
    { minute: 2 },
    { minute: 3 },
    { minute: 4 },
    { minute: 5 },
    { minute: 6 },
    { minute: 7 },
    { minute: 8 },
    { minute: 9 },
    { minute: 10 },
    { minute: 11 },
    { minute: 12 },
    { minute: 13 },
    { minute: 14 },
    { minute: 15 },
    { minute: 16 },
    { minute: 17 },
    { minute: 18 },
    { minute: 19 },
    { minute: 20 },
    { minute: 21 },
    { minute: 22 },
    { minute: 23 },
    { minute: 24 },
    { minute: 25 },
    { minute: 26 },
    { minute: 27 },
    { minute: 28 },
    { minute: 29 },
    { minute: 30 },
    { minute: 31 },
    { minute: 32 },
    { minute: 33 },
    { minute: 34 },
    { minute: 35 },
    { minute: 36 },
    { minute: 37 },
    { minute: 38 },
    { minute: 39 },
    { minute: 40 },
    { minute: 41 },
    { minute: 42 },
    { minute: 43 },
    { minute: 44 },
    { minute: 45 },
    { minute: 46 },
    { minute: 47 },
    { minute: 48 },
    { minute: 49 },
    { minute: 50 },
    { minute: 51 },
    { minute: 52 },
    { minute: 53 },
    { minute: 54 },
    { minute: 55 },
    { minute: 56 },
    { minute: 57 },
    { minute: 58 },
    { minute: 59 },
  ]
  timeslots: any[] = [
    { value: { hour: 0, minute: 0 }, label: '00:00', },
    { value: { hour: 0, minute: 30 }, label: '00:30', },
    { value: { hour: 1, minute: 0 }, label: '01:00', },
    { value: { hour: 1, minute: 30 }, label: '01:30', },
    { value: { hour: 2, minute: 0 }, label: '02:00', },
    { value: { hour: 2, minute: 30 }, label: '02:30', },
    { value: { hour: 3, minute: 0 }, label: '03:00', },
    { value: { hour: 3, minute: 30 }, label: '03:30', },
    { value: { hour: 4, minute: 0 }, label: '04:00', },
    { value: { hour: 4, minute: 30 }, label: '04:30', },
    { value: { hour: 5, minute: 0 }, label: '05:00', },
    { value: { hour: 5, minute: 30 }, label: '05:30', },
    { value: { hour: 6, minute: 0 }, label: '06:00', },
    { value: { hour: 6, minute: 30 }, label: '06:30', },
    { value: { hour: 7, minute: 0 }, label: '07:00', },
    { value: { hour: 7, minute: 30 }, label: '07:30', },
    { value: { hour: 8, minute: 0 }, label: '08:00', },
    { value: { hour: 8, minute: 30 }, label: '08:30', },
    { value: { hour: 9, minute: 0 }, label: '09:00', },
    { value: { hour: 9, minute: 30 }, label: '09:30', },
    { value: { hour: 10, minute: 0 }, label: '10:00', },
    { value: { hour: 10, minute: 30 }, label: '10:30', },
    { value: { hour: 11, minute: 0 }, label: '11:00', },
    { value: { hour: 11, minute: 30 }, label: '11:30', },
    { value: { hour: 12, minute: 0 }, label: '12:00', },
    { value: { hour: 12, minute: 30 }, label: '12:30', },
    { value: { hour: 13, minute: 0 }, label: '13:00', },
    { value: { hour: 13, minute: 30 }, label: '13:30', },
    { value: { hour: 14, minute: 0 }, label: '14:00', },
    { value: { hour: 14, minute: 30 }, label: '14:30', },
    { value: { hour: 15, minute: 0 }, label: '15:00', },
    { value: { hour: 15, minute: 30 }, label: '15:30', },
    { value: { hour: 16, minute: 0 }, label: '16:00', },
    { value: { hour: 16, minute: 30 }, label: '16:30', },
    { value: { hour: 17, minute: 0 }, label: '17:00', },
    { value: { hour: 17, minute: 30 }, label: '17:30', },
    { value: { hour: 18, minute: 0 }, label: '18:00', },
    { value: { hour: 18, minute: 30 }, label: '18:30', },
    { value: { hour: 19, minute: 0 }, label: '19:00' },
    { value: { hour: 19, minute: 30 }, label: '19:30' },
    { value: { hour: 20, minute: 0 }, label: '20:00' },
    { value: { hour: 20, minute: 30 }, label: '20:30' },
    { value: { hour: 21, minute: 0 }, label: '21:00' },
    { value: { hour: 21, minute: 30 }, label: '21:30' },
    { value: { hour: 22, minute: 0 }, label: '22:00' },
    { value: { hour: 22, minute: 30 }, label: '22:30' },
    { value: { hour: 23, minute: 0 }, label: '23:00' },
    { value: { hour: 23, minute: 30 }, label: '23:30' },
    { value: { hour: 24, minute: 0 }, label: '24:00' },
  ]
  user_id: any;
  rows1: any = []
  singleShiftdtail: any = []
  appliedUserdtail: any;
  data: any;
  dt_tm: any = []
  dt_tm1: any = []
  departmentVal: any = [{ name: 'Activities', value: 'Activities' }, { name: 'Business Office', value: 'Business Office' }, { name: 'Dining', value: 'Dining' }, { name: 'Environmental Services', value: 'Environmental Services' }, { name: 'Health & Wellness', value: 'Health & Wellness' }, { name: 'Housekeeping', value: 'Housekeeping' }, { name: 'Laundry', value: 'Laundry' }]
  positionVal: any = [{ name: 'Concierge', value: 'Concierge' }, { name: 'Cook', value: 'Cook' }, { name: 'Dining Concierge', value: 'Dining Concierge' }, { name: 'Direct Care Aide', value: 'Direct Care Aide' }, { name: 'Dishwasher/Dining Aide', value: 'Dishwasher/Dining Aide' }, { name: 'Housekeeper', value: 'Housekeeper' }, { name: 'Laundry Aide', value: 'Laundry Aide' }, { name: 'Maintenance Assistant', value: 'Maintenance Assistant' }, { name: 'Registered Medication Aide/AMAP', value: 'Registered Medication Aide/AMAP' }, { name: 'Shift Supervisor', value: 'Shift Supervisor' }]
  certificationVal: any = [{ name: 'Direct Care Aide', value: 'Direct Care Aide' }, { name: 'Licensed Practical Nurse', value: 'Licensed Practical Nurse' }, { name: 'Registered Medication Aide', value: 'Registered Medication Aide' }, { name: 'Registered Nurse', value: 'Registered Nurse' }, { name: 'Serve Safe Certified' }]
  // questions = []
  // currentQuestions = 0;
  shiftId: any;
  h_m: string;
  end_time: any;
  start_time: any;
  endTime: any;
  startTime: any;
  department: any = [];
  description: any;
  positions: any = [];
  certification: any = [];
  is_urgent: any;
  delay: any;
  for_cp: any;
  shiftID: any;
  shiftCommunication: any;
  community: any;
  position: any = [];
  cmntId: any;
  hideTbl :boolean = false;
  chngCommntyList: any =[]
  slctCpType: any;
  srchVal: any;
  constructor(
    private encryptionService: EncryptionService,
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private tost: ToastrManager,
    private genApi: ApiService
  ) {
    // this.initQuestions();
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
        console.log(x)
      }
      );

      this.shiftType = null
      this.slctCpType = null
  }

  ngOnInit(): void {
    console.log(this.searchStr)
    setTimeout(() => {
      this.delay = this.Hours[0].hour
    }, 1000);
    this.getData();
    this.getCommunityId()
    this.filterShift()
    let today = new Date();
    this.user = new shift()
    console.log(this.todaysDate)
    this.user.h_m = 'Hours';
    this.todaysDate = this.getDate(today)
    console.log(this.currentUser)
    this.addShiftType = this.fb.group({
      shiftType: ['']
    })

      fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
        map((event: any) => {
          console.log(event.target.value)
          this.srchVal =  event.target.value;
          return  this.srchVal
        })
        , debounceTime(1000)
        , distinctUntilChanged()
      ).subscribe((text: string) => { 
        if(this.hideTbl == true){
          this.filterShift()
        }else{
          this.filterShift1()

        }
      });
      
      this.setPage({ offset: 0 });

  }

  getData() {
    this.dataService.getMNMGcommunity(this.searchStr = '', this.page.pageNumber, this.page.size).subscribe(res => {
      if (!res.error) {
        this.rows1 = res.body;
        this.rows1.forEach(element => {
          this.mngmCommunity.push(element)
        });
        this.mngmCommunity = [].concat(this.mngmCommunity);
        console.log(this.mngmCommunity)
      }
    });

  }

  modalOpenOSE(modalOSE, size = 'md') {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: size,
        centered: true,
      }
    );
  }

  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }

  // submitted(modal: NgbModalRef) {
  //   if (this.addShiftType.invalid) {
  //     return;
  //   }
  //   console.log(this.addShiftType.value)
  //   // else {
  //   //   this.btnShow = true;
  //   //   this.dataService.addContract(this.formData.value).subscribe((res: any) => {
  //   //     console.log(res)
  //   //     if (!res.error) {
  //   //       this.toastr.successToastr(res.msg);
  //   //       this.tempAddId = res.body[0]
  //   //       this.closeded(modal)
  //   //       this.setPage({ offset: 0 })
  //   //     } else {
  //   //       this.toastr.errorToastr(res.msg);
  //   //     }
  //   //     this.btnShow = false;
  //   //   },
  //   //     (err) => {
  //   //       this.btnShow = false;
  //   //       this.dataService.genericErrorToaster();

  //   //     })
  //   // }
  // }

  closed(modal: NgbModalRef) {
    modal.dismiss();
  }

  setPage(pageInfo) {
    console.log(pageInfo)
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
    this.page.pageNumber = pageInfo.offset;
    let data = {
      pageNo: this.page.pageNumber,
      limitNum: this.page.size,
    };
    let itemenc = this.encryptionService.encode(JSON.stringify(data))
    this.loadingList = true;
    if (this.currentUser.role == 'Community' || this.currentUser.role == 'SuperAdmin') {
      this.getCommunityShifts()
    } else if (this.currentUser.role == 'User' || this.currentUser.role == 'Agency') {
      this.filterShift()
    }
    else if (this.currentUser.role == 'Admin') {
      let id = this.currentUser._id
      let usetype = null
      this.dataService.getCommunityShifts(this.searchStr = '', this.page.pageNumber, usetype, id, this.page.size).subscribe(res => {
        if (!res.error) {
          this.rows = res.body
          if (!res.pagination) {
            this.page.size = res.body.length;
            this.page.totalElements = res.body.length;
            this.page.pageNumber = res.pagination.pageNumber;
            this.page.totalPages = res.pagination.totalPages;
          } else {
            this.page = res.pagination
            this.page.pageNumber = res.pagination.pageNumber
          }
        } else {
          this._authenticationService.errorToaster(data)
        }
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      }
      )
    }
    // else {
    //   let userShifts = ''
    //   this.dataService.getshift(this.searchStr, this.page.pageNumber, this.page.size,userShifts).subscribe(res => {
    //     if (!res.error) {
    //       this.rows = res.body
    //       this.rows.map(rt => {
    //         console.log(
    //           rt.start_time = moment.unix(rt.start_time).format("YYYY-MM-DD hh:mm"),
    //           rt.end_time = moment.unix(rt.end_time).format("YYYY-MM-DD hh:mm"))
    //       })
    //       if (!res.pagination) {
    //         this.page.size = res.body.length;
    //         this.page.totalElements = res.body.length;
    //         this.page.pageNumber = res.pagination.pageNumber;
    //         this.page.totalPages = res.pagination.totalPages;
    //       } else {
    //         this.page = res.pagination
    //         this.page.pageNumber = res.pagination.pageNumber
    //       }
    //     } else {
    //       this._authenticationService.errorToaster(data)
    //     }
    //     this.loadingList = false;
    //   }, error => {
    //     this.loadingList = false;
    //   }
    //   )
    // }
  }

  applyShift(row) {
    console.log(row)
    let body = {
      for_cp: row.for_cp,
      shift_id: row.id,
      user_id: this.currentUser.id,
      is_agency: this.currentUser?.role == 'Agency' ? 1 : 0
    }

    console.log(body)
    this.dataService.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    }, (err) => {
      this.dataService.genericErrorToaster()
    })
  }

  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.tost.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataService.genericErrorToaster();

    })
    // this.allCommunity = [].concat(this.allCommunity);

  }

  // getDate(miliS) {
  //   let todayDate: any = new Date(miliS);
  //   let toDate: any = todayDate.getDate();
  //   if (toDate < 10) {
  //     toDate = '0' + toDate
  //   }
  //   let month = todayDate.getMonth() + 1;
  //   if (month < 10) {
  //     month = '0' + month;
  //   }
  //   let year = todayDate.getFullYear();
  //   this.minDate = year + '-' + month + '-' + toDate
  //   return this.minDate
  // }

  openDeleteShift(row: any,) {
    this.id = { id: row.id }
    console.log(this.id)
    this.modalOpenOSE(this.deleteShift, 'lg');
  }



  deleteshift(modal: NgbModalRef) {
    this.btnShow = true;
    this.dataService.deleteshift(this.id).subscribe((res: any) => {
      if (!res.error) {
        this.setPage({ offset: 0 });
        this.tost.successToastr(res.msg)
        this.closeded(modal)
        this.btnShow = false;
      } else {
        this.btnShow = false;
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.genApi.genericErrorToaster()

      })
  }

  getCommunityShift() {
    let currentUser1 = this.currentUser.id
    this.dataService.getCommunityShift(currentUser1).subscribe((res: any) => {
      if (!res.error) {
        this.rows = res.body
        if (!res.pagination) {
          this.page.size = res.body.length;
          this.page.totalElements = res.body.length;
          // this.page.pageNumber = res.pagination.pageNumber;
          // this.page.totalPages = res.pagination.totalPages;
        } else {
          this.page = res.pagination
          this.page.pageNumber = res.pagination.pageNumber
        }
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  filterShift() {
    
    if (this.currentUser.role == 'User' || this.currentUser.role == 'Agency') {
      let for_cp1 = this.currentUser.role == 'User' ? 'true' : 'false';
      let currentUser1 = this.currentUser.id
      this.shiftTypeDrpHide = false
      let cpType = {cpType2 : this.shiftType ? this.shiftType : null , cpType1  : this.shiftType ? 'typeUser' : null}
      let slctCpType = {cpType2 :this.slctCpType ? this.slctCpType : null }
      console.log(for_cp1, currentUser1)
      let tpUsr = 'typeUser'
      this.dataService.getCommunityShiftByID(this.srchVal ,for_cp1, currentUser1, cpType ? cpType  : slctCpType,tpUsr).subscribe((res: any) => {
        if (!res.error) {
          this.rows = res.body.availableShifts
        
          this.hideTbl = true
          // if (this.currentUser.role == 'Agency') {
          //   this.rows1.filter(i => {
          //     if (i.for_cp == '0') {
          //       this.rows1.push(i)
          //       this.rows = this.rows1
          //     }
          //   })
          // }
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
  }

  filterShift1() {
    if (this.currentUser.role == 'User' || this.currentUser.role == 'Agency') {
      let for_cp1 = this.currentUser.role == 'User' ? 'true' : 'false';
      let currentUser1 = this.currentUser.id
      this.shiftTypeDrpHide = true
      let cpType = {cpType2 : this.shiftType ? this.shiftType : null , cpType1  : this.shiftType ? 'typeUser' : null}
      let tpUsr = 'typeUser1'
      let slctCpType = {cpType2 :this.slctCpType ? this.slctCpType : null }
      console.log(for_cp1, currentUser1)
      this.shiftTypeDrpHide = true
      this.dataService.getCommunityShiftByID(this.srchVal,for_cp1, currentUser1, cpType ? cpType : slctCpType,tpUsr).subscribe((res: any) => {
        if (!res.error) {
          this.rows1 = res.body.userShifts
         
             this.rows1.forEach(i => {
            if (i.approved == 1) {
              i.approval = 'Approved'
              i.approvedHide = true
            } else if (i.approved != 1) {
              i.approval = 'Pending'
              i.approvedHide = false
            }

          })
          this.hideTbl = false
          console.log(this.rows)
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
  }

  getCommunityShifts() {
    if (this.currentUser.role == 'Community' ) {
      let currentUser1 = this.currentUser.id
      let userShift = this.shiftType ? this.shiftType : null
      console.log(currentUser1, userShift)
      this.dataService.getCommunityShifts(this.searchStr ='', this.page.pageNumber, userShift, currentUser1, this.page.size).subscribe((res: any) => {
        if (!res.error) {
          this.rows = res.body
          if (!res.pagination) {
            this.page.size = res.pagination.size;
            this.page.totalElements = res.pagination.totalElements;
            this.page.pageNumber = res.pagination.pageNumber;
            this.page.totalPages = res.pagination.totalPages;
          } else {
            this.page = res.pagination
            this.page.pageNumber = res.pagination.pageNumber
          }
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    } else if(this.currentUser.role == 'User' || this.currentUser.role == 'Agency'){
     
      let for_cp1 = this.currentUser.role == 'User' ? 'true' : 'false';
      let currentUser1 = this.currentUser.id
      let cpType = {cpType2 : this.shiftType ? this.shiftType : null , cpType1  : 'typeUser'}
      let slctCpType = {cpType2 :this.slctCpType ? this.slctCpType : null }
      let tpUsr = 'typeUser'

      this.dataService.getCommunityShiftByID(this.searchStr ='',for_cp1,currentUser1, cpType ? cpType : slctCpType,tpUsr).subscribe((res: any) => {
        if (!res.error) {
          this.rows = res.body.availableShifts
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    } else {
      let userShift = this.shiftType ? this.shiftType : null
      this.dataService.getshift(this.searchStr ='', this.page.pageNumber, this.page.size, userShift).subscribe((res: any) => {
        if (!res.error) {
          this.rows = res.body
          if (!res.pagination) {
            this.page.size = res.pagination.size;
            this.page.totalElements = res.pagination.totalElements;
            this.page.pageNumber = res.pagination.pageNumber;
            this.page.totalPages = res.pagination.totalPages;
          } else {
            this.page = res.pagination
            this.page.pageNumber = res.pagination.pageNumber
          }
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
  }

  getCommunityShiftByID() {
   
    let currentUser1 = this.currentUser.id
    let userShift = this.currentUser.role == 'User' ? 'true' : 'false'
    console.log(currentUser1, userShift)
    // let cpType = {cpType2 : this.shiftType ? this.shiftType : null , cpType1  : 'typeUser'}
      let slctCpType = {cpType2 :this.slctCpType ? this.slctCpType : null }
      let tpUsr = 'typeUser1'

    this.dataService.getCommunityShiftByID(this.searchStr ='',userShift, currentUser1,  slctCpType,tpUsr).subscribe((res: any) => {
      if (!res.error) {
        this.rows1 = res.body.userShifts
        this.rows1.forEach(i => {
          if (i.approved == 1) {
            i.approval = 'Approved'
            i.approvedHide = true
          } else if (i.approved != 1) {
            i.approval = 'Pending'
            i.approvedHide = false
          }

        })
        // if (this.currentUser.role == 'Agency') {
        //   this.rows.filter(i => {
        //     if (i.for_cp == '0') {
        //       this.rows1.push(i)
        //       this.rows = this.rows1
        //     }
        //   })
        // }
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  getDate(today) {
    // let todayDate: any = new Date();
    let toDate: any = today.getDate();
    if (toDate < 10) {
      toDate = '0' + toDate
    }
    let month = today.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let year = today.getFullYear();
    this.minDate = year + '-' + month + '-' + toDate
    return this.minDate
  }

  assign(row) {
    console.log(row)
  }

  applied(row) {
    this.shiftID = row.id
    this.dataService.getshiftById(row.id).subscribe((res: any) => {
      if (!res.error) {
        this.singleShiftdtail = res.body
        this.appliedUser(row)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })

    this.modalOpenOSE(this.appliedList, 'lg');
  }

  appliedUser(row) {
      let body = {
        is_for:this.currentUser.role == 'Community' ? 'cp' : '',
        shift_id: row.id,
      }
      this.dataService.getAppliedShiftById(body).subscribe((res: any) => {
      if (!res.error) {
        this.appliedUserdtail = res.body
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  assignShift(snglUsr, modal) {
    console.log(snglUsr)
    let body = {
      id: this.shiftID,
      user_id: snglUsr.id,
    }
    this.dataService.assignShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.closeded(modal)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  // initQuestions() {
  //   this.questions = [
  //     { id: 1, question: "1.What is Your Name?", answer: '', error: false },
  //     { id: 2, question: "2. What is your Role?", answer: '', error: false },
  //     { id: 3, question: "3. What are you doing here?", answer: '', error: false },
  //     { id: 4, question: "4. What is your DOB?", answer: '', error: false },
  //     { id: 5, question: "5. Write a short bio.", answer: '', error: false },
  //     { id: 6, question: "6. What is your Phone number?", answer: '', error: false },
  //     { id: 7, question: "7. Enter your valid Email-id.", answer: '', error: false },
  //     { id: 8, question: "8. Enter your Shift type.", answer: '', error: false },
  //     { id: 9, question: "9. From where you get to know about us.", answer: '', error: false },
  //     { id: 10, question: "10. Enter your address.", answer: '', error: false }
  //   ]
  // }

  //   modalOpenOSE(modalOSE, size = 'sm') {
  //   this.modalService.open(modalOSE,
  //     {
  //       backdrop: false,
  //       size: size,
  //       centered: true,
  //     }
  //   );
  // }

  //  closed(modal: NgbModalRef) {
  //   modal.dismiss();
  // }

  // openClockIn() { //open the model
  //   this.initQuestions();
  //   this.modalOpenOSE(this.clockInModal, 'lg');
  //   this.currentQuestions = 0
  // }
  // nextQuestion(modal) { // Used to move next
  //   if (!this.questions[this.currentQuestions].answer) { // checking if the answer is entered or not. If yes then move to other condition else show error
  //     this.questions[this.currentQuestions].error = true; // Show error to the user
  //     this.tost.errorToastr('Error, Field Required') // Toaster Notification
  //   }
  //   else {
  //     this.questions[this.currentQuestions].error = false;
  //     if (this.currentQuestions < this.questions.length - 1) { // checking if the index of current question is less than length of the questions array. 
  //       this.currentQuestions += 1; // If the above condition satisfies than increment the current question index and move next by one
  //     }
  //     else {
  //       this.closed(modal)// closes the modal
  //       this.tost.successToastr('Submitted Successfully') //Toaster Notification
  //       console.log(this.questions); // console the final output in array.
  //     }
  //   }
  // }

  strtshft(row){
        let timeStart = moment(row.start_time).utc().unix();
        let tdy = new Date()
        let crrnTm = moment(tdy).utc().unix();
        let hourDiff =  timeStart - crrnTm ; //in ms
        // let secDiff = hourDiff / 1000;
        let minDiff = hourDiff / 60 / 1000; //in minutes
        let hDiff = hourDiff / 3600 / 1000; //in hours
        let hours = Math.floor(hDiff);
       let minutes = minDiff - 60 * hours;
       if(!isNaN(hours) && !isNaN(minutes)){
        if(hours.toString().includes('-')){
        this.tost.errorToastr( 'Shift is Over On this Current Time')
        return;
        }
        this.tost.errorToastr( 'Time is left ' + hours + ' hour and ' + minutes + ' minutes.')
        return;
       }
    console.log(row)
    let body = {
      is_for : 'start',
      id : row.id,
    }
    this.dataService.startShiftByID(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }
}
