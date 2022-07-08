import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.scss']
})
export class AddAgencyComponent implements OnInit {
  formData!: FormGroup;
  btnShow: boolean = false;
  searchSub: any = null;
  loadingList: boolean;
  currentUser: any;
  searchStr: string = '';
  public rows = [];
  tempCmntyId: any;
  tempAddId: any;

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
      agency_name: ['', [Validators.required]],
      agency_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      agency_email: ['', [ Validators.pattern(Patterns.email)]],
      password: ['', [ Validators.pattern(Patterns.password)]],
      agency_website: ['',[ Validators.required]],
      state: ['',[ Validators.required]],
      address1: ['',[ Validators.required]],
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
      // community_id: ['', [ Validators.required]],
      cnfrmpassword:  ['']
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },
    )

    this.contentHeader = {
      headerTitle: 'Add Agency ',
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
          }
        ]
      }
    };
  }

  get controls() {
    return this.formData.controls;
  }

  submitted( ) {
    console.log(this.formData.value)
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    else {
      //let data = { ...this.formData.value, ...{ community_id: this.tempAddId } }
      this.btnShow = true;
      let body1 = {
        agency_name: this.formData.value.agency_name,
        password: this.formData.value.password,
        agency_website: this.formData.value.agency_website,
        agency_phone: this.formData.value.agency_phone.replace(/\D/g, ''),
        agency_email: this.formData.value.agency_email,
        address1: this.formData.value.address1,
        address2: this.formData.value.address2,
        city: this.formData.value.city,
        state: this.formData.value.state,
        zipcode: this.formData.value.zipcode,
        agency_contact_firstname: this.formData.value.agency_contact_firstname,
        agency_contact_lastname: this.formData.value.agency_contact_lastname,
        agency_contact_person_title: this.formData.value.agency_contact_person_title,
        agency_contact_cell_number: this.formData.value.agency_contact_cell_number.replace(/\D/g, ''),
        agency_contact_email_address: this.formData.value.agency_contact_email_address,
        // primary_contact_person: this.formData.value.primary_contact_person,
        // primary_contact_phone: this.formData.value.primary_contact_phone.replace(/\D/g, ''),
        // primary_contact_email: this.formData.value.primary_contact_email,
        community_id: this.currentUser?.id || ''
      }
      this.btnShow = true;
      this.dataService.addAgency(body1).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.tempAddId = res.body[0]
          this.loctn.back()
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

  goBack(){
    this.loctn.back()
  }

}
