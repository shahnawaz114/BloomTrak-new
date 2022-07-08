import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService, UserService, CountriesService } from 'app/auth/service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { ToastrManager } from 'ng6-toastr-notifications';
// import jspdf from 'jspdf';
import { TranslateService } from '@ngx-translate/core';
import { MyAccountService } from './my-account.service';
import { DataService } from 'app/auth/service/data.service';
import { ActivatedRoute } from '@angular/router';

import { Patterns } from 'app/auth/helpers/patterns';
import { MustMatch } from 'app/auth/helpers';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Location } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('enable2fa') enable2fa: ElementRef<any>;
  @ViewChild('disable2fa') disable2fa: ElementRef<any>;
  @ViewChild('antiPhishingModal') antiPhishingModal: ElementRef<any>;
  @ViewChild('file', { static: false }) fileupload: ElementRef;
  public contentHeader: object;
  public updatePersonalInfo: FormGroup;
  public data: any;
  public subsAll: any[] = [];
  public currentUser: User;
  public dob: NgbDateStruct;
  loading: boolean;
  error: any;
  success: any;
  file: File;
  isLoading: boolean;
  logLoading: boolean;
  logs: any[] = [];
  curComDetails: any;
  comunityId: any;
  uptingVerification: boolean;
  selectedImageIndex = 0;
  showFlag: boolean;
  imageObject: any[] = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'mg_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };


  formData!: FormGroup;
  Primary!: FormGroup;
  Servey!: FormGroup;
  radioData!: FormGroup;
  managementServey!: FormGroup;
  id: any;
  btnShow: boolean = false;
  tempCmntyId: any;
  activeTab: number = 0;
  userid: any;

  confirmForm!: FormGroup;
  drpForm!: FormGroup;
  getMangemntId_names: any =[]
  manag: any =[]

  tabChanged(ev:any) {
    this.activeTab = ev.nextId.replace('ngb-nav-','');
    if(this.activeTab == 1) {
      setTimeout(() => {
        this.Primary.get('primary_contact_phone').setValue(this.Primary.value.primary_contact_phone);
      }, 100)
    // } else if(this.activeTab == 2) {
    //   setTimeout(() => {
    //     this.Servey.get('survey_compliance_phone').setValue(this.Servey.value.survey_compliance_phone);
    //   }, 100)
    // } else if(this.activeTab == 3) {
      setTimeout(() => {
        this.managementServey.get('management_company_phone').setValue(this.managementServey.value.management_company_phone);
        this.managementServey.get('management_company_contact_person').setValue(this.managementServey.value.management_company_contact_person);
      }, 100)
    }
  }


  constructor(
    public myAccountService: MyAccountService,
    private _authenticationService: AuthenticationService,
    public _userService: UserService,
    private encryptionService: EncryptionService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public toastr: ToastrManager,
    private translateService: TranslateService,
    private dataService: DataService,
    private aCtRoute: ActivatedRoute,
    private fb: FormBuilder,
    private loctn  : Location

  ) {
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.comunityId = res.id;
          this.getCommunityDetails();
        }
      }
    )
    this.subsAll.push(this._authenticationService.currentUser.subscribe(x => (this.currentUser = x)));
    this.updatePersonalInfo = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      driving_licence: ['', Validators.required],
      address: ['',],
      phone: ['',],
      age: ['',],
      gender: ['', Validators.required],
    });
  }

  get profileForm() {
    return this.updatePersonalInfo.controls;
  }

  ngOnInit(): void {
    this.currentUser = this._authenticationService.currentUserValue;
    this.getCommunityDetails();
    // this.getLoginLogs();
    this.getMangemntId_name()
    // content header
    this.contentHeader = {
      headerTitle: 'Community',
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
            name: 'Communities',
            isLink: true,
            link: '/community'
          },
          // {
          //   name: 'Profile',
          //   isLink: false
          // }
        ]
      }
    };

    this.formData = this.fb.group({
      community_name: ['', Validators.required],
      community_address1: ['', Validators.required],
      community_address2: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
      state: ['', Validators.required],
      community_phone_no: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      id: this.comunityId ? this.comunityId : ''
    })

    this.Primary = this.fb.group({
      primary_contact_firstname: ['', Validators.required],
      primary_contact_lastname: ['', Validators.required],
      primary_contact_title: ['', Validators.required],
      primary_contact_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      primary_contact_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      id: this.id ? this.id : ''
    })

    this.drpForm = this.fb.group({
      getMangemntId: ['', [Validators.required]]

    })

    // this.Servey = this.fb.group({
    //   survey_compliance_name: ['', Validators.required],
    //   survey_compliance_title: ['', Validators.required],
    //   survey_compliance_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
    //   survey_compliance_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
    //   id: this.id ? this.id : ''

    // })

    this.managementServey = this.fb.group({
      management_company_name: ['', Validators.required],
      management_company_address1: ['', Validators.required],
      citymanagement: ['', Validators.required],
      statemanagement: ['', Validators.required],
      zipmanagement: ['', Validators.required],
      management_company_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      management_company_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      management_company_contact_person: ['', [Validators.required,Validators.pattern(Patterns.number)]],
      id: this.id ? this.id : ''

    })

    this.radioData = this.fb.group({
      single_community: ['', [Validators.required]]
    })

    this.confirmForm = this.fb.group({
      id: this.id ? this.id : '',
      oldpassword: ['', [Validators.required, Validators.pattern(Patterns.password)]],
      newPassword: ['', [Validators.required, Validators.pattern(Patterns.password)]],
      confPassword: ['', [Validators.required]],
},{ Validators: MustMatch('newPassword', 'confPassword')})
  }

  getCommunityDetails() {
    this.loading = true;
    let id = this.comunityId;
    this._userService.getcommunityDetails(id).subscribe(response => {
      if (!response.error) {

        if (response.body && response.body[0] && response.body[0]) {
          this.curComDetails = response.body[0];
          console.log(this.curComDetails)
          this.mapFormValues();
        }
      } else {
        this.error = response.msg;
        this._authenticationService.errorToaster(response);
      }
      this.loading = false;
    }, error => {
      this.error = error;
      this.loading = false;
    }
    );
  }

  mapFormValues() {
  
    this.formData.patchValue({
      community_name: this.curComDetails.community_name,
      community_phone_no: this.curComDetails.community_phone_no,
      community_address1: this.curComDetails.community_address1,
      community_address2: this.curComDetails.community_address2,
      city: this.curComDetails.city,
      state: this.curComDetails.state,
      zipcode: this.curComDetails.zipcode,
    });

    this.Primary.patchValue({
      primary_contact_firstname: this.curComDetails.primary_contact_firstname,
      primary_contact_lastname: this.curComDetails.primary_contact_lastname,
      primary_contact_title: this.curComDetails.primary_contact_title,
      primary_contact_phone: this.curComDetails.primary_contact_phone,
      primary_contact_email: this.curComDetails.primary_contact_email,
      id: this.id ? this.id : ''
    });

    // this.Servey.patchValue({
    //   survey_compliance_name: this.curComDetails.survey_compliance_name,
    //   survey_compliance_title: this.curComDetails.survey_compliance_title,
    //   survey_compliance_phone: this.curComDetails.survey_compliance_phone,
    //   survey_compliance_email: this.curComDetails.survey_compliance_email,
    //   id: this.id ? this.id : ''
    // });

    this.managementServey.patchValue({
      management_company_name: this.curComDetails.management_company_name,
      management_company_address1: this.curComDetails.management_company_address1,
      management_company_phone: this.curComDetails.management_company_phone,
      citymanagement: this.curComDetails.city,
      zipmanagement: this.curComDetails.zipcode,
      management_company_email: this.curComDetails.management_company_email,
      management_company_contact_person: this.curComDetails.management_company_contact_person,
      id: this.id ? this.id : ''
    });

    this.radioData.patchValue({
      single_community: this.curComDetails.single_community,
    });
  }

  changeDatetoNgStructr(date: any): NgbDateStruct {
    let da = new Date(date);
    da = !isNaN(da.getTime()) ? da : new Date();
    return {
      year: da.getFullYear(),
      month: da.getMonth() + 1,
      day: da.getDate(),
    }
  }

  changeNgStructrToDate(date: any) {
    let dt = new Date();
    return (date && date.year)
      ? `${date.year}-${date.month}-${date.day}`
      : `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  }


  submitProfile() {
    this.success = '';
    this.error = '';
    for (const key in this.updatePersonalInfo.controls) {
      if (Object.prototype.hasOwnProperty.call(this.updatePersonalInfo.controls, key)) {
        this.updatePersonalInfo.controls[key].markAsDirty();
      }
    }

    if (this.updatePersonalInfo.invalid) {
      return;
    }

    let data = {
      user_id: this.comunityId,
      first_name: this.updatePersonalInfo.value.first_name,
      last_name: this.updatePersonalInfo.value.last_name,
      gender: this.updatePersonalInfo.value.gender,
      address: this.updatePersonalInfo.value.address || '',
      age: this.updatePersonalInfo.value.age || '',
      phone: this.updatePersonalInfo.value.phone || '',
      driving_licence: this.updatePersonalInfo.value.driving_licence,
    }
    let enc_Data = { enc: this.encryptionService.encode(JSON.stringify(data)) };
    this.loading = true;
    this._userService.updateUserDetails(enc_Data).subscribe(
      res => {
        if (!res.error) {
          this.getCommunityDetails();
          this.success = res.msg;
          this.loctn.back()
          setTimeout(() => { this.success = ''; }, 2000)
        } else {
          this.loading = false;
          this.error = res.msg;
          this._authenticationService.errorToaster(res, false);
        }
      }, error => {
        this.error = error;
        this.loading = false;
      }
    )

  }

  modalOpenOSE(modalOSE) {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        centered: true,
      }
    );
  }

  closed(modal: NgbModalRef) {
    modal.dismiss();
  }


  fileChange(file) {
    this.file = file.target.files[0];
    if (this.file != undefined && this.file != null) {
      var strFileName = this.getFileExtension1(this.file.name);
      if (strFileName != 'jpeg' && strFileName != 'png' && strFileName != 'jpg') {
        this.toastr.errorToastr('Please select correct image format', '', {
          position: 'bottom-right'
        });
        return;
      }
    } else {
      this.toastr.errorToastr('Please select image', '', {
        position: 'bottom-right'
      });
      return;
    }
    var input_data = {
      "profile_pic": this.file == undefined ? "" : this.file
    }

    const formData = new FormData();
    formData.append('profilePic', input_data.profile_pic);
    formData.append('id', this.comunityId);

    //const httpOptions = { headers: new HttpHeaders({'token': this.token})};
    this.isLoading = true;
    this._userService.uploadProfilePic(formData).subscribe((res) => {
      if (!res['error']) {
        this.curComDetails.profile_pic = res['body'][0].profilePic;
        this.fileupload.nativeElement.value = "";
        this.isLoading = false;
        this.toastr.successToastr('Profile picture updated successfully');
      } else {
        this.isLoading = false;
        this.fileupload.nativeElement.value = "";
        this.toastr.errorToastr(res['msg']);
      }
    }, error => {
      this.isLoading = false;
      this.fileupload.nativeElement.value = "";
      this.toastr.errorToastr(error);
    })

  }

  getFileExtension1(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
  }
  /**
   * Clear all subscriptions
  */
  ngOnDestroy() {
    this.subsAll.map(
      item => {
        item.unsubscribe();
        item = null;
      }
    )
  }


  // getLoginLogs() {
  //   this.logLoading = true
  //   this.dataService.getLoginLogs(this.currentUser._id).subscribe((res) => {
  //     if (!res['error']) {
  //       this.logs = res['body']
  //       this.logLoading = false
  //     }
  //   })
  // }

  updateVerificationStatus(status, msg = '') {
    if (this.curComDetails && this.curComDetails.drivingLicense
      && this.curComDetails.secondaryDocument && this.curComDetails.picWithDL) {
      let encDat = this.encryptionService.encode(JSON.stringify({ user_id: this.comunityId, status: status }));
      this.uptingVerification = true;
      this._userService.verfifyDocument({ enc: encDat }).subscribe(
        res => {
          let data = this.encryptionService.getDecode(res);
          if (!data.error) {
            this.curComDetails.documentStatus = status ? '2' : '3';
            this.toastr.successToastr(data.msg);
          } else {
            this._authenticationService.errorToaster(data);
          }
          this.uptingVerification = false;
        }, error => {
          this.uptingVerification = false;
          this.toastr.errorToastr('Something went wrong while updating status, please try again later');
        }
      )
    } else {
      return;
    }
  }

  showLightbox(img) {
    this.imageObject = [{ image: img }];
    this.selectedImageIndex = 0;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.imageObject = [];
    this.selectedImageIndex = -1;
    let b = document.body;
    b.style.overflow = 'unset';
  }

  get controls() {
    return this.formData.controls;
  }

  get pControls() {
    return this.Primary.controls
  }



  submitted() {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    else {
      this.btnShow = true;
      let body1={
        community_name: this.formData.value.community_name,
        community_phone_no: this.formData.value.community_phone_no.replace(/\D/g, ''),
        community_address1: this.formData.value.community_address1,
        community_address2: this.formData.value.community_address2,
        city: this.formData.value.city,
        zipcode: this.formData.value.zipcode,
        state: this.formData.value.state,
        id: this.comunityId  ? this.comunityId : ''
      }
      this.dataService.editCommunity(body1).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.tempCmntyId = res.body[0].id
        } else {
          this.toastr.errorToastr(res.msg);
        }
        this.btnShow = false;
      },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster();
        
      })
    }
  }

  primarySubmit() {
    for (let item of Object.keys(this.pControls)) {
      this.pControls[item].markAsDirty()
    }
    if (this.Primary.invalid) {
      return;
    }
    else {
      let data = { ...this.Primary.value, ...{ id: this.comunityId } }
      this.btnShow = true;
      let body1={
        primary_contact_firstname: this.Primary.value.primary_contact_firstname,
        primary_contact_lastname: this.Primary.value.primary_contact_lastname,
        primary_contact_title: this.Primary.value.primary_contact_title,
        primary_contact_email: this.Primary.value.primary_contact_email,
        primary_contact_phone: this.Primary.value.primary_contact_phone.replace(/\D/g, ''),
        id: this.comunityId ? this.comunityId : ''
      }
      console.log(body1.primary_contact_phone)
      this.dataService.updatePrimaryContact(body1).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.btnShow = false;
        }else{
          this.toastr.errorToastr(res.msg);
          this.btnShow = false;
        }
      }, (err: any) => {
        this.dataService.genericErrorToaster()
        this.btnShow = false;
      })
    }
  }

  // serveySubmit() {
  //   this.btnShow = true;
  //   for (let item of Object.keys(this.psc)) {
  //     this.psc[item].markAsDirty()
  //   }
  //   if(this.Servey.invalid){
  //   this.btnShow = false;
  //     return;
  //   }
  //   let data = { ...this.Servey.value, ...{ id: this.comunityId } }
  //   let body1={
  //     survey_compliance_email: this.Servey.value.survey_compliance_email,
  //     survey_compliance_name: this.Servey.value.survey_compliance_name,
  //     survey_compliance_title: this.Servey.value.survey_compliance_title,
  //     survey_compliance_phone: this.Servey.value.survey_compliance_phone.replace(/\D/g, ''),
  //     id: this.comunityId ? this.comunityId : ''

  //   }
  //   console.log(body1.survey_compliance_phone)
  //   this.dataService.updateSurveyCompliance(body1).subscribe((res: any) => {
  //     if (!res.error) {
  //       this.toastr.successToastr(res.msg);
  //       this.btnShow = false;
  //     }
  //   },
  //     (err: any) => {
  //       this.dataService.genericErrorToaster()
  //       this.btnShow = false;
  //     })
  // }

  managementSubmit() {
    this.btnShow = true;
    for (let item of Object.keys(this.mc)) {
      this.mc[item].markAsDirty()
    }
    if(this.managementServey.invalid){
    this.btnShow = false;
      return;
    }
    let data = { ...this.managementServey.value, ...{ id: this.comunityId } }
    this.btnShow = true;
    let body1={
      management_company_name: this.managementServey.value.management_company_name,
      management_company_address1: this.managementServey.value.management_company_address1,
      management_company_phone: this.managementServey.value.management_company_phone.replace(/\D/g, ''),
      management_company_email: this.managementServey.value.management_company_email,
      management_company_contact_person: this.managementServey.value.management_company_contact_person.replace(/\D/g, ''),
      id: this.comunityId ? this.comunityId : ''
    }
    console.log(body1.management_company_phone)
    this.dataService.updateManagementCompany(body1).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
      }
      this.btnShow = false;

    },
      (err: any) => {
        this.dataService.genericErrorToaster()
      })
    this.btnShow = false;

  }

  radioData1() {
    let data = { ...this.radioData.value, ...{ id: this.comunityId } }
    this.btnShow = true;
    this.dataService.updateSinleCOm(data).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
        this.ngOnInit();
      }
      this.btnShow = false;

    },
      (err: any) => {
        this.dataService.genericErrorToaster()
      })
    this.btnShow = false;

  }

  get fControls() {
    return this.confirmForm.controls
  }

  // get psc() {
  //   return this.Servey.controls
  // }

  get mc() {
    return this.managementServey.controls
  }



  confirmSubmit() {
    console.log(this.confirmForm.value)
    for (let item of Object.keys(this.fControls)) {
      this.fControls[item].markAsDirty()
    }
    if (this.confirmForm.invalid) {
      return;
    }
    else {
      let data: any = this.confirmForm.value;
      data.id = this.comunityId;
      this.btnShow = true;
      this.dataService.updateCommunityPassword(data).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);         
          this.btnShow = false;
          this.confirmForm.reset();
        }
      }, (err: any) => {
        this.dataService.genericErrorToaster()
        this.btnShow = false;
      })
    }
  }

  getMangemntId_name() {
    this.dataService.getManagementNames().subscribe(res => {
      if (!res.error) {
        this.getMangemntId_names = res.body
        console.log(this.getMangemntId_names)
      } else {
        this._authenticationService.errorToaster(res);
      }
      this.btnShow = false;
    }, error => {
      this.toastr.errorToastr('Oops! something went wrong, while deleting User, please try again.');
      this.btnShow = false;
    });
}

  get dp() {
    return this.drpForm.controls
  }
  

  drpForm1(){
  for (let item of Object.keys(this.dp)) {
    this.dp[item].markAsDirty()
  }
  if (this.drpForm.invalid) {
    return;
  }
  this.drpForm.value.getMangemntId.forEach(element => {
    this.manag.push(element.id)
  });
  let data ={ id  : this.comunityId , management_id: this.manag}
  this.dataService.updateManagementId(data).subscribe((res: any) => {
    if (!res.error) {
      this.btnShow = false;
      this.toastr.successToastr(res.msg);
    }
  },
    (err: any) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster()
    })

}

goBack(){
  this.loctn.back()
}

}
