import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { User } from 'app/auth/models/user';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import moment from 'moment';

@Component({
  selector: 'app-shared-calender',
  templateUrl: './shared-calender.component.html',
  styleUrls: ['./shared-calender.component.scss']
})
export class SharedCalenderComponent implements OnInit {
  calendarOptions: CalendarOptions;
  public currentUser: User;
  searchStr: string = '';
  public page = new Page();
  public contentHeader: object;
  minDate: string;
  status: any;
  positions: any;
  EventS: any = [];
  start: any;
  end: any;

  constructor(
    private dataService: DataService,
    private _authenticationService: AuthenticationService) {
    this.currentUser = this._authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Shift Calender ',
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
            name: 'Shift List ',
            isLink: true,
            link: '/shift'
          }
        ]
      }
    };
    this.getCalDetail()
    console.log(this.EventS)
    setTimeout(() => {

      let clc: any = document.querySelector(".fc-dayGridMonth-button.fc-button.fc-button-primary.fc-button-active")
      clc.click();
    }, 500);

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      eventClick: (e) => this.handleEventOnClick(e),
      height: 500,
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
      },
      buttonText: {
        month: 'Month',
        week: 'week',
      },

      events: this.EventS[0]
    };
  }

  handleEventOnClick(arg) {
    // console.log(arg)
  }
  getCalDetail() {
    this.EventS = []
    if (this.currentUser.role == 'Community') {
      let currentUser1 = this.currentUser.id;
      let usetype = ''
      let pageNO = '0'
      let limit = '10'
      this.dataService.getCommunityShifts(this.searchStr = '', pageNO, usetype, currentUser1, limit).subscribe((res: any) => {
        for (let i = 0; i < res.body.length; i++) {
          console.log(res)
          if (!res.error) {
            // this.start = res.body[0].start_time
            this.start = moment.unix(res.body[i].start_time).format("YYYY-MM-DD HH:mm:ss")
            this.end = moment.unix(res.body[i].end_time).format("YYYY-MM-DD HH:mm:ss")
            this.status = res.body[i].status;
            this.positions = res.body[i].positions;
            console.log(typeof this.start, this.end)

            this.EventS.push({
              title: this.status == 0 ? '(Pending) ' + this.positions : this.status == 1 ? '(Started) ' + this.positions : this.status == 2 ? '(Completed) ' + this.positions : '(Onhold)' + this.positions,
              start: this.start,
              end: this.end,
              status: this.status,
              color: this.status == 0 ? 'orange' : this.status == 1 ? 'green' : this.status == 2 ? 'blue' : 'red'
            })

            this.calendarOptions.events = this.EventS
          }

        }
      },
        (err) => {
          this.dataService.genericErrorToaster()
        })
    }
    else {
      this.EventS = []
      let usetype = ''
      this.page.size = 10
      let userShifts = ''
      this.dataService.getshift(this.searchStr = '', usetype, this.page.size,userShifts).subscribe((res: any) => {
        for (let i = 0; i < res.body.length; i++) {
          console.log(res)
          if (!res.error) {
            // this.start = res.body[0].start_time
            this.start = moment.unix(res.body[i].start_time).format("YYYY-MM-DD HH:mm:ss")
            this.end = moment.unix(res.body[i].end_time).format("YYYY-MM-DD HH:mm:ss")
            this.status = res.body[i].status;
            this.positions = res.body[i].positions;
            console.log(typeof this.start, this.end)

            this.EventS.push({
              title: this.positions,
              start: this.start,
              end: this.end,
              status: this.status,
              color: this.status == 0 ? 'orange' : this.status == 1 ? 'blue' : this.status == 2 ? 'green' : 'red'
            })

            this.calendarOptions.events = this.EventS
          }
        }
      },
        (err) => {
          this.dataService.genericErrorToaster()
        })
    }
  }
}
