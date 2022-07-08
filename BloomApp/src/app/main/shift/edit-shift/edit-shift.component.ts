// import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { shift } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-edit-shift',
  templateUrl: './edit-shift.component.html',
  styleUrls: ['./edit-shift.component.scss']
})
export class EditShiftComponent implements OnInit {
  searchSub: any = null;
  public page = new Page();
  loadingList: boolean;
  searchStr: string = '';
  public rows: any = [];
  todaysDate: any;
  btnShow: boolean = false;
  mngmCommunity: any = [];
  allCommunity: any = [];
  currenUserId: any = ''
  public currentUser: any;
  minDate: any;
  approvedHide: boolean = false;

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
  formArray: any[] = [];


  public contentHeader: object;

  shiftId: any;
  h_m: string;
  end_time: any;
  start_time: any;
  endTime: any;
  startTime: any;
  created_at: any;
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
  community_name: any;
  position: any = [];
  cmntId: any;
  hideTbl :boolean = false;
  chngCommntyList: any =[]
  data: any;
  rows1: any[];
  submit:any;
  dt_tm: any = []
  dt_tm1: any = []
  user = new shift();
  shiftType: any = '';
  prmsUsrId: any;


  constructor(
    private tost: ToastrManager,
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private aCtRoute : ActivatedRoute,
    private loct  : Location
    // private date: DatePipe
  ) { 
    this._authenticationService.currentUser.subscribe
    (x => {
      this.currentUser = x
      console.log(x)
    }
    );

    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res
          this.EditShift(this.prmsUsrId)
      }
    )
  }

  ngOnInit(): void {
    this.getData()
    setTimeout(() => {
      this.delay = this.shiftId.delay
    }, 1000);
    this.getCommunityId()
    let today = new Date();
    this.user = new shift()
    console.log(this.todaysDate)
    this.user.h_m = 'Hours';
    console.log(this.currentUser)

    this.contentHeader = {
      headerTitle: 'Edit Shift',
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
            name: 'Shift',
            isLink: true,
            link: '/shift'
          }
        ]
      }
    };
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


  EditShift(row: any) {
    this.shiftId = row
    this.shiftID = row.id
    this.cmntId = row.community_id
    this.formArray = [];
    let sd = moment.unix(this.shiftId?.start_time).format("YYYY-MM-DD hh:mm")
    let ed = moment.unix(this.shiftId?.end_time).format("YYYY-MM-DD hh:mm")
    this.dt_tm = ed.split(" ");
    this.dt_tm1 = sd.split(" ");

    this.end_time = this.dt_tm[0]
    this.start_time = this.dt_tm1[0]
    this.endTime = this.dt_tm[1]
    this.startTime = this.dt_tm1[1]
    this.created_at = moment(this.shiftID.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a");
    this.h_m = this.shiftId.h_m;
    this.description = this.shiftId.description
    // let departmentArr = this.departmentVal.filter(d => d.name === this.shiftId.department);
    // let positionArr = this.positionVal.filter(p => p.name === this.shiftId.positions);
    // let certificationArr = this.certificationVal.filter(c => c.name === this.shiftId.certification);
    this.department = this.shiftId.department
    this.position = this.shiftId.positions
    this.certification = this.shiftId.certification
    this.is_urgent = this.shiftId.is_urgent
    // let delayArr = this.Hours.filter(d => d.hour == this.shiftId.delay);
    this.delay = this.shiftId.delay
    this.for_cp = this.shiftId.for_cp
    this.community_name = this.shiftId.community_name
    let cmntyName = this.currentUser.role == 'Admin' ? this.mngmCommunity.filter(c => c.community_name === this.shiftId.community_name) : this.allCommunity.filter(c => c.community_name === this.shiftId.community_name) ;
    this.community = cmntyName
  }

  addForm() {
    if (!this.is_urgent || !this.for_cp || !this.description
      || !this.delay || !this.h_m || !this.start_time
      || !this.end_time || !this.certification
      || !this.position || !this.department
    ) {
      this.tost.errorToastr('Edit is invalid')
      return;
    }
    let date1 = moment(new Date(this.start_time + ' ' + this.startTime)).utc().unix()
    let date2 = moment(new Date(this.end_time + ' ' + this.endTime)).utc().unix()
    if (date1 >= date2) {
      this.tost.errorToastr('End date and time is greater then start date and time')
      return;
    }
    this.data = {
      department: this.department,
      description: this.description,
      position: this.position,
      certification: this.certification,
      shift: 'Confirmation',
      is_urgent: this.is_urgent,
      delay: this.delay,
      for_cp: this.for_cp,
      h_m: this.h_m,
      start_time: this.cnvrtnewDt(this.start_time + ' ' + this.startTime),
      end_time: this.cnvrtnewDt(this.end_time + ' ' + this.endTime),
      // community: this.currentUser.role == 'Community' ? this.currenUserId :  this.community,
      community_id: this.currentUser.role == 'Admin' ? this.community : this.currentUser.id,
      // community_id: this.community,
      id: this.shiftID,
      // community: this.currentUser.role == 'Community' ? this.currenUserId : this.currentUser.role == 'SuperAdmin' ? this.currenUserId : this.community
    }
    this.dataService.editshift(this.data).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.rows1 = []
        this.loct.back()
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
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

  cnvrtnewDt(date_tm) {
    return new Date(date_tm)
  }
  
}
