import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  formData!: FormGroup;
  currentUser: any;
  crrntUsrId: any[] = []
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
  public contentHeader: object;
  allCommunity: any = [];
  searchStr: string = '';
  public page = new Page();
  rows2: any = []
  cmmntNames: any= [];
  allAgenciesID: any = [];
  rows1: any = []
  mngmNames: any= [];

  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;

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
    private tost: ToastrManager,
    private dataService: DataService,
    private api: ApiService,
    private loctn : Location
  ) { 

    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      this.crrntUsrId.push(this.currentUser?.role == 'Admin' ?  x?._id : x?.id)
      console.log('crrntUsrId',this.currentUser)
    });
  }

  ngOnInit(): void {
    this.getDate()
    this.getCommunityId()
    this.getCmmntNm()
    this.getagenciesID()
    this.getManagementNames()
    this.formData = this.fb.group({
      DOB: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      // PIN_code: ['', Validators.required],
      community_id: ['',Validators.required],
      agency_id: [''],
      management_Co: [''],
      management_co_user: ['',Validators.required],
      password: ['',Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      cnfrmpassword:  ['', [Validators.required]]
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },
     
    )

    this.contentHeader = {
      headerTitle: this.currentUser.role == 'Agency' ? 'Agency Personnel' : 'Add User',
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


  uncheckDropdown1() {
    if (this.formData.value.community_id) {
      this.formData.get('agency_id').reset()
    }
  }
  multiuncheckDropdown1() {
    this.formData.get('agency_id').reset()
  }
  uncheckDropdown2() {
    if (this.formData.value.agency_id) {
      this.formData.get('community_id').reset()
    }
  }
  multiuncheckDropdown2() {
    this.formData.get('community_id').reset()
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

get controls() {
    return this.formData.controls;
  }
  submitted() {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if ( this.controls.cnfrmpassword.status == "INVALID") {
      return;
    }

    if (this.currentUser.role == "SuperAdmin" || this.currentUser.role == "Admin") {
      if (this.formData.value.community_id) {
        this.formData.value.community_id?.forEach(element => {
          this.submitId.push(element.id)
        });
      } else {
        this.formData.value.agency_id?.forEach(element => {
          this.submitId2.push(element.id)
        });
      }

      if (this.formData.value.community_id) {
        if(this.formData.value.management_co_user == '0'){
          this.data = {
            phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
            email: this.formData.value.email,
            first_name: this.formData.value.first_name,
            last_name: this.formData.value.last_name,
            DOB: this.formData.value.DOB,
            // PIN_code: this.formData.value.PIN_code,
            community_id: this.formData.value.community_id ? this.submitId : '',
            password: this.formData.value.password,
            management_Co: this.formData.value.management_Co ,
            management_co_user:  this.formData.value.management_co_user ,
            management_id : this.currentUser._id
          }
        }else{
          this.data = {
            phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
            email: this.formData.value.email,
            first_name: this.formData.value.first_name,
            last_name: this.formData.value.last_name,
            DOB: this.formData.value.DOB,
            // PIN_code: this.formData.value.PIN_code,
            community_id: this.formData.value.community_id ? this.submitId : '',
            password: this.formData.value.password,
            management_Co: this.formData.value.management_Co ,
            management_co_user:  this.formData.value.management_co_user ,
            management_id : ''
          }
        }
      
      }
      else if (this.formData.value.agency_id) {
       
        this.data1 = {
          phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
          email: this.formData.value.email,
          first_name: this.formData.value.first_name,
          last_name: this.formData.value.last_name,
          DOB: this.formData.value.DOB,
          // PIN_code: this.formData.value.PIN_code,
          management_Co: this.formData.value.management_Co ,
          management_co_user:  this.formData.value.management_co_user ,
          agency_id: this.formData.value.agency_id ? this.submitId2 : '',
          password: this.formData.value.password,
        }
      }
    }
    else if (this.currentUser.role == 'Agency') {
      this.data4 = {
        phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
        email: this.formData.value.email,
        first_name: this.formData.value.first_name,
        last_name: this.formData.value.last_name,
        DOB: this.formData.value.DOB,
        // PIN_code: this.formData.value.PIN_code,
        management_Co: this.formData.value.management_Co ,
        management_co_user:  this.formData.value.management_co_user ,
        password: this.formData.value.password,
        agency_id: this.crrntUsrId
      }
    } else if (this.currentUser.role == 'Community') {
      this.data5 = {
        phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
        email: this.formData.value.email,
        first_name: this.formData.value.first_name,
        last_name: this.formData.value.last_name,
        DOB: this.formData.value.DOB,
        password: this.formData.value.password,
        management_co_user:  this.formData.value.management_co_user ,
        community_id: this.currentUser.id
      }
    }
    this.btnShow = true;

    let body = this.currentUser.role == "SuperAdmin" || this.currentUser.role == "Admin" ? this.formData.value.community_id ? this.data : this.data1 : this.currentUser.role == "Community" ? this.data5 : this.data4
    console.warn(body)
    this.dataService.addUser(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.submitId = []
        this.submitId2 = []
        this.btnShow = false;
        this.loctn.back()
      } else {
        this.btnShow = false;
        this.submitId = []
        this.submitId2 = []
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.submitId = []
        this.submitId2 = []
        this.api.genericErrorToaster()

      })
  }
  goBack(){
    this.loctn.back()
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

  getManagementNames(){
    if(this.currentUser.role == 'SuperAdmin'){
      this.dataService.getManagementNames().subscribe(res => {
        if (!res.error) {
          this.mngmNames = res.body;
          // this.rows1.forEach(element => {
          //   this.mngmNames.push(element)
          // });
          // console.log('Management Names',this.mngmNames)
        }})}
      }
  
}
