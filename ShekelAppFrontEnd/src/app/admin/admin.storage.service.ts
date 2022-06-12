import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apartment } from '../apartment/apartment.modules';
import { PrivateStringsForApp } from '../common/PrivateStringsForApp';
import { Coordinator } from '../coordinator/coordinator.modules';
import { Guide } from '../guide/guide.modules';
import { Tenant } from '../tenant/tenant.modules';
import { WidthGuide } from '../width-guide/width-guide-modules';

@Injectable()
// Admin type storage service class.
export class AdminStorageService {
  // The main url of the backend.
  private mainUrl: string = PrivateStringsForApp.getAdminMainUrl()
  // Token for actions of the user in the system.
  private token: string = PrivateStringsForApp.getEmptyString()

  constructor(private http: HttpClient) { }
  // On admins functions : 

  // This function is returning success/error message after adding a new admin to the system. 
  addAdminToSystem(username: string): Observable<string> {
    return this.http.post(this.mainUrl + "/new-admin", username,
      { headers: { 'Authorization': this.token }, responseType: 'text' })
  }

  // This function is returning success/error message after updating admin's details in the system.
  updateAdminDetails(username: string, password: string): Observable<string> {
    return this.http.post(this.mainUrl + "/update-admin-details", username,
      {
        headers: { 'Authorization': this.token }, params: { "password": password },
        responseType: 'text'
      })
  }

  // This function is returning success/error message after updating new admin's default password in the system.
  changeAdminPassword(password: string): Observable<string> {
    return this.http.post("http://localhost:8080/api/user-password-change", password,
      { headers: { 'Authorization': this.token }, responseType: 'text' })
  }

  // This function is returning the current admin's email(username) from the system.
  getAdminUsername(): Observable<string> {
    return this.http.post(this.mainUrl + "/admin-username", {}, {
      headers: { 'Authorization': this.token },
      responseType: 'text'
    })
  }

  // This function is returning success/error message after deleting admin's account from the system.
  deleteAdminAccountFromSystem(): Observable<string> {
    return this.http.delete(this.mainUrl + "/delete-admin-account-from-system",
      { headers: { 'Authorization': this.token }, responseType: 'text' })
  }

  // On coordinators functions:

