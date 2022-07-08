import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftComponent } from './shift.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ShiftPostingComponent } from './shift-posting/shift-posting.component';
import { ShiftConfirmationComponent } from './shift-confirmation/shift-confirmation.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { SharedCalenderComponent } from '../shared-calender/shared-calender.component';
import { SharedCalenderModule } from '../shared-calender/shared-calender.module';
import { ViewCardComponent } from './view-card/view-card.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CustomDateTimePipe } from 'app/auth/helpers/custom-date-time.pipe';
import { CustomTimePipe } from 'app/auth/helpers/custom-time.pipe';
import { EditShiftComponent } from './edit-shift/edit-shift.component';

const routes = [
  {
    path: '',
    component: ShiftComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shift-posting',
    component: ShiftPostingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shift-confirmation',
    component: ShiftConfirmationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shared-calender',
    component: SharedCalenderComponent,
    canActivate: [AuthGuard],
  },{
    path: 'view-card',
    component: ViewCardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-shift',
    component: EditShiftComponent,
    canActivate: [AuthGuard],
  },
  
];

@NgModule({
  declarations: [
    ShiftComponent,
     ShiftPostingComponent,
      ShiftConfirmationComponent, 
      ViewCardComponent,
      CustomDateTimePipe,
        CustomTimePipe,
        EditShiftComponent,

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
    NgMultiSelectDropDownModule.forRoot(),
    ContentHeaderModule,
    SharedCalenderModule

   
  ]
})
export class ShiftModule { }
