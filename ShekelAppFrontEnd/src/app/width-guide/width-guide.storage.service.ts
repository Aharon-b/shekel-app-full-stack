import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Byte } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Apartment } from '../apartment/apartment.modules';
import { Chore } from '../chores/chores.modules';
import { PrivateStringsForApp } from '../common/PrivateStringsForApp';
import { Guide } from '../guide/guide.modules';
import { Medicine } from '../medicine/medicine-list/medicine.modules';
import { Replacement } from '../replacements/replacement.modules';
import { Tenant } from '../tenant/tenant.modules';
import { WidthGuide } from './width-guide-modules';

@Injectable()
// WidthGuide type storage service class.
export class WidthGuideStorageService {
  // The main url of the backend.
  private mainUrl: string = PrivateStringsForApp.getUserMainUrl()
  // Token for actions of the user in the system.
  private token: string = PrivateStringsForApp.getEmptyString()

  constructor(private http: HttpClient) { }

  // WidthGuide functions:

  // This function is for getting user type WidthGuide details from the system.
  getWidthGuideDetails(token: string) {
    this.token = token
    const headers = new HttpHeaders().set("Authorization", token)
    return this.http.get<WidthGuide>(this.mainUrl + "width-guide-details", { headers })
  }

  // This function is for updating user type WidthGuide details in the system.
  updateWidthGuideDetails(widthGuide: WidthGuide) {
    return this.http.post<WidthGuide>(this.mainUrl + "update-width_guide-details", widthGuide, { headers: { 'Authorization': this.token } })
  }

  // This function is for updating user type WidthGuide password in the system.
  changeWidthGuidePassword(password: string) {
    return this.http.post(this.mainUrl + "user-password-change", password, { headers: { 'Authorization': this.token }, responseType: 'text' })
  }

  // This function is for getting user type WidthGuide apartments array from the system.
  getWidthGuideApartments() {
    return this.http.post<Apartment[]>(this.mainUrl + "width-guide-apartments", {}, { headers: { 'Authorization': this.token } })
  }

  // This function is for getting user type WidthGuide tenants array from the system.
  getWidthGuideTenants() {
    return this.http.post<Tenant[]>(this.mainUrl + "width-guide-tenants", {}, { headers: { 'Authorization': this.token } })
  }

  // Apartment functions:

  // This function is for adding replacement to the system.
  addApartmentReplacementFromWidthGuide_sCoordinatorApartmentsToSystem(replacementRequest: Replacement) {
    return this.http.post<Replacement>(this.mainUrl + "add-replacement-request-no-guide", replacementRequest, { headers: { 'Authorization': this.token } })
  }

  // This function is for getting user type WidthGuide each apartment tenants array from the system.
  getApartmentTenants(apartmentId: number) {
    return this.http.post<Tenant[]>(this.mainUrl + "apartment-tenants", apartmentId, { headers: { 'Authorization': this.token } })
  }

  // This function is for getting user type WidthGuide each apartment image byte array from the system.
  getApartmentImage(apartmentId: number) {
    return this.http.post<Byte[]>(this.mainUrl + "apartment-image", apartmentId, { headers: { 'Authorization': this.token } })
  }

  // This function is for getting user type WidthGuide each apartment guides array from the system.
  getApartmentGuides(apartmentId: number) {
    return this.http.post<Guide[]>(this.mainUrl + "all-apartment-guides", apartmentId, { headers: { 'Authorization': this.token } })
  }

  // Tenant functions:

  // This function is for getting tenant's medicine array from the system.
  getTenantMedicineArray(tenantId: number) {
    return this.http.post<Medicine[]>(this.mainUrl + "tenant-medicines", tenantId, { headers: { 'Authorization': this.token } })
  }

  // This function is for getting tenant's chores array from the system.
  getTenantChoresArray(tenantId: number) {
    return this.http.post<Chore[]>(this.mainUrl + "tenant-chores", tenantId, { headers: { 'Authorization': this.token } })
  }

  // This function is for getting tenant image byte array from the system.
  getTenantImage(tenantId: number) {
    return this.http.post<number[]>(this.mainUrl + "tenant-image", tenantId, { headers: { 'Authorization': this.token } })
  }

  // Guide function:

  // This function is for getting guide's image byte array from the system.
  getGuideImage(guideId: number) {
    return this.http.post<number[]>(this.mainUrl + "guide-image", guideId, { headers: { 'Authorization': this.token } })
  }

  // Medicine functions:

  // This function is for getting medicine's image byte array from the system.
  getMedicineImage(medicineId: number) {
    return this.http.post<number[]>(this.mainUrl + "medicine-image", medicineId, { headers: { 'Authorization': this.token } })
  }

  // This function is for adding medicine to tenant's medicine array in the system.
  createNewMedicine(medicine: Medicine, tenantId: number, filename: File) {
    return this.http.post<Medicine>(this.mainUrl + "new-medicine",
      this.setFormDataObject(PrivateStringsForApp.getMedicineEnglishString(), filename, medicine),
      { headers: { 'Authorization': this.token }, params: { "tenantId": tenantId.toString() } }
    )
  }

  // This function is for updating medicine details in the system.
  updateMedicineDetails(medicine: Medicine, filename: File) {
    if (filename.name === undefined) {
      return this.http.post<Medicine>(this.mainUrl + "update-medicine-without-image", medicine, { headers: { 'Authorization': this.token } })
    } else {
      return this.http.post<Medicine>(this.mainUrl + "update-medicine",
        this.setFormDataObject(PrivateStringsForApp.getMedicineEnglishString(), filename, medicine),
        { headers: { 'Authorization': this.token } })
    }
  }

  // This function is for deleting medicine from the system.
  deleteMedicine(medicineId: number) {
    return this.http.delete(this.mainUrl + "medicine-delete", { headers: { 'Authorization': this.token }, params: { "medicineId": medicineId.toString() }, responseType: 'text' })
  }

  // Chore functions:

  // This function is for adding chore to tenant's chores array in the system.
  createNewChore(chore: Chore, tenantId: number) {
    return this.http.post<Chore>(this.mainUrl + "create-new-chore", chore, { headers: { 'Authorization': this.token }, params: { "tenantId": tenantId.toString() } })
  }

  // This function is for updating chore details in the system.
  updateChoreDetails(chore: Chore) {
    return this.http.post<Chore>(this.mainUrl + "update-chore-details", chore, { headers: { 'Authorization': this.token } })
  }

  // This function is for deleting chore from the system.
  deleteChore(chore: Chore) {

    const header: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json; charset=UTF-8')
      .append('Authorization', this.token);

    const httpOptions: Object = {
      headers: header,
      body: chore,
      responseType: 'text'
    };

    return this.http.delete(this.mainUrl + 'remove-chore', httpOptions);
  }

  // Help functions:

  // This function is returning the default image file as blob object for all adding objects with 'image file' field. 
  setDefaultImageFile() {
    return this.http.get(PrivateStringsForApp.getDefaultAssetsString(), { responseType: 'blob' })
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