  // This function is returning the new Coordinator object after adding it to the system.
  createNewCoordinator(coordinator: Coordinator, filename: File): Observable<Coordinator> {
    return this.http.post<Coordinator>(this.mainUrl + "/new-coordinator",
      this.setFormDataObject(PrivateStringsForApp.getCoordinatorEnglishString(), filename, coordinator),
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning all the coordinators in the system inside array object.
  getAllCoordinators(): Observable<Coordinator[]> {
    return this.http.post<Coordinator[]>(this.mainUrl + "/all-coordinators", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning coordinator's apartments from the system inside array object.
  getCoordinatorApartments(coordinatorId: number): Observable<Apartment[]> {
    return this.http.post<Apartment[]>(this.mainUrl + "/coordinator-apartments", coordinatorId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning the Apartment object after adding it to coordinator's apartments list.
  addCoordinatorToApartment(apartmentId: number, coordinator: Coordinator): Observable<Apartment> {
    return this.http.post<Apartment>(this.mainUrl + "/add-apartment-to-coordinator", coordinator,
      { headers: { 'Authorization': this.token }, params: { "apartmentId": apartmentId.toString() } })
  }

  // This function is returning all the coordinators in the system with no width-guide inside array object.
  getAllCoordinatorsNoWidthGuide(): Observable<Coordinator[]> {
    return this.http.post<Coordinator[]>(this.mainUrl + "/all-coordinators-no-width-guide", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning success/error message after deleting coordinator's account from the system.
  deleteCoordinatorFromSystem(coordinatorId: number): Observable<string> {
    return this.http.delete(this.mainUrl + "/delete-coordinator-from-system",
      {
        headers: { 'Authorization': this.token }, params: { "coordinatorId": coordinatorId.toString() },
        responseType: 'text'
      })
  }

  // On width-guides functions:

  // This function is returning the new WidthGuide object after adding it to the system.
  addNewWidthGuide(widthGuide: WidthGuide, coordinatorId: number): Observable<WidthGuide> {
    return this.http.post<WidthGuide>(this.mainUrl + "/add-new-width-guide", widthGuide,
      { headers: { 'Authorization': this.token }, params: { "coordinatorId": coordinatorId.toString() } })
  }

  // This function is returning all the width-guides in the system inside array object.
  getAllWidthGuides(): Observable<WidthGuide[]> {
    return this.http.post<WidthGuide[]>(this.mainUrl + "/all-width-guides", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning width-guide coordinator from the system.
  getWidthGuideCoordinator(widthGuideId: number): Observable<Coordinator> {
    return this.http.post<Coordinator>(this.mainUrl + "/width-guide-coordinator", widthGuideId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning WidthGuide from the system after adding to Guide from the system 'WIDTH_GUIDE' role .
  addGuideAsWidthGuide(coordinatorId: number, guide: Guide, phoneNumber: string): Observable<WidthGuide> {
    return this.http.post<WidthGuide>(this.mainUrl + "/add-width-guide-from-guides", guide,
      {
        headers: { 'Authorization': this.token },
        params: { "coordinatorId": coordinatorId.toString(), "phoneNumber": phoneNumber }
      })
  }

  // This function is returning success/error message after deleting width-guide's account from the system.
  deleteWidthGuideFromSystem(widthGuideId: number): Observable<string> {
    return this.http.delete(this.mainUrl + "/delete-width-guide-from-system",
      {
        headers: { 'Authorization': this.token },
        params: { "widthGuideId": widthGuideId.toString() }, responseType: 'text'
      })
  }

  // On guides functions:

  // This function is returning the new Guide object after adding it to the system.
  createNewGuide(guide: Guide, filename: File): Observable<Guide> {
    return this.http.post<Guide>(this.mainUrl + "/new-guide",
      this.setFormDataObject(PrivateStringsForApp.getGuideEnglishString(), filename, guide),
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning all the guides in the system inside array object.
  getAllGuidesInTheSystem(): Observable<Guide[]> {
    return this.http.post<Guide[]>(this.mainUrl + "/all-guides", {}, { headers: { 'Authorization': this.token } })
  }

  // This function is returning guide's apartments from the system inside array object.
  getGuideApartments(guideId: number): Observable<Apartment[]> {
    return this.http.post<Apartment[]>(this.mainUrl + "/guide-apartments", guideId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning all the guides in the system with no apartments inside array object.
  getAllGuideWithNoApartments(): Observable<Guide[]> {
    return this.http.post<Guide[]>(this.mainUrl + "/all-guides-no-apartment", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning success adding guide to apartment's guides array message.
  addApartmentToGuide(guideId: number, apartmentId: number): Observable<Apartment> {
    return this.http.post<Apartment>(this.mainUrl + "/add-guide-to-apartment", guideId, {
      headers: { 'Authorization': this.token }, params: {
        "apartmentId": apartmentId.toString()
      }
    })
  }

  // This function is returning all the guides in the system with no 'WIDTH_GUIDE' role inside array object.
  getAllGuidesThatAreNotWidthGuides(): Observable<Guide[]> {
    return this.http.post<Guide[]>(this.mainUrl + "/all-guides-one-role", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning success/error message after deleting guide's account from the system.
  deleteGuideFromSystem(guideId: number): Observable<string> {
    return this.http.delete(this.mainUrl + "/delete-guide-from-system",
      {
        headers: { 'Authorization': this.token },
        params: { "guideId": guideId.toString() }, responseType: 'text'
      })
  }

  // On Apartments functions:

  // This function is returning the new Apartment object after adding it to the system.
  createNewApartment(apartment: Apartment, filename: File): Observable<Apartment> {
    return this.http.post<Apartment>(this.mainUrl + "/new-apartment",
      this.setFormDataObject(PrivateStringsForApp.getApartmentEnglishString(), filename, apartment),
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning all the apartment's in the system inside array object.
  getAllApartments(): Observable<Apartment[]> {
    return this.http.post<Apartment[]>(this.mainUrl + "/all-apartments", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning all the apartments in the system with the same gender as tenant inside array object.
  getSystemApartments(tenant: Tenant): Observable<Apartment[]> {
    return this.http.post<Apartment[]>(this.mainUrl + "/tenant-gender-apartments", tenant,
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning the Apartment object after adding new tenant to apartment's tenants list.
  addTenantToApartment(tenantId: number, apartmentId: number): Observable<Apartment> {
    return this.http.post<Apartment>(this.mainUrl + "/add-tenant-to-apartment", tenantId, {
      headers: { 'Authorization': this.token }, params: { "apartmentId": apartmentId.toString() }
    })
  }

  // This function is returning all the apartments in the system with no coordinator inside array object.
  getAllApartmentsWithNoCoordinator(): Observable<Apartment[]> {
    return this.http.post<Apartment[]>(this.mainUrl + "/all-apartments-no-coordinator", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning success/error message after deleting Apartment object from the system.
  deleteApartmentFromSystem(apartmentId: number): Observable<string> {
    return this.http.delete(this.mainUrl + "/delete-apartment-from-system",
      {
        headers: { 'Authorization': this.token },
        params: { "apartmentId": apartmentId.toString() }, responseType: 'text'
      })
  }

  // On tenants functions:

  // This function is returning the new Tenant object after adding it to the system.
  createNewTenant(tenant: Tenant, filename: File): Observable<Tenant> {
    return this.http.post<Tenant>(this.mainUrl + "/new-tenant",
      this.setFormDataObject(PrivateStringsForApp.getTenantEnglishString(), filename, tenant),
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning all the tenants in the system inside array object.
  getAllTenants(): Observable<Tenant[]> {
    return this.http.post<Tenant[]>(this.mainUrl + "/all-tenants", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning all the tenants in the system with no apartment inside array object.
  getAllTenantsWithNoApartment(): Observable<Tenant[]> {
    return this.http.post<Tenant[]>(this.mainUrl + "/all-tenants-no-apartment", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is returning tenant's apartment from the system.
  getTenantApartmentName(tenantId: number): Observable<string> {
    return this.http.post(this.mainUrl + "/tenant-apartment", tenantId,
      { headers: { 'Authorization': this.token }, responseType: 'text' })
  }

  // This function is returning success/error message after deleting Tenant object from the system.
  deleteTenantFromSystem(tenantId: number): Observable<string> {
    return this.http.delete(this.mainUrl + "/delete-tenant-from-system",
      { headers: { 'Authorization': this.token }, params: { "tenantId": tenantId.toString() }, responseType: 'text' })
  }

  // Help functions:

  // This function is returning the default image file as blob object for all adding objects with 'image file' field. 
  setDefaultImageFile() {
    return this.http.get(PrivateStringsForApp.getDefaultAssetsString(), { responseType: 'blob' })
  }

  setToken(token: string): void {
    this.token = token
  }

  // This function is for setting new/updated objects with image byte array field 
  // as a FormData object for for the back-end.
  private setFormDataObject(objectType: string, filename: File, object: any): FormData {
    const uploadData = new FormData();
    uploadData.append(PrivateStringsForApp.getImagefileString(), filename, filename.name);
    uploadData.append(objectType, JSON.stringify(object))
    return uploadData
  }

}