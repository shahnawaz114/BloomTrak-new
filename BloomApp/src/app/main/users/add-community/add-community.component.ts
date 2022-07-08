import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.scss']
})
export class AddCommunityComponent implements OnInit {

  formData!: FormGroup;
  btnShow: boolean = false;
  searchSub: any = null;
  public page = new Page();
  loadingList: boolean;
  currentUser: any;
  searchStr: string = '';
  public rows = [];
  tempCmntyId: any;
  public contentHeader: object;

  constructor(
    private dataService: DataService,
    private toastr: ToastrManager,
    private fb: FormBuilder,
    private _authenticationService: AuthenticationService,
    private loctn : Location

  ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      console.log(this.currentUser)
    });
   }

  ngOnInit(): void {

    this.formData = this.fb.group({
      community_name: ['', Validators.required],
      community_address1: ['', Validators.required],
      community_email: ['', [ Validators.pattern(Patterns.email)]],
      community_address2: ['',],
      community_website: ['',Validators.required],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
      state: ['', Validators.required],
      community_phone_no: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      password: ['', [ Validators.pattern(Patterns.password)]],
      primary_contact_firstname: ['', Validators.required],
      primary_contact_lastname: ['', Validators.required],
      primary_contact_title: ['', Validators.required],
      primary_contact_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      primary_contact_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      cnfrmpassword:  ['']
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },
    )

    this.contentHeader = {
      headerTitle: 'Add Community ',
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
            name: 'Communities ',
            isLink: true,
            link: '/community'
          }
        ]
      }
    };
  }

  get controls() {
    return this.formData.controls;
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
      let body1 = {
        community_name: this.formData.value.community_name,
        community_address1: this.formData.value.community_address1,
        community_address2: this.formData.value.community_address2,
        community_phone_no: this.formData.value.community_phone_no.replace(/\D/g, ''),
        password: this.formData.value.password,
        city: this.formData.value.city,
        state: this.formData.value.state,
        zipcode: this.formData.value.zipcode,
        community_website: this.formData.value.community_website,
        community_email: this.formData.value.community_email,
        primary_contact_firstname: this.formData.value.primary_contact_firstname,
        primary_contact_lastname: this.formData.value.primary_contact_lastname,
        primary_contact_title: this.formData.value.primary_contact_title,
        primary_contact_phone: this.formData.value.primary_contact_phone.replace(/\D/g, ''),
        primary_contact_email: this.formData.value.primary_contact_email,
        approval: this.formData.value.approval,
      }

      this.dataService.register({ ...body1, ...{ approval: '1' } }).subscribe((res: any) => {
        if (!res.error) {
          this.btnShow = false;
          this.toastr.successToastr(res.msg);
          this.tempCmntyId = res.body[0].id
          this.loctn.back()

        } else {
          this.btnShow = false;
          this.toastr.errorToastr(res.msg);
        }
      },
        (err) => {
          this.btnShow = false;
          this.dataService.genericErrorToaster();
        })
    }
  }

  goBack(){
    this.loctn.back()
  }
}
