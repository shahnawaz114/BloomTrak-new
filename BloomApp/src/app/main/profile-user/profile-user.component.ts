import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Patterns } from 'app/auth/helpers/patterns';
import { User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.scss']
})
export class ProfileUserComponent implements OnInit {
  formData!: FormGroup;
  forgotPassword!: FormGroup;
  btnShow:boolean = false;
  userId: any;
  loading: boolean;
  curComDetails: any;
  error: any;
  public contentHeader: object;
  public currentUser: User;
  imageObject: any[] = [];
  activeTab: number = 0;
  
  tabChanged(ev:any) {
    this.activeTab = ev.nextId.replace('ngb-nav-','');
    if(this.activeTab == 0) {
      setTimeout(() => {
        this.formData.get('phone_number').setValue(this.formData.value.phone_number);
      }, 1100)
    } 
    // console.log(this.activeTab)
  }
  constructor(
    private fb: FormBuilder,
    private aCtRoute: ActivatedRoute,
    private _userService : UserService,
    private auth :AuthenticationService,
    private toastr: ToastrManager,

  ) { 
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.userId = res.id;
          console.log(this.userId )
          this.getuserDetails();
        }
      }
    )
  }

  ngOnInit(): void {
    
    this.auth.currentUser.subscribe(x => (this.currentUser = x));
    this.contentHeader = {
      headerTitle: this.currentUser.role == 'Agency' ? 'Agency Personnel' : 'User',
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
            name: this.currentUser.role == 'Agency' ? 'Agency Personnel' : 'User',
            isLink: true,
            link: '/user'
          }
        ]
      }
    };

    this.formData = this.fb.group({
      DOB: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      community_name: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      first_name: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      last_name: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      agency_name: ['', [Validators.required, Validators.pattern(Patterns.number)]],
    })

    this.forgotPassword = this.fb.group({
      password: ['', Validators.required],
      confPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      id: this.userId
    })

    setTimeout(() => {
      this.formData.get('phone_number').setValue(this.formData.value.phone_number);
    }, 1100)
  }

  get controls() {
    return this.formData.controls;
  }
  get fp() {
    return this.forgotPassword.controls;
  }
  submitted(){

  }



  upadtePassword(){
    for (let item of Object.keys(this.fp)) {
      this.fp[item].markAsDirty()
    }
    if (this.forgotPassword.invalid) {
      return;
    }
      this.btnShow = true;
    this._userService.updateUserPassword(this.forgotPassword.value).subscribe(response => {
      if (!response.error) {
       this.toastr.successToastr(response.msg)
       this.btnShow = false;
       this.forgotPassword.reset()
      } else {
        this.error = response.msg;
        this.auth.errorToaster(response);
       this.btnShow = false;

      }
      this.loading = false;
    }, error => {
      this.error = error;
      this.btnShow = false;
    }
    );
  }

  getuserDetails() {
    this.loading = true;
    let id = this.userId;
    let is_for = 'user'
    this._userService.getUserById(id,is_for).subscribe(response => {
      if (!response.error) {

        if (response.body && response.body[0] && response.body[0]) {
          this.curComDetails = response.body[0];
          this.mapFormValues();
        }
      } else {
        this.error = response.msg;
        this.auth.errorToaster(response);
      }
      this.loading = false;
    }, error => {
      this.error = error;
      this.loading = false;
    }
    );
  
  }

  mapFormValues(){
    
    this.formData.patchValue({
      DOB: this.curComDetails.DOB,
      email: this.curComDetails.email,
      phone_number: this.curComDetails.phone_number,
      community_name: this.curComDetails.community_name,
      first_name: this.curComDetails.first_name,
      last_name: this.curComDetails.last_name,
      agency_name: this.curComDetails.agency_name
      
    });

  }
  

}
