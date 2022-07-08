import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyComponent } from './agency/agency.component';
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
import { AddAgencyComponent } from './add-agency/add-agency.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { EditAgencyComponent } from './edit-agency/edit-agency.component';

const routes = [
  {
    path: '',
    component: AgencyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-agency',
    component: AddAgencyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-agency',
    component: EditAgencyComponent,
    canActivate: [AuthGuard],
  },
];



@NgModule({
  declarations: [AgencyComponent, AddAgencyComponent, EditAgencyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    PhoneMaskDirectiveModule,
    SharedpipeModule,
    NgxDatatableModule,
    ContentHeaderModule,

  ] 
 
})
export class AgencyModule { }
