import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Byte } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Apartment } from '../apartment/apartment.modules';
import { Chore } from '../chores/chores.modules';
import { PrivateStringsForApp } from '../common/PrivateStringsForApp';
import { Medicine } from '../medicine/medicine-list/medicine.modules';
import { Replacement } from '../replacements/replacement.modules';
import { Tenant } from '../tenant/tenant.modules';
import { Guide } from './guide.modules';

@Injectable()
// Guide type storage service class.
export class GuideStorageService {
  // The main url of the backend.
  private mainUrl: string = PrivateStringsForApp.getUserMainUrl()
  // Token for actions of the user in the system.
  private token: string = PrivateStringsForApp.getEmptyString()

  constructor(private http: HttpClient) { }

  // Guide functions:

  // This function is for getting user type Guide details from the system.
  getGuideDetails(token: string) {
    this.token = token
    const headers = new HttpHeaders().set("Authorization", token)
    return this.http.get<Guide>(this.mainUrl + "guide-details", { headers })
  }

  // This function is for getting user type Guide image byte array from the system.
  getGuideImage(guideId: number) {
    return this.http.post<number[]>(this.mainUrl + "guide-image", guideId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is for updating user type Guide details in the system.
  updateGuideDetails(guide: Guide, filename: File) {
    const uploadData = new FormData();
    if (filename.name === undefined) {
      return this.http.post<Guide>(this.mainUrl + "update-guide-details-no-image",
        guide, { headers: { 'Authorization': this.token } })
    } else {
      uploadData.append("imagefile", filename, filename.name);
      uploadData.append("guide", JSON.stringify(guide))
      return this.http.post<Guide>(this.mainUrl + "update-guide-details",
        uploadData, { headers: { 'Authorization': this.token } })
    }
  }

  // This function is for updating user type Guide password in the system.
  changeGuidePassword(password: string) {
    return this.http.post(this.mainUrl + "user-password-change", password,
      { headers: { 'Authorization': this.token }, responseType: 'text' })
  }

  // This function is for getting user type Coordinator apartments array from the system.
  getGuideApartments() {
    return this.http.post<Apartment[]>(this.mainUrl + "guide-apartments", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is for getting user type Guide tenants array from the system.
  getGuideTenants() {
    return this.http.post<Tenant[]>(this.mainUrl + "guide-tenants", {},
      { headers: { 'Authorization': this.token } })
  }

  // Apartment functions:

  // This function is for getting user type Guide each apartment tenants array from the system.
  getApartmentTenants(apartmentId: number) {
    return this.http.post<Tenant[]>(this.mainUrl + "apartment-tenants", apartmentId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is for getting user type Guide each apartment image byte array from the system.
  getApartmentImage(apartmentId: number) {
    return this.http.post<Byte[]>(this.mainUrl + "apartment-image", apartmentId,
      { headers: { 'Authorization': this.token } })
  }

  // Tenant functions:

  // This function is for getting tenant's medicine array from the system.
  getTenantMedicineArray(tenantId: number) {
    return this.http.post<Medicine[]>(this.mainUrl + "tenant-medicines", tenantId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is for getting medicine's image byte array from the system.
  getMedicineImage(medicineId: number) {
    return this.http.post<number[]>(this.mainUrl + "medicine-image", medicineId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is for getting tenant's chores array from the system.
  getTenantChoresArray(tenantId: number) {
    return this.http.post<Chore[]>(this.mainUrl + "tenant-chores", tenantId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is for getting tenant image byte array from the system.
  getTenantImage(tenantId: number) {
    return this.http.post<number[]>(this.mainUrl + "tenant-image", tenantId,
      { headers: { 'Authorization': this.token } })
  }

  // Replacement request functions:

  // This function is for getting all replacements requests that doesn't belong to guide array from the system.
  getAllNotGuide_sRequests() {
    return this.http.post<Replacement[]>(this.mainUrl + "all-not-guide's-requests", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is for getting all guide's replacements offers array from the system.
  getGuideReplacementApprovedOffers() {
    return this.http.post<Replacement[]>(this.mainUrl + "guide-replacement-approved-offers", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is for getting all guide's replacements array from the system.
  getAllGuideReplacementsRequestsAndOffers() {
    return this.http.post<Replacement[]>(this.mainUrl + "guide-all-replacements", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is for adding guide's new replacement request/offer to the system.
  addReplacementToGuideArray(replacementRequest: Replacement) {
    return this.http.post<Replacement>(this.mainUrl + "add-replacement", replacementRequest,
      { headers: { 'Authorization': this.token } })
  }

  // This function is for checking if guide's offer has requests that fits the offer shift time in the system.
  checkIfOfferHasRequests(request: Replacement) {
    return this.http.post<Replacement[]>(this.mainUrl + "offer-has-requests", request,
      { headers: { 'Authorization': this.token } })
  }

  // This function is for sending a request that guide offered him self to for the apartment coordinator to approve.
  sendRequestAndOfferToCoordinatorsApproval(replacementRequest: Replacement, offerId: number) {
    return this.http.post(this.mainUrl + "request-offer-approval", replacementRequest,
      { headers: { 'Authorization': this.token }, params: { "offerId": offerId.toString() }, responseType: 'text' })
  }

  // This function is for checking the status of a request that guide offered him self to in the system.
  checkIfReplacementIsInApprovingProcess(replacementRequestId: number) {
    return this.http.post<Boolean>(this.mainUrl + "check-approval-status", replacementRequestId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is for deleting replacement request/offer from the system.
  deleteReplacement(replacement: Replacement) {
    return this.http.delete<number>(this.mainUrl + "delete-replacement",
      { headers: { 'Authorization': this.token }, params: { "replacementId": replacement.id.toString() } })
  }

}