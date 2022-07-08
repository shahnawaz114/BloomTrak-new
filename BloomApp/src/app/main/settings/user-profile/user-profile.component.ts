import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { Patterns } from 'app/auth/helpers/patterns';
import { User } from 'app/auth/models/user';
import { UserService } from 'app/auth/service';
import { AuthenticationService } from 'app/auth/service/authentication.service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  formData!: FormGroup;
  userFormData!: FormGroup;
  communityFormData!: FormGroup;
  editManagement!: FormGroup;
  sendNo!: FormGroup;
  otp!: FormGroup;
  forgotPassword!: FormGroup;
  imageObject: any[] = [];
  activeTab: number = 0;
  public contentHeader: object;
  public currentUser: User;
  curComDetails: any;
  userId: any;
  btnShow: boolean = false;

  curntUsrvl: any[] =[]

  minDate: string;
  @ViewChild('verificationModal') verificationModal : ElementRef<any>;
  userDetails: any;



  tabChanged(ev:any) {
    this.activeTab = ev.nextId.replace('ngb-nav-','');
    if(this.activeTab == 0) {
      setTimeout(() => {
        this.formData.get('agency_phone').setValue(this.formData.value.agency_phone);
      }, 40)
    } 
    console.log(this.activeTab)
  }
  constructor(
   public toastr: ToastrManager,
    private auth :AuthenticationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private settingService: SettingsService,
    private dataService: DataService,
    private userService: UserService
    ) {
      this.auth.currentUser.subscribe((x: any) => {
        this.currentUser = x
        this.userId = this.currentUser?.role == 'Admin'? this.currentUser?._id : this.currentUser?.id
        console.log(x)
      })
  if(this.currentUser.role == 'Agency'){
    this.dataService.getAgenciesByID(this.currentUser.id).subscribe((res: any) => {
          this.curntUsrvl = res.body
          console.log(this.curntUsrvl)
          this.formData.patchValue({
            agency_name: this.curntUsrvl[0].agency_name,
            agency_website: this.curntUsrvl[0].agency_website,
            DOB: this.curntUsrvl[0].DOB,
            agency_phone: this.curntUsrvl[0].agency_phone,
          })
  })
} else if(this.currentUser.role == 'Community'){
  this.dataService.getcommunityById(this.currentUser.id).subscribe((res: any) => {
          this.curntUsrvl = res.body
          console.log(this.curntUsrvl)
          this.communityFormData.patchValue({
            community_name: this.curntUsrvl[0].community_name,
            community_address1: this.curntUsrvl[0].community_address1,
            community_address2: this.curntUsrvl[0].community_address2,
            community_phone_no: this.curntUsrvl[0].community_phone_no,
            zipcode: this.curntUsrvl[0].zipcode,
            city: this.curntUsrvl[0].city
          });
          setTimeout(() => {
            this.communityFormData.get('community_phone_no').setValue(this.communityFormData.value.community_phone_no)
          }, 100)
  })
} else if(this.currentUser.role == 'Admin'){
  this.userService.getManagementById(this.currentUser._id).subscribe((res: any) => {
          this.curntUsrvl = res.body
          console.log(this.curntUsrvl)
          this.editManagement.patchValue({
            mg_name: res.body[0].mg_name,
            mg_title: res.body[0].mg_title,
            mg_phone: res.body[0].mg_phone,
            contact_email: res.body[0].contact_email,
            contact_person: res.body[0].contact_person,
            contact_person_name: res.body[0].contact_person_name
          });
          setTimeout(() => {
            this.editManagement.get('mg_phone').setValue(this.editManagement.value.mg_phone)
          }, 100)
          setTimeout(() => {
            this.editManagement.get('contact_person').setValue(this.editManagement.value.contact_person)
          }, 100)
  })
   }
   else if(this.currentUser.role == 'User'){
    let is_for = 'user'
    this.dataService.getUserById(this.currentUser.id,is_for).subscribe((res: any) => {
      this.curntUsrvl = res.body
      console.log(this.curntUsrvl)
      this.userFormData.patchValue({
        DOB: this.curntUsrvl[0].DOB,
        first_name: this.curntUsrvl[0].first_name,
        last_name: this.curntUsrvl[0].last_name,
        phone_number: this.curntUsrvl[0].phone_number,
        email: this.curntUsrvl[0].email,
        PIN_code: this.curntUsrvl[0].PIN_code
      });
      setTimeout(() => {
        this.userFormData.get('phone_number').setValue(this.userFormData.value.phone_number)
      }, 100)
})
   }
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.formData.get('agency_phone').setValue(this.formData.value.agency_phone);
    }, 1100)
    
    this.getDate()
     // content header
     this.contentHeader = {
      headerTitle: 'Profile',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          }
        ]
      }
    };

    this.formData = this.fb.group({
      agency_name: ['', Validators.required],
      agency_website: ['', Validators.required],
      DOB: ['', Validators.required],
      agency_phone: ['', [Validators.required]],
    })

    this.forgotPassword = this.fb.group({
      PIN_code: ['', Validators.required],
      id: this.userId
    })

    this.userFormData = this.fb.group({
      DOB: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      PIN_code: ['', Validators.required],
    })

    this.communityFormData = this.fb.group({
      community_name: ['', Validators.required],
      community_address1: ['', [Validators.required]],
      community_address2: ['', [Validators.required]],
      community_phone_no: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      zipcode: ['', Validators.required],
      city: ['', Validators.required],
    })
   
    this.editManagement = this.fb.group({
      mg_name: ['', Validators.required],
      mg_title: ['', Validators.required],
      mg_phone: ['', [Validators.required,Validators.pattern(Patterns.number)]],
      // mg_email: ['', [Validators.required,Validators.pattern(Patterns.email)]],
      contact_email: ['', [Validators.required,Validators.pattern(Patterns.email)]],
      contact_person: ['', Validators.required],
      contact_person_name: ['', Validators.required],
      // password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
      // approval: ['1'],
    });
    this.sendNo = this.fb.group({
      number: ['', Validators.required],
      id: this.userId
    })
    
    this.otp = this.fb.group({
      otp: ['', Validators.required],
      // id: this.userId
    })
  }

  get controls() {
    return this.formData.controls;
  }
  get fp() {
    return this.forgotPassword.controls;
  }

  get uc() {
    return this.userFormData.controls;
  }

  get cfc() {
    return this.communityFormData.controls;
  }
  
  get ec() {
    return this.editManagement.controls;
  }

  
  get sn() {
    return this.sendNo.controls;
  }
  
  get otpform() {
    return this.otp.controls;
  }

  getDate() {
    let todayDate: any = new Date();
    let toDate: any = todayDate.getDate();
    if (toDate < 10) {
      toDate = '0' + toDate
    }
    let month = todayDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let year = todayDate.getFullYear();
    this.minDate = year + '-' + month + '-' + toDate
  }

