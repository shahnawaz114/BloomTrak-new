import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';
import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { coreConfig } from 'app/app-config';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { fakeBackendProvider } from 'app/auth/helpers'; // used to create fake backend
import { JwtInterceptor, ErrorInterceptor } from 'app/auth/helpers';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ContextMenuComponent } from 'app/main/extensions/context-menu/context-menu.component';
import { AnimatedCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/animated-custom-context-menu/animated-custom-context-menu.component';
import { BasicCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/basic-custom-context-menu/basic-custom-context-menu.component';
import { SubMenuCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/sub-menu-custom-context-menu/sub-menu-custom-context-menu.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { ProfileUserComponent } from './main/profile-user/profile-user.component';
import { ProjectProfileComponent } from './main/project-profile/project-profile.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import { SharedpipeModule } from '../app/auth/helpers/sharedpipe/sharedpipe.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/authentication/authentication.module').then(m => m.AuthenticationModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'components',
    loadChildren: () => import('./main/components/components.module').then(m => m.ComponentsModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'user-profile',
    loadChildren: () => import('./main/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'community',
    loadChildren: () => import('./main/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'agency',
    loadChildren: () => import('./main/agency/agency.module').then(m => m.AgencyModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'contracts',
    loadChildren: () => import('./main/contracts/contracts.module').then(m => m.ContractsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./main/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'project',
    loadChildren: () => import('./main/project/project.module').then(m => m.ProjectModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'profile/:id',
    loadChildren: () => import('./main/profile/my-account.module').then(m => m.MyAccountModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'projectProfile/:id',
    loadChildren: () => import('./main/project-profile/project-profile.module').then(m => m.ProjectProfileModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'userProfile/:id',
    loadChildren: () => import('./main/profile-user/profile-user.module').then(m => m.ProfileUserModule),
    canActivate: [AuthGuard]
  },
  

  {
    path: 'agencyProfile/:id',
    loadChildren: () => import('./main/profile-agency/my-profile.module').then(mp => mp.MyProfileModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'contractProfile/:id',
    loadChildren: () => import('./main/contract-profile/my-contract.module').then(mp => mp.MyContractModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'calender',
    loadChildren: () => import('./main/shared-calender/shared-calender.module').then(mp => mp.SharedCalenderModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'shift',
    loadChildren: () => import('./main/shift/shift.module').then(mp => mp.ShiftModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'management',
    loadChildren: () => import('./main/add-management/add-management.module').then(mp => mp.AddManagementModule),
    canActivate: [AuthGuard]
  },



  // {
  //   path: 'drivers',
  //   loadChildren: () => import('./main/drivers/drivers.module').then(m => m.DrivesModule),
  //   canActivate: [AuthGuard]
  // },  
  {
    path: '**',
    loadChildren: () => import('./main/miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule),
  }

];

@NgModule({
  declarations: [
    AppComponent,
    ContextMenuComponent,
    BasicCustomContextMenuComponent,
    AnimatedCustomContextMenuComponent,
    SubMenuCustomContextMenuComponent,
    ProfileUserComponent,
  //  ContractProfileComponent,
    ProjectProfileComponent,
  // ManagementComponent,
  
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgImageFullscreenViewModule,
    SharedpipeModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    NgbModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
    ContextMenuModule,
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    CardSnippetModule,
    LayoutModule,
    ContentHeaderModule,
    NgxMaskModule.forRoot(),
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend, comment while using real api
    fakeBackendProvider
  ],
  entryComponents: [BasicCustomContextMenuComponent, AnimatedCustomContextMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
