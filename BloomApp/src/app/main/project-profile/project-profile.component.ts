import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { Patterns } from '../authentication/register/helpers/patterns';

@Component({
  selector: 'app-project-profile',
  templateUrl: './project-profile.component.html',
  styleUrls: ['./project-profile.component.scss']
})
export class ProjectProfileComponent implements OnInit {
  formData!: FormGroup;
  btnShow:boolean = false;
  userId: any;
  loading: boolean;
  curComDetails: any;
  error: any;
  public contentHeader: object;
  public currentUser: User;
  imageObject: any[] = [];
  sd2: any;
  ed2: any;
  constructor(
    private fb: FormBuilder,
    private aCtRoute: ActivatedRoute,
    private _userService : UserService,
    private auth :AuthenticationService
  ) { 
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.userId = res.id;
          this.getuserDetails();
        }
      }
    )
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Project',
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
            name: 'Project',
            isLink: true,
            link: '/project'
          },
          {
            name: 'Project profile',
            isLink: false
          }
        ]
      }
    };

    this.formData = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      budget: ['', [Validators.required,Validators.pattern(Patterns.number)]],
      start_date: ['', [Validators.required]],
      end_date: ['', Validators.required],

    })
  }

  submitted(){

  }

  getuserDetails() {
    this.loading = true;
    let id = this.userId;
    this._userService.getProjectById(id).subscribe(response => {
      console.log(response)
      if (!response.error) {

        if (response.body && response.body[0] && response.body[0]) {
          this.curComDetails = response.body[0];
          let sd = response.body[0].start_date
      let ed = response.body[0].end_date
      this.sd2 = sd.split('T')
      this.ed2 = ed.split('T')
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

  get controls() {
    return this.formData.controls;
  }

  mapFormValues(){
    this.formData.patchValue({
      title: this.curComDetails.title,
      description: this.curComDetails.description,
      budget: this.curComDetails.budget,
      start_date: this.sd2[0],
      end_date: this.ed2[0],
    });

  }
  

}