submitted(){
  for (let item of Object.keys(this.controls)) {
    this.controls[item].markAsDirty()
  }
  let body = {
    agency_name: this.formData.value.agency_name,
    DOB: this.formData.value.DOB,
    agency_website: this.formData.value.agency_website,
    agency_phone: this.formData.value.agency_phone.replace(/\D/g, ''),
  }
  if(this.formData.invalid){
    return
  }
  this.btnShow = true;
  this.settingService.updateAgencyProfile({...body,...{id:this.userId}}).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      body = null
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


userSubmitted(){
  for (let item of Object.keys(this.uc)) {
    this.uc[item].markAsDirty()
  }
  let body = {
    DOB: this.userFormData.value.DOB,
    first_name: this.userFormData.value.first_name,
    last_name: this.userFormData.value.last_name,
    email: this.userFormData.value.email,
    phone_number: this.userFormData.value.phone_number.replace(/\D/g, ''),
    PIN_code: this.userFormData.value.PIN_code,
    // is_for : 'agency'
    id : this.userId
  }
  if(this.userFormData.invalid){
    return
  }
  this.btnShow = true;
  let is_for = 'agency'
  this.dataService.editUser(body,is_for).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      body = null
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

communitySubmitted(){
  for (let item of Object.keys(this.cfc)) {
    this.cfc[item].markAsDirty()
  }
  let body = {
    community_name: this.communityFormData.value.community_name,
    community_address1: this.communityFormData.value.community_address1,
    community_address2: this.communityFormData.value.community_address2,
    zipcode: this.communityFormData.value.zipcode,
    city: this.communityFormData.value.city,
    community_phone_no: this.communityFormData.value.community_phone_no.replace(/\D/g, ''),
  }
  if(this.communityFormData.invalid){
    return
  }
  this.btnShow = true;
  this.dataService.editCommunity({...body,...{id:this.userId}}).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      body = null
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
editManagementSubmit(){
  for (let item of Object.keys(this.ec)) {
    this.ec[item].markAsDirty()
  }
  let body1={
    mg_name: this.editManagement.value.mg_name,
    mg_title: this.editManagement.value.mg_title,
    contact_person_name: this.editManagement.value.contact_person_name,
    contact_email: this.editManagement.value.contact_email,
    mg_phone: this.editManagement.value.mg_phone.replace(/\D/g, ''),
    contact_person: this.editManagement.value.contact_person.replace(/\D/g, ''),
    id:this.userId
  }
  if(this.editManagement.invalid){
    return
  }
  this.btnShow = true;
  this.dataService.editManagementByID(body1).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      body1 = null
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

upadtePassword(){
  for (let item of Object.keys(this.fp)) {
    this.fp[item].markAsDirty()
  }
  let body2 = {
    PIN_code: this.forgotPassword.value.PIN_code,
  }
  if(body2){
  this.settingService.updateAgencyProfile({...body2,...{id:this.userId}}).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })}
}

sendNosbmt(){
  for (let item of Object.keys(this.sn)) {
    this.sn[item].markAsDirty()
  }
  let data ={
    number : this.currentUser.role == 'User' ? this.curntUsrvl[0].phone_number : this.currentUser.role == 'Community' ?  this.curntUsrvl[0].community_phone_no : this.currentUser.role == 'Admin' ? this.userDetails.mg_phone :  this.curntUsrvl[0].agency_phone ,
    id : this.userId,
    is_for :  this.currentUser.role == 'User' ? 'user' : this.currentUser.role == 'Community' ? 'community'  : this.currentUser.role == 'Admin' ? 'management' : 'agency'
  }
  this.dataService.sms(data).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      this.modalOpenOSE(this.verificationModal)
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
modalOpenOSE(modalOSE:any) {
  this.otp.reset()
  this.modalService.open(modalOSE,
    {
      backdrop: false,
      size: 'sm',
      centered: true,
    }
  );
}
closeVerificationModal(){
  this.modalService.dismissAll()
}
otpSubmit(){
  this.dataService.verifyOtp({...this.otp.value,...{id:this.userId},...{is_for : this.currentUser.role == 'User' ? 'user' : this.currentUser.role == 'Community' ? 'community' : this.currentUser.role == 'Admin' ? 'management' : 'agency'}}).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      this.modalService.dismissAll()
      this.curntUsrvl[0].is_verified=1
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


