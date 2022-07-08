import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Role, User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceComponent implements OnInit {
  @ViewChild('reserveDateModal') reserveDateModal: ElementRef<any>;

  // Public
  public data: any = { total_users: 0, total_drivers: 0, total_coupons: 0 };
  public currentUser: User;
  public isAdmin: boolean;
  public isClient: boolean;
  public loadingStats: boolean;
  rLink: any;
  viewStat: any;

  public memoText: string = '';
  initialized: boolean = false;
  show = false;


  dashusers = [
    {
      id: 0, username: '', total_username: 0, name: 'Communities', roles: [Role.SuperAdmin ,Role.Admin]
    },
    {
      id: 1, username: '', total_username: 0, name: 'Shift', roles: [Role.Community]
    },
    {
      id: 2, username: '', total_username: 0, name: 'Shift', roles: [Role.Agency]
    },
    {
      id: 3, username: '', total_username: 0, name: 'Shift', roles: [Role.User]
    },
  ]

 

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    height: 500,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth'
    },
    buttonText: {
      month: 'Month',
    },

    events: []
  };
  availabilityDates: any[];
  calLabels = ['Booking', 'Reserved', 'Holiday']
  /**
   * Constructor
   * @param {AuthenticationService} _authenticationService
   * @param {DashboardService} _dashboardService
   */

  rows: any[] = [];
  page = new Page();
  todayBooking: any[] = [];
  todays_Departure: any[] = [];
  todays_Returning: any[] = [];
  loadingMemo: boolean;
  selectedResDate: any;
  unReserveDt: boolean;
  reservingDate: boolean;
  stats: { id: number; name: string; stat: number; icon: string; iconColor: string; roles: Role[]; }[];
  constructor(
    private _authenticationService: AuthenticationService,
    private _dashboardService: DashboardService,
    private _encryptionService: EncryptionService,
    private _toastr: ToastrManager,
    private modalService: NgbModal,
    private datasrv: DataService,


  ) {
   
    this.isAdmin = this._authenticationService.isAdmin;
    this.isClient = !this._authenticationService.isAdmin;
  }
 

  ngOnInit(): void {
    this._authenticationService.currentUser.subscribe((x: any) => {
      console.log(x)
      this.currentUser = x
      this.stats = [
        {
          id: 0, name: 'Communities', stat: 0, icon: 'fa fa-users', iconColor: 'bg-light-primary', roles: [Role.SuperAdmin,Role.Admin]
        },
        {
          id: 1, name: 'Agencies', stat: 0, icon: 'fa fa-building-o', iconColor: 'bg-light-info', roles: [Role.SuperAdmin]
        },
        {
          id: 2, name: 'Employees', stat: 0, icon: 'fa fa-user', iconColor: 'bg-light-danger', roles: [Role.SuperAdmin]
        },
    
       
    
        {
          id: 3, name: 'Shift', stat: 0, icon: 'fa fa-users', iconColor: 'bg-light-primary', roles: [Role.Community,Role.Admin]
        },
        {
          id: 4, name: 'Agencies', stat: 0, icon: 'fa fa-building-o', iconColor: 'bg-light-info', roles: [Role.Community]
        },
        {
          id: 5, name: 'Employees', stat: 0, icon: 'fa fa-car', iconColor: 'bg-light-danger', roles: [Role.Community]
        },
        //   {
        //     id:6, name:'Contacts', stat:0, icon: 'fa fa-users', iconColor:'bg-light-primary', roles: [ Role.Community ]
        //  },
    
    
    
        
        {
          id: 6, name: 'Shift', stat: 0, icon: 'fa fa-users', iconColor: 'bg-light-primary', roles: [Role.Agency]
        },
    
    
    
    
        {
          id: 7, name: 'Shift', stat: 0, icon: 'fa fa-car', iconColor: 'bg-light-danger', roles: [Role.User]
        },
        {
          id: 8, name: 'Shift', stat: 0, icon: 'fa fa-suitcase', iconColor: 'bg-light-primary', roles: [Role.SuperAdmin]
        },
        {
          id:9, name: 'Agency Personnel', stat:0, icon: 'fa fa-user', iconColor:'bg-light-primary', roles: [ Role.Agency ]
        },
        // {
        //   id:10, name:'All Contracts', stat:0, icon: 'fa fa-car', iconColor:'bg-light-danger', roles: [ Role.User]
        // },
        // {
        //   id:11, name:'Completed  Contracts', stat:0, icon: 'fa fa-car', iconColor:'bg-light-danger', roles: [ Role.User]
        // },
    
      ]

      if (this.currentUser && this.currentUser.user_role == '1') {
        this.viewStat = 'View Shift' //  community
        this.rLink = '/shift'
      } else if (this.currentUser && this.currentUser.user_role == '6') {
        this.viewStat = 'View Communities' // admin
        this.rLink = '/community'
      } else if (this.currentUser && this.currentUser.user_role == '2') {
        this.viewStat = 'View Shift' // agency
        this.rLink = '/shift'
      } 
      else if (this.currentUser && this.currentUser.user_role == '3') {
        this.viewStat = 'View Communities' // agency
        this.rLink = '/community'
      } else {
        this.viewStat = 'View Shift ' // User
        this.rLink = '/shift'
      }
    }
    );
    this._dashboardService.getDashboardData(this.currentUser.role).subscribe(response => {
      if (!response.error) {
        let data = response;
        console.log(this.currentUser.user_role)
        if (this.currentUser && this.currentUser.user_role == '6') {
          this.stats[0].stat = data.body[0].Community_portal; //admin
          this.stats[1].stat = data.body[0].Agencies; //admin
          this.stats[2].stat = data.body[0].Employees; //admin
          this.stats[8].stat = data.body[0].shift; //admin
          this.dashusers[0].total_username = data.body[0].Community_portal; //admin
        }
        else if (this.currentUser && this.currentUser.user_role == '1') {
          this.stats[3].stat = data.body.SHIFT; //community
          this.stats[4].stat = data.body.Agencies; //community
          this.stats[5].stat = data.body.Employees; //community
          // this.stats[6].stat = data.body[0].Contracts; //community
          this.dashusers[1].total_username = data.body.SHIFT; //community
        }
        else if (this.currentUser && this.currentUser.user_role == '2') {
          // this.stats[7].stat = data.body[0].Contracts; //agency
          this.stats[9].stat = data.body[0].Employees; //User
          this.stats[6].stat = data.body[0].shift; //agency
          this.dashusers[2].total_username = data.body[0].shift; //Agency        

        }else if (this.currentUser && this.currentUser.user_role == '3') {
          // this.stats[7].stat = data.body[0].Contracts; //agency
          this.stats[0].stat = data.body[0].Community_portal; //User
          this.stats[3].stat = data.body[0].shift; //agency
          this.dashusers[0].total_username = data.body[0].Community_portal; //Agency        

        }
        else if (this.currentUser && this.currentUser.user_role == '4') {
          this.stats[7].stat = data.body[0].SHIFT; //User
          this.dashusers[3].total_username = data.body[0].SHIFT; //Users
        }


        console.log(this.stats)
        this.data = data.body[0];
      }
      this.loadingStats = false;
    }, error => {
      this.loadingStats = false;
    });

    // this._authenticationService.login(this.currentUser.value)


  }

  // getTodaysStats() {
  //   this._dashboardService.getTodaysData().subscribe(response => {
  //     if (!response.error) {
  //       this.todayBooking = response.body.TodayBooking
  //       this.todays_Departure = response.body.Todays_Departures
  //       this.todays_Returning = response.body.Todays_Returning
  //     }
  //     this.loadingStats = false;
  //   }, error => {
  //     this.loadingStats = false;

  //   });
  // }

  // getMemoData() {
  //   this.loadingMemo = true;
  //   this._dashboardService.getMemoData().subscribe(
  //     res => {
  //       if(!res.error) {
  //         let data = this._encryptionService.getDecode(res);
  //         this.memoText = data.body[0].memo_text;
  //       } else {

  //         this._toastr.errorToastr(res.msg);
  //       }
  //       this.loadingMemo = false;
  //     }, error => {
  //       this.loadingMemo = false;
  //     }
  //   )
  // }

  updateMemo() {
    this.loadingMemo = true;
    let data = { enc: this._encryptionService.encode(JSON.stringify({ desc: this.memoText })) };
    this._dashboardService.updateMemoData(data).subscribe(
      res => {
        if (!res.error) {
          // this.memoText = res.body;
          this._toastr.successToastr(res.msg);
        } else {
          this._toastr.errorToastr(res.msg);
        }
        this.loadingMemo = false;
      }, error => {
        this.loadingMemo = false;
      }
    )
  }

  // getAllHolidays() {
  //   this.initialized = false;
  //   this._dashboardService.getAllHolidays().subscribe(res => {
  //     if(!res.error) {
  //       this.availabilityDates = res.body;
  //       let bookingArr:any[] = [];
  //       let blockedArr:any[] = [];
  //       let holidayArr:any[] = [];
  //       this.availabilityDates.forEach(
  //         item => {
  //           if(item.booking_dates) {
  //             item.booking_dates.forEach(bd => {
  //               if(bd) {
  //                 bookingArr.push({ title: this.calLabels[0], start: bd })
  //               }
  //             });
  //           }
  //           if(item.block_dates) {
  //             let unique_block_dates = new Set(item.block_dates)
  //             unique_block_dates.forEach(bd => {
  //               if(bd) {
  //                 blockedArr.push({ title: this.calLabels[1], start: bd })
  //               }
  //             });
  //           }
  //           if(item.setting_value) {
  //             item.setting_value.forEach(bd => {
  //               if(bd) {
  //                 holidayArr.push({ title: this.calLabels[2], start: bd })
  //               }
  //             });
  //           }
  //         }
  //       );
  //       let newArr:any[] = [];
  //       newArr = bookingArr.concat(holidayArr).concat(blockedArr);
  //       this.calendarOptions.events = newArr;
  //       this.initialized = true;
  //     }
  //   }, error => {
  //     this.calendarOptions.events = [];
  //     this.initialized = true;
  //   });
  // }

  handleDateClick(arg) {
    var now = new Date();
    if (arg.date.setHours(0, 0, 0, 0) <= now.setHours(0, 0, 0, 0)) {
    } else {
      let events = JSON.parse(JSON.stringify(this.calendarOptions.events))
      let dtFound = events.filter(ev => ev.start == arg.dateStr && ev.title == this.calLabels[2]);
      this.selectedResDate = arg.dateStr
      if (dtFound.length && dtFound[0].title == this.calLabels[2]) {
        this.unReserveDt = true;
        this.modalOpenOSE(this.reserveDateModal, 'sm');
      } else if (dtFound.length && this.calLabels.includes(dtFound[0].title)) {
        //do nothing
        return;
      } else {
        // no event added yet
        this.unReserveDt = false;
        this.modalOpenOSE(this.reserveDateModal, 'sm');
      }
    }
  }

  // reserveDate(modal) {
  //   let events = JSON.parse(JSON.stringify(this.calendarOptions.events))
  //   let holidays = events.filter(item =>  item.title == this.calLabels[2]);
  //   let dates = [];
  //   holidays.forEach(item => {
  //      (this.unReserveDt && this.selectedResDate == item.start) ? '' : dates.push(item.start);
  //   })
  //   if(!this.unReserveDt && this.selectedResDate) {
  //     dates.push(this.selectedResDate);
  //   }
  //   let enc = this._encryptionService.encode(JSON.stringify({setting_value:dates}));
  //   // return;
  //   this.reservingDate = true;
  //   this._dashboardService.updateHoliday({enc}).subscribe((res) => {
  //     if (!res.error) {
  //       this.initialized = false;
  //       if (this.unReserveDt) { 
  //         this.initialized = false;
  //         let splicedEvts = events.filter(rm => rm.start != this.selectedResDate && rm.title != this.calLabels[2]);
  //         this.calendarOptions.events = events;
  //         // this.getAllHolidays()

  //       }else {
  //         events.push({ title: this.calLabels[2], start: this.selectedResDate })
  //         this.calendarOptions.events = events;
  //       }
  //       this.initialized = true;
  //       this._toastr.successToastr(res.msg);
  //       this.closed(modal);
  //     }
  //     else {
  //       this._toastr.errorToastr('Oops! something went wrong');
  //     }
  //     this.reservingDate = false;
  //   })
  // }

  modalOpenOSE(modalOSE, size = 'sm') {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: size,
        centered: true,
      }
    );
  }

  closed(modal: NgbModalRef) {
    this.selectedResDate = null;
    this.unReserveDt = false;
    modal.dismiss();
  }

  
  
}
