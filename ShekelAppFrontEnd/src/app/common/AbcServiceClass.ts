import { EventEmitter } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Apartment } from '../apartment/apartment.modules';
import { Chore } from '../chores/chores.modules';
import { Medicine } from '../medicine/medicine-list/medicine.modules';
import { Replacement } from '../replacements/replacement.modules';
import { Tenant } from '../tenant/tenant.modules';
import { ShekelMember } from './main-objects/shekelMember.modules';
import { PrivateStringsForApp } from './PrivateStringsForApp';

export abstract class AbsServiceClass {

  constructor() { }

  shekelMember: ShekelMember = {} as ShekelMember

  apartment: Apartment = {} as Apartment

  tenant: Tenant = {} as Tenant

  medicine: Medicine = {} as Medicine

  chore: Chore = {} as Chore

  userEmitter = new EventEmitter<any>()

  apartmentsEmitter = new EventEmitter<Apartment[]>()

  tenantsEmitter = new EventEmitter<Tenant[]>()

  blobEmitter = new EventEmitter<Blob>()

  requestOrOfferEmitter = new EventEmitter<boolean>();

  showStartPageElementsEmitter = new EventEmitter<boolean>()

  showReplacementRequestEmitter = new EventEmitter<boolean>()

  passwordUpdateEmitter = new EventEmitter<boolean>()

  msgEmitter = new EventEmitter<string>()

  // User functions:

  abstract getUserDetails(): void

  abstract getLoggedInUsername(): string

  abstract isPasswordUpdated(): boolean

  abstract updateUserDetails(shekelMember: ShekelMember, username: string, filename?: File): void

  abstract changeUserPassword(password: string): void

  abstract getUserApartments(): void

  abstract getUserTenants(): Promise<Tenant[]>

  abstract addReplacementToUserArray(replacementRequest: Replacement): Promise<Replacement>

  // Apartment functions :

  abstract apartmentDisplay(apartment: Apartment): void

  abstract getApartmentTenants(apartmentId: number): void

  abstract getApartmentImage(apartmentId: number): Promise<number[]>

  // Tenant functions :

  abstract getTenantPersonalDetails(tenant: Tenant): void

  abstract getTenantMedicineArray(tenantId: number): Promise<Medicine[]>

  abstract getMedicineImage(tenantId: number): Promise<number[]>

  abstract getTenantChoresArray(tenantId: number): Promise<Chore[]>

  abstract getTenantImage(tenantId: number): Promise<number[]>

  // Guide image function :

  abstract getGuideImage(guideId: number): Promise<number[]>

  // Help abstract functions :

  abstract navigateByUrl(url: string): void

  abstract getRouter(): Router

  abstract getServiceSanitizer(): DomSanitizer

  // Help static functions :

  static setImage(event: any): Promise<any> {
    return new Promise((res) => {
      res(event.target.files[0])
    })
  }

  static setImageToBlobType(event: any): Promise<any> {
    var reader = new FileReader();
    var readType: Blob
    if (event instanceof Blob) {
      readType = event
    } else if (event.target.files && event.target.files[0]) {
      readType = event.target.files[0]
    }

    return new Promise((res) => {
      if (readType !== null) {
        reader.readAsDataURL(readType);

        reader.onload = (e) => {
          if (e.target) {
            res(e.target.result)
          }
        }
      }
    })
  }

  static blobToFile(defaultBlob: Blob, fileName: string) {
    var blob: any = defaultBlob;
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return <File>defaultBlob;
  }

  static reverseDate(stringToReverse: string) {
    if (stringToReverse.length == PrivateStringsForApp.getDayOrMonthIsSingle()) {
      stringToReverse = this.addZeroToDayOrMonth(stringToReverse)
    }
    stringToReverse = this.addCommaBeforeReverse(stringToReverse)
    stringToReverse = this.reverseDateString(stringToReverse)
    if (stringToReverse.length == PrivateStringsForApp.getAddZeroToMonth()) {
      stringToReverse = this.addZeroToDayAndMonth(stringToReverse)
    }
    return this.addSlash(stringToReverse)
  }

