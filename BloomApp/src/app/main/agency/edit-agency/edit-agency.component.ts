import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService, UserService, CountriesService } from 'app/auth/service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { ToastrManager } from 'ng6-toastr-notifications';
// import jspdf from 'jspdf';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'app/auth/service/data.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Patterns } from 'app/auth/helpers/patterns';
import { MustMatch } from 'app/auth/helpers';

@Component({
  selector: 'app-edit-agency',
  templateUrl: './edit-agency.component.html',
  styleUrls: ['./edit-agency.component.scss']
})
export class EditAgencyComponent implements OnInit {
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
  formData!: FormGroup;
  confirmForm!: FormGroup;
  Servey!: FormGroup;
  radioData!: FormGroup;
  managementServey!: FormGroup;
  id: any;
  btnShow: boolean = false;
  tempCmntyId: any;
  activeTab: number = 1;
  userid: any;

  constructor(
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
    private rout :Router
  
    ) 
    {
      this.aCtRoute.params.subscribe(
        res => {
          if (res.id) {
            this.comunityId = res.id;
            this.getagencyDetails();
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
      this.currentUser = this._authenticationService.currentUserValue;
      console.log(this.currentUser)
    }
    
    get profileForm() {
      return this.updatePersonalInfo.controls;
    }

    ngOnInit(): void {
      this.getagencyDetails();
      this.getLoginLogs();
  
      // content header
      this.contentHeader = {
        headerTitle: 'Agency ',
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
              name: 'Agency ',
              isLink: true,
              link: '/agency'
            },
            // {
            //   name: 'Profile',
            //   isLink: false
            // }
          ]
        }
      };
  
      this.formData = this.fb.group({
        agency_name: ['', [Validators.required]],
        agency_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
        agency_email: ['', [Validators.pattern(Patterns.email)]],
        agency_website: ['', [Validators.required]],
        state: ['',[ Validators.required]],
        address1: ['', [Validators.required]],
        address2: [''],
        city: ['',[ Validators.required]],
        zipcode: ['',[ Validators.required]],
        agency_contact_firstname: ['',[ Validators.required]],
        agency_contact_lastname: ['',[ Validators.required]],
        agency_contact_person_title: ['',[ Validators.required]],
        agency_contact_cell_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
        agency_contact_email_address: ['', [Validators.required, Validators.pattern(Patterns.email)]],
        // primary_contact_person: ['',[ Validators.required]],
        // primary_contact_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
        // primary_contact_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
        // community_name: ['', Validators.required],
      })
  
      this.confirmForm = this.fb.group({
        id: this.id ? this.id : '',
        password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
        newPassword: ['', [Validators.required, Validators.pattern(Patterns.password)]],
        confPassword: ['', [Validators.required]],
      },
        {
          Validators: MustMatch('confPassword', 'newPassword' )
        })
    }
  
