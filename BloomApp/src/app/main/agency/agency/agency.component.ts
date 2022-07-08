import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { Role } from 'app/auth/models';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent implements OnInit {

  @ViewChild('tablesss') tablesss: ElementRef<any>;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  @ViewChild('deleteActivity') deleteActivity: ElementRef<any>;
  @ViewChild('addUsers') addUsers: ElementRef<any>;


  public page = new Page();
  public rows = [];
  loadingList: boolean;
  searchStr: string = '';
  searchSub: any = null;
  currentUser: any;
  deletingUser: boolean;
  delUser: boolean;
  startFrom = 0;
  Limit = 10;
  totalNumber: any = 0;

  addCommuniti: boolean;
  active = 1;
  tempAddId: any;

  // Primary!: FormGroup;
  // Servey!: FormGroup;
  // radioData!: FormGroup;
  // managementServey!: FormGroup;
  btnShow: boolean = false;

  activeTab: number = 1;
  // community_id: any;
  id: any;
  userid: any;
  allCommunity: any = [];
  currentUser1: any;
  approvedHide: boolean = false;



  constructor(
    private _authenticationService: AuthenticationService,
    private encryptionService: EncryptionService,
    private modalService: NgbModal,
    private dataService: DataService,
    private toastr: ToastrManager,
  ) {
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      console.log(x)
    })
  }

  ngOnInit(): void {
    this.getCommunityId();
    this.setPage({ offset: 0 });

    fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.setPage({ offset: 0 })
    });

  
  }

  setPage(pageInfo) {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
    this.page.pageNumber = pageInfo.offset;
    let data = {
      pageNo: this.page.pageNumber,
      limitNum: this.page.size,
    };
    this.loadingList = true;
    let community_id = (this.currentUser.role == Role.Community) ? this.currentUser.id : null;
    let is_for= this.currentUser.role == 'Community' ? 'community' : 'superadmin';
    this.searchSub = this.dataService.getAgency(this.searchStr, this.page.pageNumber, this.page.size, community_id,is_for).subscribe(
      res => {
        if (!res.error) {
          this.rows = res.body;
          this.rows.forEach(i => {
            if (i.approval == 1) {
              i.approval = 'Approved'
              i.approvedHide = false
            } else if (i.approval != 1) {
              i.approval = 'Pending'
              i.approvedHide = true
            }

          })
          if (!res.pagination) {
            this.page.size = res.body.length;
            this.page.totalElements = res.body.length;
            this.page.pageNumber = res.body.pageNumber;
            this.page.totalPages = res.body.totalPages;

          }
          else {
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

  deletesUser(modal) {
    console.log(this.currentUser)
    if (this.currentUser1) {
      let data = { id: this.currentUser1.id };
      let enc = this.encryptionService.encode(JSON.stringify(data));
      this.deletingUser = true;
      this.dataService.deleteActivity(data).subscribe(res => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.rows = [];
          this.setPage({ offset: 0 });
          this.closed(modal);
        } else {
          this._authenticationService.errorToaster(res);
        }
        this.deletingUser = false;
      }, error => {
        this.toastr.errorToastr('Oops! something went wrong, while deleting User, please try again.');
        this.deletingUser = false;
      });
    }
  }

  openDeleteUser(item) {
    this.currentUser1 = item;
    this.modalOpenOSE(this.deleteActivity, 'lg');
  }

  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }

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
    modal.dismiss();
    this.currentUser1 = null;
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
  }
  
  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  giveApproval(row) {
    this.dataService.updateAprroval({ ...{ id: row.id } }).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
        this.setPage({ offset: 0 })
      } else {
        this._authenticationService.errorToaster(res);
      }
      this.deletingUser = false;
    }, error => {
      this.toastr.errorToastr('Oops! something went wrong, while deleting User, please try again.');
      this.deletingUser = false;
    });
  }

}
