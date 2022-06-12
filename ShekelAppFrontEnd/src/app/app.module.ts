import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AdminStartComponent } from './admin/admin-start/admin-start.component';
import { EditAdminComponent } from './admin/admin-start/edit-admin/edit-admin.component';
import { AdminService } from './admin/admin.service';
import { AdminStorageService } from './admin/admin.storage.service';
import { AllApartmentsNoCoordinatorDisplayComponent } from './admin/all-apartments-no-coordinator-display/all-apartments-no-coordinator-display.component';
import { AllCoordinatorsDisplayComponent } from './admin/all-coordinators-display/all-coordinators-display.component';
import { AllGuidesDisplayComponent } from './admin/all-guides-display/all-guides-display.component';
import { AllGuidesNoApartmentsDisplayComponent } from './admin/all-guides-no-apartments-display/all-guides-no-apartments-display.component';
import { AllTenantsDisplayComponent } from './admin/all-tenants-display/all-tenants-display.component';
import { AllTenantsNoApartmentDisplayComponent } from './admin/all-tenants-no-apartment-display/all-tenants-no-apartment-display.component';
import { AllWidthGuidesComponent } from './admin/all-width-guides/all-width-guides.component';
import { ApartmentEditComponent } from './apartment/apartment-edit/apartment-edit.component';
import { AdminApartmentDisplayComponent } from './apartment/apartments-list/admin-apartment-display/admin-apartment-display.component';
import { ApartmentsListComponent } from './apartment/apartments-list/apartments-list.component';
import { UserApartmentDisplayComponent } from './apartment/apartments-list/user-apartment-display/user-apartment-display.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChoreDetailsComponent } from './chores/chores-list/chore-details/chore-details.component';
import { ChoreEditComponent } from './chores/chores-list/chore-details/chore-edit/chore-edit.component';
import { ChoresListComponent } from './chores/chores-list/chores-list.component';
import { AbsServiceClass } from './common/AbcServiceClass';
import { ChangePasswordDisplayComponent } from './common/change-password-display/change-password-display.component';
import { GetUserTypeService } from './common/getUserTypeService';
import { LoadingPageComponent } from './common/loading-page/loading-page.component';
import { MultipleRolesComponent } from './common/multiple-roles/multiple-roles.component';
import { PrivateStringsForApp } from './common/PrivateStringsForApp';
import { ScreenMsgDisplayComponent } from './common/screen-msg-display/screen-msg-display.component';
import { UserEditComponent } from './common/user-edit/user-edit.component';
import { UserStartDisplayComponent } from './common/user-start-display/user-start-display.component';
import { UsersTenantsComponent } from './common/users-tenants/users-tenants.component';
import { CoordinatorReplacmentsApprovalTableComponent } from './coordinator/coordinator-start/coordinator-replacements-approval-table/coordinator-replacements-approval-table.component';
import { CoordinatorStartComponent } from './coordinator/coordinator-start/coordinator-start.component';
import { CoordinatorService } from './coordinator/coordinator.service';
import { CoordinatorStorageService } from './coordinator/coordinator.storage.service';
import { GuideStartComponent } from './guide/guide-start/guide-start.component';
import { GuideService } from './guide/guide.service';
import { GuideStorageService } from './guide/guide.storage.service';
import { GuideDetailsComponent } from './guide/guides-list/guide-details/guide-details.component';
import { GuidesListComponent } from './guide/guides-list/guides-list.component';
import { LoginService } from './login/login-service';
import { LoginStorageService } from './login/login-storage-service';
import { LoginComponent } from './login/login/login.component';
import { MedicineDetailsComponent } from './medicine/medicine-list/medicine-details/medicine-details.component';
import { MedicineEditComponent } from './medicine/medicine-list/medicine-details/medicine-edit/medicine-edit.component';
import { MedicineListComponent } from './medicine/medicine-list/medicine-list.component';
import { AddReplacementRequestOrOfferComponent } from './replacements/add-replacement-request-or-offer/add-replacement-request-or-offer.component';


import { ReplacementsTableComponent } from './replacements/replacements-table/replacements-table.component';
import { TenantDetailsComponent } from './tenant/tenants-list/tenant-details/tenant-details.component';
import { TenantEditComponent } from './tenant/tenants-list/tenant-details/tenant-edit/tenant-edit.component';
import { TenantsListComponent } from './tenant/tenants-list/tenants-list.component';
import { WidthGuideStartComponent } from './width-guide/width-guide-start/width-guide-start.component';
import { WidthGuideService } from './width-guide/width-guide.service';
import { WidthGuideStorageService } from './width-guide/width-guide.storage.service';

@NgModule({
  declarations: [
    AppComponent,
    CoordinatorStartComponent,
    GuideStartComponent,
    WidthGuideStartComponent,
    AdminStartComponent,
    LoginComponent,
    ApartmentsListComponent,
    UserApartmentDisplayComponent,
    AdminApartmentDisplayComponent,
    TenantsListComponent,
    TenantDetailsComponent,
    GuidesListComponent,
    GuideDetailsComponent,
    MedicineListComponent,
    MedicineDetailsComponent,
    ChoresListComponent,
    ChoreDetailsComponent,
    MedicineEditComponent,
    ApartmentEditComponent,
    ScreenMsgDisplayComponent,
    MultipleRolesComponent,
    AllGuidesDisplayComponent,
    ChoreEditComponent,
    TenantEditComponent,
    AllTenantsDisplayComponent,
    AllCoordinatorsDisplayComponent,
    AllWidthGuidesComponent,
    AllGuidesNoApartmentsDisplayComponent,
    AllTenantsNoApartmentDisplayComponent,
    AllApartmentsNoCoordinatorDisplayComponent,
    LoadingPageComponent,
    EditAdminComponent,
    UsersTenantsComponent,
    AddReplacementRequestOrOfferComponent,
    ReplacementsTableComponent,
    CoordinatorReplacmentsApprovalTableComponent,
    UserStartDisplayComponent,
    UserEditComponent,
    ChangePasswordDisplayComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    PrivateStringsForApp,
    AdminService,
    AdminStorageService,
    CoordinatorService,
    CoordinatorStorageService,
    WidthGuideService,
    WidthGuideStorageService,
    GuideService,
    GuideStorageService,
    LoginService,
    LoginStorageService,
    GetUserTypeService,
    { provide: 'AbcServiceClass', useValue: AbsServiceClass },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
