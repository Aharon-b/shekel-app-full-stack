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
import { Coordinator } from './coordinator.modules';

@Injectable()
// Coordinator type storage service class.
export class CoordinatorStorageService {
  // The main url of the backend.
  private mainUrl: string = PrivateStringsForApp.getUserMainUrl()
  // Token for actions of the user in the system.
  private token: string = PrivateStringsForApp.getEmptyString()

  constructor(private http: HttpClient) { }

  // Coordinator functions:

  // This function is for getting user type Coordinator details from the system.
  getCoordinatorDetails(token: string) {
    this.token = token
    const headers = new HttpHeaders().set(PrivateStringsForApp.getAuthorizationString(), token)
    return this.http.get<Coordinator>(this.mainUrl + "coordinator-details", { headers })
  }

  // This function is for getting user type Coordinator image byte array from the system.
  getCoordinatorImage() {
    return this.http.post<number[]>(this.mainUrl + "coordinator-image", {},
      {
        headers: { 'Authorization': this.token }
      })
  }

  // This function is for updating user type Coordinator details in the system.
  updateCoordinatorDetails(coordinator: Coordinator, filename: File) {
    if (filename.name === undefined) {
      return this.http.post<Coordinator>(this.mainUrl + "update-coordinator-details-no-image",
        coordinator, { headers: { 'Authorization': this.token } })
    } else {
      return this.http.post<Coordinator>(this.mainUrl + "update-coordinator-details",
        this.setFormDataObject(PrivateStringsForApp.getCoordinatorEnglishString(), filename, coordinator), {
        headers: { 'Authorization': this.token }
      })
    }
  }

  // This function is for updating user type Coordinator password in the system.
  changeCoordinatorPassword(password: string) {
    return this.http.post(this.mainUrl + "user-password-change", password, {
      headers: { 'Authorization': this.token },
      responseType: 'text',
    })
  }

  // This function is for getting user type Coordinator apartments array from the system.
  getCoordinatorApartments() {
    return this.http.post<Apartment[]>(this.mainUrl + "coordinator-apartments", {}, {
      headers: { 'Authorization': this.token }
    })
  }

  // This function is for getting user type Coordinator tenants array from the system.
  getCoordinatorTenants() {
    return this.http.post<Tenant[]>(this.mainUrl + "coordinator-tenants", {},
      {
        headers: { 'Authorization': this.token }
      })
  }

  // Apartment functions:

  // This function is for getting user type Coordinator each apartment tenants array from the system.
  getApartmentTenants(apartmentId: number) {
    return this.http.post<Tenant[]>(this.mainUrl + "apartment-tenants", apartmentId, {
      headers: { 'Authorization': this.token }
    })
  }

  // This function is for getting user type Coordinator each apartment image byte array from the system.
  getApartmentImage(apartmentId: number) {
    return this.http.post<Byte[]>(this.mainUrl + "apartment-image", apartmentId, {
      headers: { 'Authorization': this.token }
    })
  }

  // This function is for getting user type Coordinator each apartment guides array from the system.
  getApartmentGuides(apartmentId: number) {
    return this.http.post<Guide[]>(this.mainUrl + "apartment-guides", apartmentId, {
      headers: { 'Authorization': this.token }
    })
  }

  // This function is for updating apartment details in the system.
  updateApartmentDetails(apartment: Apartment, filename: File) {
    if (filename.name === undefined) {
      return this.http.post<Apartment>(this.mainUrl + "update-apartment-details-no-image", apartment, {
        headers: { 'Authorization': this.token }
      })
    } else {
      return this.http.post<Apartment>(this.mainUrl + "update-apartment-details",
        this.setFormDataObject(PrivateStringsForApp.getApartmentEnglishString(), filename, apartment), {
        headers: { 'Authorization': this.token }
      })
    }
  }

  // This function is for resetting apartment coordinator_id in the system 
  // (removing apartment from coordinator's apartments array).
  deleteApartmentFromCoordinatorList(apartmentId: number) {
    return this.http.delete(this.mainUrl + "remove-apartment-from-coordinator", {
      headers: { 'Authorization': this.token },
      params: { "apartmentId": apartmentId.toString() },
      responseType: 'text'
    })
  }

  // Tenant functions:

  // This function is for updating tenant details in the system.
  updateTenantDetails(tenant: Tenant, filename: File) {
    if (filename.name === undefined) {
      return this.http.post<Tenant>(this.mainUrl + "update-tenant-no-image", tenant,
        { headers: { 'Authorization': this.token } })
    } else {
      return this.http.post<Tenant>(this.mainUrl + "update-tenant",
        this.setFormDataObject(PrivateStringsForApp.getTenantEnglishString(), filename, tenant),
        { headers: { 'Authorization': this.token } })
    }
  }

