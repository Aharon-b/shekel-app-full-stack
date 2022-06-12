import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminStartComponent } from './admin/admin-start/admin-start.component';
import { AllApartmentsNoCoordinatorDisplayComponent } from './admin/all-apartments-no-coordinator-display/all-apartments-no-coordinator-display.component';
import { AllCoordinatorsDisplayComponent } from './admin/all-coordinators-display/all-coordinators-display.component';
import { AllGuidesDisplayComponent } from './admin/all-guides-display/all-guides-display.component';
import { AllGuidesNoApartmentsDisplayComponent } from './admin/all-guides-no-apartments-display/all-guides-no-apartments-display.component';
import { AllTenantsDisplayComponent } from './admin/all-tenants-display/all-tenants-display.component';
import { AllTenantsNoApartmentDisplayComponent } from './admin/all-tenants-no-apartment-display/all-tenants-no-apartment-display.component';
import { AllWidthGuidesComponent } from './admin/all-width-guides/all-width-guides.component';
import { ApartmentEditComponent } from './apartment/apartment-edit/apartment-edit.component';
import { ApartmentsListComponent } from './apartment/apartments-list/apartments-list.component';
import { ChoreEditComponent } from './chores/chores-list/chore-details/chore-edit/chore-edit.component';
import { ChangePasswordDisplayComponent } from './common/change-password-display/change-password-display.component';
import { CoordinatorStartComponent } from './coordinator/coordinator-start/coordinator-start.component';
import { MultipleRolesComponent } from './common/multiple-roles/multiple-roles.component';
import { UserEditComponent } from './common/user-edit/user-edit.component';
import { GuideStartComponent } from './guide/guide-start/guide-start.component';
import { GuidesListComponent } from './guide/guides-list/guides-list.component';
import { LoginComponent } from './login/login/login.component';
import { MedicineEditComponent } from './medicine/medicine-list/medicine-details/medicine-edit/medicine-edit.component';
import { ReplacementsTableComponent } from './replacements/replacements-table/replacements-table.component';
import { TenantDetailsComponent } from './tenant/tenants-list/tenant-details/tenant-details.component';
import { TenantEditComponent } from './tenant/tenants-list/tenant-details/tenant-edit/tenant-edit.component';
import { TenantsListComponent } from './tenant/tenants-list/tenants-list.component';
import { WidthGuideStartComponent } from './width-guide/width-guide-start/width-guide-start.component';


const routes: Routes = [
  // localhost:4200/
  { path: "", redirectTo: "/login", pathMatch: "full" },
  // localhost:4200/login
  { path: "login", component: LoginComponent },
  // localhost:4200/multiple-roles
  { path: "multiple-roles", component: MultipleRolesComponent },
  // localhost:4200/update-user-details
  { path: "update-user-details", component: UserEditComponent },
  {
    // localhost:4200/admin
    path: "admin", component: AdminStartComponent, children: [
      { path: "", component: ApartmentsListComponent, pathMatch: "full" },
      // localhost:4200/admin/all-apartments-in-system
      { path: "all-apartments-in-system", component: ApartmentsListComponent },
      // localhost:4200/admin/all-tenants-in-system
      { path: "all-tenants-in-system", component: AllTenantsDisplayComponent },
      // localhost:4200/admin/all-guides-in-system
      { path: "all-guides-in-system", component: AllGuidesDisplayComponent },
      // localhost:4200/admin/all-coordinators-in-system
      { path: "all-coordinators-in-system", component: AllCoordinatorsDisplayComponent },
      // localhost:4200/admin/all-width-guides-in-system
      { path: "all-width-guides-in-system", component: AllWidthGuidesComponent },
      // localhost:4200/admin/all-guides-no-apartments-in-system
      { path: "all-guides-no-apartments-in-system", component: AllGuidesNoApartmentsDisplayComponent },
      // localhost:4200/admin/all-tenants-no-apartments-in-system
      { path: "all-tenants-no-apartment-in-system", component: AllTenantsNoApartmentDisplayComponent },
      // localhost:4200/admin/all-tenant-no-apartments-in-system
      { path: "all-apartments-no-coordinator-in-system", component: AllApartmentsNoCoordinatorDisplayComponent },
      // localhost:4200/admin/coordinator-edit
      { path: "coordinator-edit", component: UserEditComponent },
      // localhost:4200/admin/tenant-edit
      { path: "tenant-edit", component: TenantEditComponent },
      // localhost:4200/admin/guide-edit
      { path: "guide-edit", component: UserEditComponent },
      // localhost:4200/admin/apartment-edit
      { path: "apartment-edit", component: ApartmentEditComponent },
      // localhost:4200/admin/width-guide-edit
      { path: "width-guide-edit", component: UserEditComponent }
    ]
  },

  {
    // localhost:4200/coordinator
    path: "coordinator", component: CoordinatorStartComponent, children: [
      // localhost:4200/coordinator/
      { path: "", component: ApartmentsListComponent, pathMatch: "full" },
      // localhost:4200/coordinator/change-coordinator-password
      { path: "change-coordinator-password", component: ChangePasswordDisplayComponent },
      // localhost:4200/coordinator/apartment-edit
      { path: "apartment-edit", component: ApartmentEditComponent },

      // localhost:4200/coordinator/apartment-display/
      {
        path: "apartment-display", component: TenantsListComponent, children: [
          // localhost:4200/coordinator/apartment-display/apartment-guides
          { path: "apartment-guides", component: GuidesListComponent },]
      },
      // localhost:4200/coordinator/tenant-details
      { path: "tenant-details", component: TenantDetailsComponent },
      // localhost:4200/coordinator/medicine-edit
      { path: "medicine-edit", component: MedicineEditComponent },
      // localhost:4200/coordinator/chore-edit
      { path: "chore-edit", component: ChoreEditComponent },
      // localhost:4200/coordinator/tenant-edit
      { path: "tenant-edit", component: TenantEditComponent },

    ]
  },

  {
    // localhost:4200/width-guide
    path: "width-guide", component: WidthGuideStartComponent, children: [
      // localhost:4200/width-guide/
      { path: "", component: ApartmentsListComponent, pathMatch: "full" },
      // localhost:4200/width-guide/change-width-guide-password
      { path: "change-width-guide-password", component: ChangePasswordDisplayComponent },
      // localhost:4200/width-guide/apartment-display
      {
        path: "apartment-display", component: TenantsListComponent, children: [
          // localhost:4200/width-guide/apartment-guides
          { path: "apartment-guides", component: GuidesListComponent },
        ]
      },
      // localhost:4200/width-guide/medicine-edit
      { path: "medicine-edit", component: MedicineEditComponent },
      // localhost:4200/width-guide/chore-edit
      { path: "chore-edit", component: ChoreEditComponent },
      // localhost:4200/width-guide/tenant-details
      { path: "tenant-details", component: TenantDetailsComponent },
    ]
  },

  {
    // localhost:4200/guide
    path: "guide", component: GuideStartComponent, children: [
      // localhost:4200/guide/
      { path: "", component: ApartmentsListComponent, pathMatch: "full" },
      // localhost:4200/guide/change-guide-password
      { path: "change-guide-password", component: ChangePasswordDisplayComponent },
      // localhost:4200/guide/apartment-display
      { path: "apartment-display", component: TenantsListComponent },
      // localhost:4200/guide/apartment-display/replacement
      { path: "apartment-display/replacement", component: TenantsListComponent },
      // localhost:4200/guide/tenant-details
      { path: "tenant-details", component: TenantDetailsComponent },
      // localhost:4200/guide/request-page
      { path: "replacements-page", component: ReplacementsTableComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
