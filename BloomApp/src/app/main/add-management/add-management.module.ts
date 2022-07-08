import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddManagementComponent } from './add-management.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { EditManagementComponent } from './edit-management/edit-management.component';
import { Add2ManagementComponent } from './add2-management/add2-management.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

const routes = [
  {
    path: '',
    component: AddManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-management',
    component: Add2ManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-management',
    component: EditManagementComponent,
    canActivate: [AuthGuard],
  },
];


@NgModule({
  declarations: [
    AddManagementComponent,
    EditManagementComponent,
    Add2ManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule,
    SharedpipeModule,
    PhoneMaskDirectiveModule,
    ContentHeaderModule

  ] 
})
export class AddManagementModule { }