  // This function is for getting tenant's medicine array from the system.
  getTenantMedicineArray(tenantId: number) {
    return this.http.post<Medicine[]>(this.mainUrl + "tenant-medicines", tenantId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is for getting tenant's chores array from the system.
  getTenantChoresArray(tenantId: number) {
    return this.http.post<Chore[]>(this.mainUrl + "tenant-chores", tenantId, {
      headers: { 'Authorization': this.token }
    })
  }

  // This function is for getting tenant image byte array from the system.
  getTenantImage(tenantId: number) {
    return this.http.post<number[]>(this.mainUrl + "tenant-image", tenantId,
      { headers: { 'Authorization': this.token } })
  }

  // This function is for resetting tenant apartment_id in the system 
  // (removing tenant from apartment's array).
  deleteTenantFromApartment(tenantId: number) {
    return this.http.delete(this.mainUrl + "remove-tenant-from-apartment",
      {
        // params: { 'tenantId': tenant.id.toString() },
        params: { 'tenantId': tenantId.toString() }
        , headers: { 'Authorization': this.token }
        , responseType: 'text'
      }
    )

  }

  // Medicine functions:

  // This function is for adding medicine to tenant's medicine array in the system.
  createNewMedicine(medicine: Medicine, tenantId: number, filename: File) {
    return this.http.post<Medicine>(this.mainUrl + "new-medicine",
      this.setFormDataObject(PrivateStringsForApp.getMedicineEnglishString(), filename, medicine),
      { headers: { 'Authorization': this.token }, params: { "tenantId": tenantId.toString() } }
    )
  }

  // This function is for getting medicine's image byte array from the system.
  getMedicineImage(medicineId: number) {
    return this.http.post<number[]>(this.mainUrl + "medicine-image", medicineId, {
      headers: { 'Authorization': this.token }
    })
  }

  // This function is for updating medicine details in the system.
  updateMedicineDetails(medicine: Medicine, filename: File) {
    if (filename.name === undefined) {
      return this.http.post<Medicine>(this.mainUrl + "update-medicine-without-image", medicine, {
        headers: { 'Authorization': this.token }
      })
    } else {
      return this.http.post<Medicine>(this.mainUrl + "update-medicine",
        this.setFormDataObject(PrivateStringsForApp.getMedicineEnglishString(), filename, medicine),
        { headers: { 'Authorization': this.token } })
    }
  }

  // This function is for deleting medicine from the system.
  deleteMedicine(medicineId: number) {
    return this.http.delete(this.mainUrl + "medicine-delete", {
      headers: { 'Authorization': this.token },
      params: { "medicineId": medicineId.toString() },
      responseType: 'text'
    })
  }

  // Chore functions:

  // This function is for adding chore to tenant's chores array in the system.
  createNewChore(chore: Chore, tenantId: number) {
    return this.http.post<Chore>(this.mainUrl + "new-chore", chore, {
      headers: { 'Authorization': this.token },
      params: { "tenantId": tenantId.toString() }
    })
  }

  // This function is for updating chore details in the system.
  updateChoreDetails(chore: Chore) {
    return this.http.post<Chore>(this.mainUrl + "update-chore-details", chore, {
      headers: { 'Authorization': this.token }
    })
  }

  // This function is for deleting chore from the system.
  deleteChore(chore: Chore) {

    const header: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json; charset=UTF-8')
      .append('Authorization', this.token)

    const httpOptions: Object = {
      headers: header,
      body: chore,
      responseType: 'text'
    }

    return this.http.delete(this.mainUrl + 'remove-chore', httpOptions);
  }

  // Guide functions:

  // This function is for getting guide details from the system.
  getGuideDetails(guideId: number) {
    return this.http.post<Guide>(this.mainUrl + "guide-details", guideId, {
      headers: { 'Authorization': this.token }
    })
  }

  // This function is for getting guide image byte array from the system.
  getGuideImage(guideId: number) {
    return this.http.post<number[]>(this.mainUrl + "guide-image", guideId,
      {
        headers: { 'Authorization': this.token }
      })
  }

  // This function is for adding guide from the system to apartment guides array.
  addGuideFromSystemToApartment(guide: Guide, apartmentId: number) {
    return this.http.post<Guide>(this.mainUrl + "add-guide-to-apartment", guide, {
      headers: { 'Authorization': this.token },
      params: { "apartmentId": apartmentId.toString() }
    })
  }

  // This function is for getting all guides that are not in the apartment's guides array.
  getAllGuides(apartment: Apartment) {
    return this.http.post<Guide[]>(this.mainUrl + "all-guides-not-from-apartment", apartment, {
      headers: { 'Authorization': this.token }
    })
  }

  // This function is for removing guide from apartment guides array.
  removeGuideFromApartment(guideId: number, apartmentId: number) {
    return this.http.delete<Guide>(this.mainUrl + "remove-guide-from-apartment",
      {
        headers: { 'Authorization': this.token },
        params: { "guideId": guideId.toString(), "apartmentId": apartmentId.toString() }
      })
  }

  // Replacement functions:

  // This function is for getting coordinator's replacements to approve array from the system.
  getCoordinatorApprovalArray() {
    return this.http.post<[]>(this.mainUrl + "coordinator-approval-list", {},
      { headers: { 'Authorization': this.token } })
  }

  // This function is for approving replacement in the system.
  approveReplacementRequest(guideId: number, replacementRequestId: number) {
    return this.http.post(this.mainUrl + "approve-replacement-request", guideId,
      {
        headers: { 'Authorization': this.token },
        params: { "replacementRequestId": replacementRequestId.toString() },
        responseType: 'text'
      })
  }

  // This function is for rejecting replacement in the system.
  rejectReplacementRequest(guide: Guide, replacementRequestId: number) {
    return this.http.post(this.mainUrl + "reject-replacement-request", guide,
      {
        headers: { 'Authorization': this.token },
        params: { "replacementRequestId": replacementRequestId.toString() },
        responseType: 'text'
      })
  }

  // This function is for adding replacement to the system.
  addApartmentReplacementFromCoordinatorApartmentsToSystem(replacementRequest: Replacement) {
    return this.http.post<Replacement>(this.mainUrl + "add-replacement-request-no-guide",
      replacementRequest, { headers: { 'Authorization': this.token } })
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