  static doubleNavigate(firstUrl: string, secondUrl: string, router: Router) {
    setTimeout(() => {

      router.navigateByUrl(firstUrl, { skipLocationChange: false }).then(() => {
        router.navigateByUrl(secondUrl, { skipLocationChange: false })
      })
    }, 100);
  }

  static getDaysInWeekArray() {
    /** The last one in the array ('מוצ"ש') ==> saturday night */
    return ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת', 'מוצ"ש']
  }

  static logout() {
    window.location.href = ''
  }

  static omitSpecialChar(event: any, phoneNumber: string, telephoneNumber: boolean): Promise<string> {
    return new Promise((res) => {
      if (telephoneNumber) {
        phoneNumber = AbsServiceClass.setTelephoneNumber(phoneNumber)
      } else {
        phoneNumber = AbsServiceClass.setPhoneNumber(phoneNumber)
      }

      if (isNaN(event.key)) {
        setTimeout(() => {
          res(phoneNumber.substring(0, phoneNumber.length))
        }, 10);
      } else {
        res(phoneNumber)
      }
    })
  }

  private static addSlash(stringToChange: string) {
    return this.addStr(this.addStr(stringToChange, PrivateStringsForApp.getFixDay(), PrivateStringsForApp.getSlash()), PrivateStringsForApp.getFixMonth(), PrivateStringsForApp.getSlash())
  }

  private static addZeroToDayOrMonth(stringToChange: string) {
    var addZero: number = 0
    if (stringToChange[PrivateStringsForApp.getDayIsSingle()] == PrivateStringsForApp.getComma()) {
      addZero = PrivateStringsForApp.getAddZeroToDay()
    } else {
      addZero = PrivateStringsForApp.getAddZeroToMonth()
    }
    return this.addStr(stringToChange, addZero, PrivateStringsForApp.getZeroString())
  }

  static addZeroToDayAndMonth(stringToChange: string) {
    return this.addStr(this.addStr(stringToChange, 0, PrivateStringsForApp.getZeroString()), PrivateStringsForApp.getFixDay(), PrivateStringsForApp.getZeroString())
  }

  // Help static functions to this class :

  private static addCommaBeforeReverse(stringToChange: string) {
    return stringToChange
      .replace(PrivateStringsForApp.getComma(), PrivateStringsForApp.getEmptyString())
      .replace(PrivateStringsForApp.getComma(), PrivateStringsForApp.getHyphen())
      .replace(PrivateStringsForApp.getComma(), PrivateStringsForApp.getHyphen())
  }

  private static reverseDateString(stringToReverse: string) {
    const splitName = stringToReverse.split(PrivateStringsForApp.getHyphen())
    const reversedName = splitName.reverse()
    return reversedName.join(PrivateStringsForApp.getEmptyString())
  }

  private static addStr(str: string, index: number, stringToAdd: string) {
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
  }

  private static setTelephoneNumber(telephoneNumber: string) {
    if (telephoneNumber.length === 1) {
      telephoneNumber = "0"
    }
    if (telephoneNumber.length === 2) {
      telephoneNumber += "-"
    }
    return telephoneNumber
  }

  private static setPhoneNumber(phoneNumber: string) {
    if (phoneNumber.length === 2) {
      phoneNumber = "05"
    }
    if (phoneNumber.length === 3) {
      phoneNumber += "-"
    }
    return phoneNumber
  }

  //  Help function :

  setBlobImage(imageByte: number[], sanitizer: DomSanitizer): SafeUrl {
    const byteArray = new Uint8Array(imageByte);
    const blob = new Blob([byteArray], { type: PrivateStringsForApp.getAppPdfString() });
    const safeBlob = URL.createObjectURL(blob);
    const img = sanitizer.bypassSecurityTrustUrl(safeBlob);
    return img;
  }

  flashErrorMessage(msg: string, times: number) {
    const intervalId = setInterval(() => {
      this.msgEmitter.emit(msg)
      times--
      if (times === 0) {
        clearInterval(intervalId)
      }
    }, 1500)
  }

}