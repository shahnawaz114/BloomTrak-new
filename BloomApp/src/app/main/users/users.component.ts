import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Patterns } from 'app/auth/helpers/patterns';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('tablesss') tablesss: ElementRef<any>;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  @ViewChild('deleteUser') deleteUser: ElementRef<any>;
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
  tempCmntyId: any;
  drpForm!: FormGroup;
  Primary!: FormGroup;
  Servey!: FormGroup;
  radioData!: FormGroup;
  managementServey!: FormGroup;
  btnShow: boolean = false;
  activeTab: number = 1;
  id: any;
  userid: any;
  getMangemntId_names: any = []
  manag: any = []
  radiodata: any;
  currentUserDtls: any;
  
  constructor(
    private _authenticationService: AuthenticationService,
    private encryptionService: EncryptionService,
    private modalService: NgbModal,
    private dataService: DataService,
    private toastr: ToastrManager,
    private fb: FormBuilder,
    private rout: Router,
  ) {
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUserDtls = x.role
      this.currentUser = x
      console.log(this.currentUser)
    });
  }

  ngOnInit(): void {
    this.getMangemntId_name()
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

   

    // this.Primary = this.fb.group({
    //   primary_contact_firstname: ['', Validators.required],
    //   primary_contact_lastname: ['', Validators.required],
    //   primary_contact_title: ['', Validators.required],
    //   primary_contact_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
    //   primary_contact_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
    // })



    this.Servey = this.fb.group({
      survey_compliance_name: ['', Validators.required],
      survey_compliance_title: ['', Validators.required],
      survey_compliance_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      survey_compliance_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
    })

    this.managementServey = this.fb.group({
      mg_name: ['', Validators.required],
      mg_title: ['', Validators.required],
      mg_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      mg_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      contact_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      contact_person: ['', Validators.required],
      contact_person_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
      // approval: ['1'],
      // management_company_name: ['', Validators.required],
      // management_company_address1: ['', Validators.required],
      // management_company_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      // management_company_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      // management_company_contact_person: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      id: this.id ? this.id : ''
    })

    this.radioData = this.fb.group({
      single_community: ['', [Validators.required]],
    })

    this.drpForm = this.fb.group({
      management_id: ['', [Validators.required]],
    })
  }

  getMangemntId_name() {
    this.dataService.getManagementNames().subscribe(res => {
      if (!res.error) {
        this.getMangemntId_names = res.body
      } else {
        this._authenticationService.errorToaster(res);
      }
      this.deletingUser = false;
    }, error => {
      this.toastr.errorToastr('Oops! something went wrong, while deleting User, please try again.');
      this.deletingUser = false;
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
    let itemenc = this.encryptionService.encode(JSON.stringify(data))
    this.loadingList = true;
    if (this.currentUser.role == 'Admin') {
      this.getMNMGcommunity()
    } else  {
      this.searchSub = this.dataService.getcommunity(this.searchStr, this.page.pageNumber, this.page.size).subscribe(
        res => {
          if (!res.error) {
            this.rows = res.body;
            //  this.rows.map(rw => {
            //          if (rw.single_community == '0') {
            //            rw.phone = 'Single'
            //          }
            //        })
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
  }

  deletesUser(modal) {
    if (this.currentUser) {
      let data = { id: this.currentUser.id };
      let enc = this.encryptionService.encode(JSON.stringify(data));
      this.deletingUser = true;
      this.dataService.deleteUser(data).subscribe(res => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          if (this.currentUserDtls == 'Admin') {
            this.getMNMGcommunity()
            this.closed(modal);
          }else{
            this.rows = [];
            this.closed(modal);
            this.setPage({ offset: 0 });
          }
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
    this.currentUser = item;
    this.modalOpenOSE(this.deleteUser, 'lg');
  }

  openAddcommunity() {
    // this.formData.reset();
    // this.Primary.reset();
    // this.Servey.reset();
    // this.managementServey.reset();
    // this.radioData.reset();
    // this.activeTab = 1;
    this.modalOpenOSE(this.addUsers, 'lg');
  }

  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }

  closeAddCommunity(modal: NgbModalRef) {
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
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
  }

  get sc() {
    return this.Servey.controls;
  }
  get mt() {
    return this.drpForm.controls;
  }

  get pControls() {
    return this.Primary.controls
  }

  primarySubmit(modal) {
    for (let item of Object.keys(this.pControls)) {
      this.pControls[item].markAsDirty()
    }
    if (this.Primary.invalid) {
      return;
    }
    else {
      // let data = { ...this.Primary.value, ...{ id: this.tempCmntyId } }
      this.btnShow = true;
      let body1 = {
        primary_contact_firstname: this.Primary.value.primary_contact_firstname,
        primary_contact_lastname: this.Primary.value.primary_contact_lastname,
        primary_contact_title: this.Primary.value.primary_contact_title,
        primary_contact_phone: this.Primary.value.primary_contact_phone.replace(/\D/g, ''),
        primary_contact_email: this.Primary.value.primary_contact_email,
        id: this.tempCmntyId ? this.tempCmntyId : ''
      }

      this.dataService.updatePrimaryContact(body1).subscribe((res: any) => {
        if (!res.error) {
          this.closeded(modal)
          setTimeout(() => {
            if(this.currentUser.role =='Admin'){
              this.dataService.updateSinleCOm({single_community:this.radioData.value.single_community = '1',...{id:this.tempCmntyId}}).subscribe((res:any)=>{
                console.log(res)
              })
              this.dataService.updateManagementId({management_id:this.currentUser._id,...{id:this.tempCmntyId} }).subscribe((res:any)=>{
                console.log(res)
              })
             this.btnShow = false;
            }
          }, 500);
          
          this.btnShow = false;
            if (this.currentUser.role == 'Admin') {
              this.getMNMGcommunity()
            }
          // this.toastr.successToastr(res.msg);
        this.setPage({ offset: 0 });
          this.activeTab = 3
        }
      }, (err: any) => {
        this.btnShow = false;
        this.activeTab = 2
        this.dataService.genericErrorToaster()
      })
    }
  }

  // serveySubmit() {
  //   for (let item of Object.keys(this.sc)) {
  //     this.sc[item].markAsDirty()
  //   }
  //   if (this.Servey.invalid) {
  //     return;
  //   }
  //   this.btnShow = true;
  //   let body1={
  //     survey_compliance_name: this.Servey.value.survey_compliance_name,
  //     survey_compliance_title: this.Servey.value.survey_compliance_title,
  //     survey_compliance_phone: this.Servey.value.survey_compliance_phone.replace(/\D/g, ''),
  //     survey_compliance_email: this.Servey.value.survey_compliance_email,
  //      id: this.tempCmntyId ? this.tempCmntyId : ''

  //   }
  //   let data = { ...this.Servey.value, ...{ id: this.tempCmntyId } }
  //   this.dataService.updateSurveyCompliance(body1).subscribe((res: any) => {
  //     if (!res.error) {
  //       this.btnShow = false;
  //       this.toastr.successToastr(res.msg);
  //       this.activeTab = 4
  //     }
  //   },
  //     (err: any) => {
  //       this.btnShow = false;
  //       this.activeTab = 3
  //       this.dataService.genericErrorToaster()
  //     })
  // }

  get mc() {
    return this.managementServey.controls
  }

  managementSubmit(modal: NgbModalRef) {
    for (let item of Object.keys(this.mc)) {
      this.mc[item].markAsDirty()
    }
    if (this.managementServey.invalid) {

      return;
    }
    this.btnShow = true;
    this.dataService.addManagement({ ...this.managementServey.value, ...{ for_community: '1' }, ...{ id: this.tempCmntyId } }).subscribe((res: any) => {
      if (!res.error) {
        this.setPage({ offset: 0 });
        this.toastr.successToastr(res.msg)
        this.closeded(modal)
        // this.activeTab = 5;
        this.btnShow = false;
      } else {
        this.btnShow = false;
        this.toastr.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster();
        this.activeTab = 3

      })

    // for (let item of Object.keys(this.mc)) {
    //   this.mc[item].markAsDirty()
    // }
    // if (this.managementServey.invalid) {
    //   return;
    // }
    // let data = { ...this.managementServey.value, ...{ id: this.tempCmntyId } }
    // this.btnShow = true;
    // let body1={
    //   management_company_name: this.managementServey.value.management_company_name,
    //   management_company_address1: this.managementServey.value.management_company_address1,
    //   management_company_phone: this.managementServey.value.management_company_phone.replace(/\D/g, ''),
    //   management_company_email: this.managementServey.value.management_company_email,
    //   management_company_contact_person: this.managementServey.value.management_company_contact_person.replace(/\D/g, ''),
    //   id: this.tempCmntyId ? this.tempCmntyId : ''

    // }
    // this.dataService.updateManagementCompany(body1).subscribe((res: any) => {
    //   if (!res.error) {
    //     this.btnShow = false;
    //     this.toastr.successToastr(res.msg);
    //     this.activeTab = 5;
    //     this.closeded(modal)        
    //     this.setPage({ offset: 0 })
    //   }

    // },
    //   (err: any) => {
    //     this.btnShow = false;
    //     this.dataService.genericErrorToaster()
    //     this.activeTab = 3
    //   })

  }
  get rc() {
    return this.radioData.controls
  }

  radioData1(modal) {
    for (let item of Object.keys(this.rc)) {
      this.rc[item].markAsDirty()
    }
    if (this.radioData.invalid) {
      return;
    }
    let data = { ...this.radioData.value, ...{ id: this.tempCmntyId } }
    this.btnShow = true;
    this.dataService.updateSinleCOm(data).subscribe((res: any) => {
      if (!res.error) {
        this.btnShow = false;
        this.toastr.successToastr(res.msg);
        if (this.radioData.value.single_community == 0) {
          this.toastr.successToastr(res.msg);
          this.closeded(modal)
          // this.setPage({ offset: 0 })
          // this.activeTab = 5
        } else {
          this.activeTab = 5 //if Management is selected than move to last tab.
        }
      }
    },
      (err: any) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster()
        this.activeTab = 3
      })
  }
  radio(value) {
    this.radiodata = value;
  }
  get dp() {
    return this.drpForm.controls
  }

  drpForm1(modal) {
    console.log(this.drpForm.value.management_id)
    for (let item of Object.keys(this.dp)) {
      this.dp[item].markAsDirty()
    }
    if (this.drpForm.invalid) {
      return;
    }
    // this.drpForm.value.management_id.forEach(element => {
    //   this.manag.push(element.id)
    // });
    let data = { id: this.tempCmntyId, management_id: this.drpForm.value.management_id[0].id }
    this.dataService.updateManagementId(data).subscribe((res: any) => {
      if (!res.error) {
        this.btnShow = false;
        this.toastr.successToastr(res.msg);
        this.closeded(modal)
        this.setPage({ offset: 0 })
      }
    },
      (err: any) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster()
        this.activeTab = 3
      })
  }

  getMNMGcommunity() {
    this.dataService.getMNMGcommunity(this.searchStr, this.page.pageNumber, this.page.size).subscribe((res: any) => {
      if (!res.error) {
        console.log(res)
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
