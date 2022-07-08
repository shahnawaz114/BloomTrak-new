import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService, UserService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  editFormData!: FormGroup;
  currentUser: any;
  crrntUsrId: any[] = []
  formData!: FormGroup;
  submitId: any = []
  submitId2: any = []
  data: any;
  data1: any;
  data2: any;
  data3: any;
  data4: any;
  userEdit: any;
  data5: any;
  data6: any;
  btnShow: boolean = false;
  minDate: string;
  currenUserId: any;
  public contentHeader: object;
  prmsUsrId: any;
  allAgenciesID: any = [];
  allCommunity: any = [];
  searchStr: string = '';
  public page = new Page();
  cmmntNames: any= [];

  dropdownSettings2: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'mg_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'community_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettings1: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'agency_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  constructor(
    private fb: FormBuilder,
    private _authenticationService: AuthenticationService,
    private dataService: DataService,
    private tost: ToastrManager,
    private api: ApiService,
    private userService: UserService,
    private loctn : Location,
    private aCtRoute: ActivatedRoute,

  ) { 
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.prmsUsrId = res;
          console.log(res)
          this.EditUser(this.prmsUsrId)
        }
      }
    )

    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      this.crrntUsrId.push(this.currentUser?.role == 'Admin' ?  x?._id : x?.id)
      console.log('crrntUsrId',this.currentUser)
    });
  }

  ngOnInit(): void {
    this.getagenciesID()
    this.getCommunityId()
    this.getCmmntNm()
    this.editFormData = this.fb.group({
      DOB: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      // PIN_code: ['', Validators.required],
      community_id: [''],
      agency_id: [''],
      management_Co: [''],
      management_co_user: ['',Validators.required],
    })

    this.contentHeader = {
      headerTitle: this.currentUser.role == 'Agency' ? 'Edit Agency Personnel' : 'Edit User',
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
  }

  uncheckDropdown4() {
    if (this.editFormData.value.community_id) {
      this.editFormData.get('agency_id').reset()
    }
  }
  multiuncheckDropdown4() {
    this.editFormData.get('agency_id').reset()
  }
  uncheckDropdown3() {
    if (this.editFormData.value.agency_id) {
      this.editFormData.get('community_id').reset()
    }
  }
  multiuncheckDropdown3() {
    this.editFormData.get('community_id').reset()
  }


  get ec() {
    return this.editFormData.controls;
  }

  editSubmitted() {
    for (let item of Object.keys(this.ec)) {
      this.ec[item].markAsDirty()
    }
    if (!this.editFormData.value.phone_number ||
      !this.editFormData.value.email ||
      !this.editFormData.value.first_name ||
      !this.editFormData.value.last_name ||
      !this.editFormData.value.DOB ) {
      return;
    }

    if (this.currentUser.role == "SuperAdmin" || this.currentUser.role == "Admin") {
      if (this.editFormData.value?.community_id) {
        this.editFormData.value.community_id.forEach(element => {
          this.submitId.push(element.id)
        });
      } else if (this.editFormData.value?.agency_id) {
        this.editFormData.value?.agency_id.forEach(element => {
          this.submitId2.push(element.id)
        });
      }
      if (this.editFormData.value.community_id) {
        this.data2 = {
          phone_number: this.editFormData.value.phone_number?.replace(/\D/g, ''),
          email: this.editFormData.value.email,
          first_name: this.editFormData.value.first_name,
          last_name: this.editFormData.value.last_name,
          DOB: this.editFormData.value.DOB,
          // PIN_code: this.editFormData.value.PIN_code,
          management_Co: this.editFormData.value.management_Co ,
          management_co_user:  this.editFormData.value.management_co_user ,
          community_id: this.submitId,
        }
      }
      else if (this.editFormData.value.agency_id) {
        this.data3 = {
          phone_number: this.editFormData.value.phone_number?.replace(/\D/g, ''),
          email: this.editFormData.value.email,
          first_name: this.editFormData.value.first_name,
          last_name: this.editFormData.value.last_name,
          DOB: this.editFormData.value.DOB,
          PIN_code: this.editFormData.value.PIN_code,
          management_Co: this.editFormData.value.management_Co ,
          management_co_user:  this.editFormData.value.management_co_user ,
          agency_id: this.submitId2,
        }
      }

    } else if (this.currentUser.role == 'Agency') {
      this.data4 = {
        phone_number: this.editFormData.value.phone_number?.replace(/\D/g, ''),
        email: this.editFormData.value.email,
        first_name: this.editFormData.value.first_name,
        last_name: this.editFormData.value.last_name,
        DOB: this.editFormData.value.DOB,
        PIN_code: this.editFormData.value.PIN_code,
        management_Co: this.editFormData.value.management_Co ,
        management_co_user:  this.editFormData.value.management_co_user ,
        id: this.userEdit
      }
    } else if (this.currentUser.role == 'Community') {
      this.data6 = {
        phone_number: this.editFormData.value.phone_number?.replace(/\D/g, ''),
        email: this.editFormData.value.email,
        first_name: this.editFormData.value.first_name,
        last_name: this.editFormData.value.last_name,
        DOB: this.editFormData.value.DOB,
        PIN_code: this.editFormData.value.PIN_code,
        management_Co: this.editFormData.value.management_Co ,
        management_co_user:  this.editFormData.value.management_co_user ,
        id: this.userEdit
      }
    }
    this.btnShow = true;
    let is_for = this.currentUser.role == 'Agency' ? 'agency' : this.currentUser.role == 'Community' ? 'agency ' : 'superAdmin'
    this.dataService.editUser(this.currentUser.role == 'SuperAdmin' || this.currentUser.role == 'Admin' ? { ...this.editFormData.value.community_id ? this.data2 : this.data3, ...{ id: this.userEdit } } : this.currentUser.role == 'Community' ? this.data6 : this.data4, is_for).subscribe((res: any) => {
      if (!res.error) {
        // this.currenUserId = ''
        this.tost.successToastr(res.msg)
        this.loctn.back()
        this.btnShow = false;
      } else {
        this.btnShow = false;
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.api.genericErrorToaster()
      })
  }

  EditUser(row: any) {
    this.userEdit = row.id
    let is_for = 'user'
    this.userService.getUserById(row.id, is_for).subscribe((res: any) => {
      this.currenUserId = row
      console.log(this.currenUserId)
      if (!res.error) {
        this.editFormData.patchValue({
          DOB: res.body[0].DOB,
          first_name: res.body[0].first_name,
          last_name: res.body[0].last_name,
          email: res.body[0].email,
          phone_number: res.body[0].phone_number,
          PIN_code: res.body[0].PIN_code,
          management_Co: res.body[0].management_Co,
          management_co_user: res.body[0].management_co_user,
          // community_id: res.body[0].community_name,
          // agency_id: res.body[0].agency_id
        });
        setTimeout(() => {
          this.editFormData.get('phone_number').setValue(this.editFormData.value.phone_number)
        }, 100)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  goBack(){
    this.loctn.back()
  }

  getagenciesID() {
    this.dataService.agenciesID().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allAgenciesID = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.tost.errorToastr(response.msg);
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
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
  }
 
  getCmmntNm(){
    this.dataService.getMNMGcommunity(this.searchStr, this.page.pageNumber, this.page.size).subscribe((res: any) => {
      console.log(res)
      if (!res.error) {
        console.log(res)
        this.cmmntNames = res.body  
        // this.rows2.forEach(element => {
        //   this.cmmntNames.push(element)
        // });
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }


}
