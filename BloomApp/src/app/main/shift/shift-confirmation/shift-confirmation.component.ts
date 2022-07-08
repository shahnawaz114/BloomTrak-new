import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { shift, User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';
import {Location} from '@angular/common';
@Component({
  selector: 'app-shift-confirmation',
  templateUrl: './shift-confirmation.component.html',
  styleUrls: ['./shift-confirmation.component.scss']
})
export class ShiftConfirmationComponent implements OnInit {
  public rows: any
  public page = new Page();
  public contentHeader: object;
  user = new shift();
  blankArray: any[] = [];
  mngmCommunity: any[] = [];
  btnShow: boolean;
  submit: boolean = false
  todaysDate: any;
  shiftDates: boolean = false;
  
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'value',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    closeDropDownOnSelection: true,
    allowSearchFilter: true
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
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  dropdownSettings3: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'community_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    closeDropDownOnSelection: true,
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

  pickupSteps = {
    pickuploaction: null,
    pickedSpot: null,
    pickedCity: null,
    pickedCityId: '',
    latitude: '',
    longitude: '',
    availableLocs: [],
    picupDateTime: null,
    dropoffDateTime: null,
    currentStep: 1,
  }


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
  data: any;
  currentUser: User;
  minDate: string;
  date1: Date;
  srtDt: any = []
  endDt: any = []
  allCommunity: any = [];
  department: any = [{name:'Activities',value:'Activities'},{name:'Business Office',value:'Business Office'},{name:'Dining',value:'Dining'},{name:'Environmental Services',value:'Environmental Services'},{name:'Health & Wellness',value:'Health & Wellness'},{name:'Housekeeping',value:'Housekeeping'},{name:'Laundry',value:'Laundry'}]
  position: any = [{name:'Concierge',value:'Concierge'},{name:'Cook',value:'Cook'},{name:'Dining Concierge',value:'Dining Concierge'},{name:'Direct Care Aide',value:'Direct Care Aide'},{name:'Dishwasher/Dining Aide',value:'Dishwasher/Dining Aide'},{name:'Housekeeper',value:'Housekeeper'},{name:'Laundry Aide',value:'Laundry Aide'},{name:'Maintenance Assistant',value:'Maintenance Assistant'},{name:'Registered Medication Aide/AMAP',value:'Registered Medication Aide/AMAP'},{name:'Shift Supervisor',value:'Shift Supervisor'}]
  certification: any = [{name:'Direct Care Aide',value:'Direct Care Aide'},{name:'Licensed Practical Nurse',value:'Licensed Practical Nurse'},{name:'Registered Medication Aide',value:'Registered Medication Aide'},{name:'Registered Nurse',value:'Registered Nurse'},{name:'Serve Safe Certified'}]
  srtDt1: any;
  srtDt2: any;
  enDt: any;
  enDt2: any;
  hours: number;
  rows1: any =[]
  searchStr: string;
  page1: string;
  page2: number;
  delay: number;
  chngCommntyList: any =[]

  constructor(
    private tost: ToastrManager,
    private api: UserService,
    private rout: Router,
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private location : Location
  ) {
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
      }
      );
  }

 
  ngOnInit(): void {
   this.getData();
   this.getCommunityId()
    let today = new Date();
    // this.todaysDate = { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() };
    // this.todaysDate = this.todaysDate.year  + '-' +  this.todaysDate.month +'-' +   this.todaysDate.day
    this.user = new shift()
    //  this.user.start_date =  this.todaysDate
    console.log(this.todaysDate)
    this.user.h_m = 'Hours';
    this.todaysDate = this.getDate(today)
    this.blankArray.push(this.user)
    this.contentHeader = {
      headerTitle: 'Add Shift ',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Shift ',
            isLink: true,
            link: '/shift'
          }
        ]
      }
    };

  }

 
  getData()
  {
    this.dataService.getMNMGcommunity(this.searchStr = '', this.page1 = '0', this.page2 = 10).subscribe(res => {
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


  getTm1(e) {
    this.srtDt = e
   this.getDrton()
  }
  getTm2(e) {
    this.srtDt2 = e
   this.getDrton()
  }
  getTm3(e) {
    this.enDt = e
   this.getDrton()
  }
  getTm4(e) {
    this.enDt2 = e
   this.getDrton()
  }

  getDrton(){
    for (let x = 0; x < this.blankArray.length; x++) {
      let timeStart = new Date(this.srtDt + ' ' + this.srtDt2).getTime();
      let timeEnd = new Date(this.enDt + ' ' + this.enDt2).getTime();
      let hourDiff = timeEnd - timeStart; //in ms
      // let secDiff = hourDiff / 1000;
      let minDiff = hourDiff / 60 / 1000; //in minutes
      let hDiff = hourDiff / 3600 / 1000; //in hours
      let hours = Math.floor(hDiff);
     let minutes = minDiff - 60 * hours;
     if(!isNaN(hours) && !isNaN(minutes)){
         this.blankArray[x].duration = hours + ' hour and ' + minutes + ' minutes.'
     }
    }
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
    this.allCommunity = [].concat(this.allCommunity);

  }

  submitted() {
    this.data = [];
    for (let x = 0; x < this.blankArray.length; x++) {
      this.blankArray[x].shift = 'confirmation'

      if (!this.blankArray[x].is_urgent || !this.blankArray[x].for_cp 
        || !this.blankArray[x].delay
        || !this.blankArray[x].h_m || !this.blankArray[x].startTime
        || !this.blankArray[x].endTime
      ) {
        this.submit = true
        this.tost.errorToastr('Form is invalid')
        return;
      }
      // if(this.blankArray[x].startTime.getTime() < this.blankArray[x].endTime.getTime() ){
      //   this.tost.errorToastr('End time is greater then start time')
      //   return;
      // }
      this.data.push({
        // title: this.blankArray[x].title,
        description: this.blankArray[x].description,
        certification: this.blankArray[x].certification,
        shift: this.blankArray[x].shift,
        is_urgent: this.blankArray[x].is_urgent,
        delay: this.blankArray[x].delay,
        for_cp: this.blankArray[x].for_cp,
        h_m: this.blankArray[x].h_m,
        department: this.blankArray[x].department,
        position: this.blankArray[x].position,
        // community: this.blankArray[x].community,
        start_time: this.cnvrtnewDt(this.blankArray[x].start_date + ' ' + this.blankArray[x].startTime),
        end_time: this.cnvrtnewDt(this.blankArray[x].end_date + ' ' + this.blankArray[x].endTime),
        community_id: this.currentUser.role == 'Admin' ? this.blankArray[x].community : this.currentUser.id
      })
    }
    console.log(this.data)
    let date1 = moment(new Date(this.data[0].start_time)).utc().unix()
    let date2 = moment(new Date(this.data[0].end_time)).utc().unix()
    if (date1 > date2) {
      this.tost.errorToastr('End date and time is greater then start date and time')
      return
    }
    this.api.addshift(this.data).subscribe((res) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.rows1 = []
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
    this.rout.navigate(['/shift'])
  }

  addForm() {
    for (let x = 0; x < this.blankArray.length; x++) {
      if (!this.blankArray[x].is_urgent || !this.blankArray[x].for_cp ||
        !this.blankArray[x].description
        || !this.blankArray[x].delay 
        || !this.blankArray[x].h_m || !this.blankArray[x].startTime
        || !this.blankArray[x].endTime
      ) {
        this.tost.errorToastr('Form is invalid')
        this.rows1 = []
        return;
      }
    }
    this.user = new shift()
    this.user.h_m = 'Hours';
    this.blankArray.push(this.user);
    console.log(this.blankArray)
    this.enDt2 = ''
    this.enDt = ''
    this.srtDt = '' 
      this.srtDt2 = ''
      this.rows1 = []


  }

  // setPickupDateTime() {
  //   for (let x = 0; x < this.blankArray.length; x++) {
  //     if (!this.blankArray[x].startTime) {
  //       this.blankArray[x].startTime = this.getCurrentHours();
  //     }
  //     let dt = new Date()
  //     let selectedDate = new Date(this.blankArray[x].start_date.year, this.blankArray[x].start_date.month - 1, this.blankArray[x].start_date.day);
  //     if (selectedDate.setHours(0, 0, 0, 0) == dt.setHours(0, 0, 0, 0)) {
  //       if (!this.shiftDates) {
  //         for (let i = 1; i <= 3; i++) {
  //           this.timeslots.shift();
  //         }
  //         this.shiftDates = true;
  //       }
  //     }

  //     // let dt = new Date()
  //     // this.blankArray[x].start_date = { day: dt.getDate(), month: dt.getMonth() + 1, year: dt.getFullYear() }
  //     //   this.blankArray[x].start_date = this.getCurrentHours();
  //     // let selectedDate = new Date(this.blankArray[x].start_date.year, this.blankArray[x].start_date.month - 1, this.blankArray[x].start_date.day);
  //     // if (selectedDate.setHours(0, 0, 0, 0) == dt.setHours(0, 0, 0, 0)) {
  //     //   if (!this.shiftDates) {
  //     //     for (let i = 1; i <= 3; i++) {
  //     //       this.timeslots.shift();
  //     //     }
  //     //     this.shiftDates = true;
  //     //   }
  //     // }
  //     else {
  //       this.shiftDates = false;
  //       this.timeslots = [
  //         { value: { hour: 0, minute: 0 }, label: '00:00', },
  //         { value: { hour: 0, minute: 30 }, label: '00:30', },
  //         { value: { hour: 1, minute: 0 }, label: '01:00', },
  //         { value: { hour: 1, minute: 30 }, label: '01:30', },
  //         { value: { hour: 2, minute: 0 }, label: '02:00', },
  //         { value: { hour: 2, minute: 30 }, label: '02:30', },
  //         { value: { hour: 3, minute: 0 }, label: '03:00', },
  //         { value: { hour: 3, minute: 30 }, label: '03:30', },
  //         { value: { hour: 4, minute: 0 }, label: '04:00', },
  //         { value: { hour: 4, minute: 30 }, label: '04:30', },
  //         { value: { hour: 5, minute: 0 }, label: '05:00', },
  //         { value: { hour: 5, minute: 30 }, label: '05:30', },
  //         { value: { hour: 6, minute: 0 }, label: '06:00', },
  //         { value: { hour: 6, minute: 30 }, label: '06:30', },
  //         { value: { hour: 7, minute: 0 }, label: '07:00', },
  //         { value: { hour: 7, minute: 30 }, label: '07:30', },
  //         { value: { hour: 8, minute: 0 }, label: '08:00', },
  //         { value: { hour: 8, minute: 30 }, label: '08:30', },
  //         { value: { hour: 9, minute: 0 }, label: '09:00', },
  //         { value: { hour: 9, minute: 30 }, label: '09:30', },
  //         { value: { hour: 10, minute: 0 }, label: '10:00', },
  //         { value: { hour: 10, minute: 30 }, label: '10:30', },
  //         { value: { hour: 11, minute: 0 }, label: '11:00', },
  //         { value: { hour: 11, minute: 30 }, label: '11:30', },
  //         { value: { hour: 12, minute: 0 }, label: '12:00', },
  //         { value: { hour: 12, minute: 30 }, label: '12:30', },
  //         { value: { hour: 13, minute: 0 }, label: '13:00', },
  //         { value: { hour: 13, minute: 30 }, label: '13:30', },
  //         { value: { hour: 14, minute: 0 }, label: '14:00', },
  //         { value: { hour: 14, minute: 30 }, label: '14:30', },
  //         { value: { hour: 15, minute: 0 }, label: '15:00', },
  //         { value: { hour: 15, minute: 30 }, label: '15:30', },
  //         { value: { hour: 16, minute: 0 }, label: '16:00', },
  //         { value: { hour: 16, minute: 30 }, label: '16:30', },
  //         { value: { hour: 17, minute: 0 }, label: '17:00', },
  //         { value: { hour: 17, minute: 30 }, label: '17:30', },
  //         { value: { hour: 18, minute: 0 }, label: '18:00', },
  //         { value: { hour: 18, minute: 30 }, label: '18:30', },
  //         { value: { hour: 19, minute: 0 }, label: '19:00' },
  //         { value: { hour: 19, minute: 30 }, label: '19:30' },
  //         { value: { hour: 20, minute: 0 }, label: '20:00' },
  //         { value: { hour: 20, minute: 30 }, label: '20:30' },
  //         { value: { hour: 21, minute: 0 }, label: '21:00' },
  //         { value: { hour: 21, minute: 30 }, label: '21:30' },
  //         { value: { hour: 22, minute: 0 }, label: '22:00' },
  //         { value: { hour: 22, minute: 30 }, label: '22:30' },
  //         { value: { hour: 23, minute: 0 }, label: '23:00' },
  //         { value: { hour: 23, minute: 30 }, label: '23:30' },
  //         { value: { hour: 24, minute: 0 }, label: '24:00' },
  //       ];
  //     }
  //   }
  // }

  getCurrentHours() {
    for (let x = 0; x < this.blankArray.length; x++) {

      let now = new Date();
      let ch = now.getHours();
      if (ch >= 22) {
        return this.timeslots[this.timeslots.length - 1].label;
      } else if (ch < 10) {
        return this.timeslots[x].label;
      } else {
        let hous = this.timeslots.findIndex(item => item.value.hour == ch);
        if (now.getMinutes() > 30) {
          return this.timeslots[hous + 2].label;
        } else {
          return this.timeslots[hous + 1].label;
        }
      }
    }
  }

  // setDropOffDateTime(addtwo = false) {
  //   for (let x = 0; x < this.blankArray.length; x++) {

  //     if (!this.blankArray[x].endDate) {
  //       let now = new Date();
  //       this.blankArray[x].endDate = { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() }
  //       this.blankArray[x].endDate = this.getCurrentHours();
  //       this.pickupSteps.picupDateTime = new Date(this.blankArray[x].endDate.year, this.blankArray[x].endDate.month - 1, this.blankArray[x].endDate.day);
  //     }
  //     if (!this.blankArray[x].endTime) {
  //       this.blankArray[x].endTime = this.getCurrentHours();
  //       this.pickupSteps.dropoffDateTime = new Date(this.blankArray[x].endDate.year, this.blankArray[x].endDate.month - 1, this.blankArray[x].endDate.day)
  //     }
  //   }

  // }

  removeCard(i) {
    this.blankArray.splice(i)
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

  cnvrtnewDt(date_tm) {
    return new Date(date_tm)
  }

  goBack(){
    this.location.back();
  }
}