    getagencyDetails() {
      this.loading = true;
      let id = this.comunityId;
      this._userService.getagencyDetails(id).subscribe(response => {
        if (!response.error) {
  
          // if (response.body && response.body[0] && response.body[0]) {
          //   this.curComDetails = response.body[0];
          //   // this.mapFormValues();
          // }
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
  
    // mapFormValues() {
    //   this.formData.patchValue({
    //     agency_name: this.curComDetails.agency_name,
    //     agency_phone: this.curComDetails.agency_phone,
    //     agency_email: this.curComDetails.agency_email,
    //     agency_website: this.curComDetails.agency_website,
    //     address1: this.curComDetails.address1,
    //     address2: this.curComDetails.address2,
    //     city: this.curComDetails.city,
    //     state: this.curComDetails.state,
    //     zipcode: this.curComDetails.zipcode,
    //     agency_contact_firstname: this.curComDetails.agency_contact_firstname,
    //     agency_contact_lastname: this.curComDetails.agency_contact_lastname,
    //     agency_contact_person_title: this.curComDetails.agency_contact_person_title,
    //     agency_contact_cell_number: this.curComDetails.agency_contact_cell_number,
    //     agency_contact_email_address: this.curComDetails.agency_contact_email_address,
    //     community_name: this.curComDetails.community_name,
    //   });
    // }
  
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
  
  
    // submitProfile() {
    //   this.success = '';
    //   this.error = '';
    //   for (const key in this.updatePersonalInfo.controls) {
    //     if (Object.prototype.hasOwnProperty.call(this.updatePersonalInfo.controls, key)) {
    //       this.updatePersonalInfo.controls[key].markAsDirty();
    //     }
    //   }
  
    //   if (this.updatePersonalInfo.invalid) {
    //     return;
    //   }
  
    //   let data = {
    //     user_id: this.comunityId,
    //     first_name: this.updatePersonalInfo.value.first_name,
    //     last_name: this.updatePersonalInfo.value.last_name,
    //     gender: this.updatePersonalInfo.value.gender,
    //     address: this.updatePersonalInfo.value.address || '',
    //     age: this.updatePersonalInfo.value.age || '',
    //     phone: this.updatePersonalInfo.value.phone || '',
    //     driving_licence: this.updatePersonalInfo.value.driving_licence,
    //   }
    //   let enc_Data = { enc: this.encryptionService.encode(JSON.stringify(data)) };
    //   this.loading = true;
    //   this._userService.updateUserDetails(enc_Data).subscribe(
    //     res => {
    //       if (!res.error) {
    //         this.getagencyDetails();
    //         this.success = res.msg;
    //         setTimeout(() => { this.success = ''; }, 2000)
    //       } else {
    //         this.loading = false;
    //         this.error = res.msg;
    //         this._authenticationService.errorToaster(res, false);
    //       }
    //     }, error => {
    //       this.error = error;
    //       this.loading = false;
    //     }
    //   )
  
    // }
  
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
  
  
    getLoginLogs() {
      this.logLoading = true
      this.dataService.getLoginLogs(this.currentUser._id).subscribe((res) => {
        if (!res['error']) {
          this.logs = res['body']
          this.logLoading = false
        }
      })
    }
  
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
      return this.confirmForm.controls
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
          agency_name: this.formData.value.agency_name,
          agency_phone: this.formData.value.agency_phone.replace(/\D/g, ''),
          agency_email: this.formData.value.agency_email,
          agency_website: this.formData.value.agency_website,
          address1: this.formData.value.address1,
          address2: this.formData.value.address2,
          city: this.formData.value.city,
          // primary_contact_phone: this.formData.value.primary_contact_phone.replace(/\D/g, ''),
          state: this.formData.value.state,
          zipcode: this.formData.value.zipcode,
          agency_contact_firstname: this.formData.value.agency_contact_firstname,
          agency_contact_lastname: this.formData.value.agency_contact_lastname,
          agency_contact_person_title: this.formData.value.agency_contact_person_title,
          agency_contact_cell_number: this.formData.value.agency_contact_cell_number.replace(/\D/g, ''),
          agency_contact_email_address: this.formData.value.agency_contact_email_address,
          // primary_contact_person: this.formData.value.primary_contact_person,
          // primary_contact_email: this.formData.value.primary_contact_email,
          id: this.comunityId
      }
        this.dataService.editAgencies(body1).subscribe((res: any) => {
          if (!res.error) {
            this.toastr.successToastr(res.msg);
            this.tempCmntyId = res.body[0].id
            this.rout.navigateByUrl('/agency')
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
  
    confirmSubmit() {
      console.log(this.confirmForm)
      for (let item of Object.keys(this.pControls)) {
        this.pControls[item].markAsDirty()
      }
      if (this.confirmForm.invalid) {
        return;
      }
      else {
        let data: any = this.confirmForm.value;
        data.id = this.comunityId;
        this.btnShow = true;
       // let data = { ...this.confirmForm.value, ...{ id: this.comunityId }
        // setTimeout(() => {
        //   this.toastr.successToastr('Password updated successfully!')
        //   this.btnShow = false
        // }, 500);
        this.dataService.updateAgencyPassword(data).subscribe((res: any) => {
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
}
  
