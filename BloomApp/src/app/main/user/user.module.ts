

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AuthGuard } from 'app/auth/helpers';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

const routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [AuthGuard],
  },{
    path: 'add-user',
    component: AddUserComponent,
    canActivate: [AuthGuard],
  },{
    path: 'edit-user',
    component: EditUserComponent,
    canActivate: [AuthGuard],
  },
];



@NgModule({
  declarations: [UserComponent, AddUserComponent, EditUserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    SharedpipeModule,
    PhoneMaskDirectiveModule,
    NgxDatatableModule,
    ContentHeaderModule,
    NgMultiSelectDropDownModule.forRoot()
  ] 
 
})
export class UserModule { }
