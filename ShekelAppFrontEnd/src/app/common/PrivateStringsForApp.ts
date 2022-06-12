import { Injectable } from '@angular/core'
import { Guide } from '../guide/guide.modules'
import { Replacement } from '../replacements/replacement.modules'
import { Tenant } from '../tenant/tenant.modules'
import { ApartmentsAndTenantsGender } from './apartmentsAndTenantsGender'
import { ShekelMember } from './main-objects/shekelMember.modules'

@Injectable({
    providedIn: 'root'
})
// This class is for showing (mostly) strings in the hebrew language.
export class PrivateStringsForApp {

    private static adminMainUrl: string = 'http://localhost:8080/api/admin'
    private static userMainUrl: string = 'http://localhost:8080/api/'

    private static appPdfString = 'application/pdf'

    private static navigateToUpdateUserDetails: string = '/update-user-details'
    private static defaultImgAssetsString: string = 'assets/pic/missing-pic.png'

    private static authorizationString: string = 'Authorization'
    private static absServiceClassString: string = 'AbcServiceClass'
    private static imagefileString: string = 'imagefile'

    private static multipleRoles: string = 'multiple-roles'
    private static loginString: string = 'login'
    private static errorString: string = 'error'
    private static detailsString: string = 'details'
    private static plural = 's'

    // H stands for hebrew, E for english, P for plural, (gender):-> B for boys G for girls. 

    private static h_admin: string = 'מנהל.ת'
    private static h_b_guide: string = 'מדריך'
    private static h_b_p_guide: string = 'מדריכים'
    private static h_g_guide: string = 'מדריכה'
    private static h_g_p_guide: string = 'מדריכות'
    private static h_b_tenant: string = 'דייר'
    private static h_g_tenant: string = PrivateStringsForApp.h_b_tenant + 'ת'

    private static h_replacement: string = 'החלפה'
    private static h_request: string = 'בקשת'
    private static h_offer: string = 'הצעת'
    private static h_start: string = 'התחלה'
    private static h_end: string = 'סיום'

    private static girlsString: string = 'בנות'
    private static femaleString: string = 'נקבה'
    private static boysString: string = 'בנים'
    private static maleString: string = 'זכר'
    private static toReplaceString = ' את '
    private static b_isAddedString = 'נוסף'
    private static b_isRemovedString = 'הוסר'
    private static g_isAddedString = 'נוספה'

    private static e_admin: string = 'admin'
    private static r_admin: string = 'ROLE_ADMIN'
    private static e_coordinator: string = 'coordinator'
    private static r_coordinator: string = 'ROLE_COORDINATOR'
    private static e_p_coordinator: string = PrivateStringsForApp.e_coordinator + PrivateStringsForApp.plural
    private static e_width_guide: string = 'width-guide'
    private static r_width_guide: string = 'ROLE_WIDTH_GUIDE'
    private static e_p_width_guide: string = PrivateStringsForApp.e_width_guide + PrivateStringsForApp.plural
    private static e_guide: string = 'guide'
    private static r_guide: string = 'ROLE_GUIDE'
    private static e_p_guide: string = PrivateStringsForApp.e_guide + PrivateStringsForApp.plural
    private static e_apartment: string = 'apartment'
    private static e_p_apartment: string = PrivateStringsForApp.e_apartment + PrivateStringsForApp.plural
    private static e_tenant: string = 'tenant'
    private static e_p_tenant: string = PrivateStringsForApp.e_tenant + PrivateStringsForApp.plural
    private static e_medicine: string = 'medicine'

    private static adminMenu1: string = 'first'
    private static adminMenu2: string = 'second'
    private static adminMenu3: string = 'third'
    private static adminMenu4: string = 'fourth'

    private static emptyString: string = ''
    private static emptySpaceString: string = ' '
    private static emptyLongString: string = '         '

    private static change: string = '/change-'
    private static password: string = '-password'
    private static editString: string = 'edit'
    private static pxString: string = 'px'
    private static indexString: string = 'index'
    private static choreString: string = 'chore'
    private static display: string = 'display'
    private static tableString: string = 'Table'
    private static styleString: string = 'style'
    private static blueString: string = 'blue'
    private static redString: string = 'red'

    private static firstName: string = 'firstName'
    private static lastName: string = 'lastName'
    private static username: string = 'username'
    private static apartmentName: string = 'name'
    private static address: string = 'address'
    private static phoneNumber: string = 'phoneNumber'

    private static backgroundString: string = 'background-color:'

    /** 'for choosing apartment , press on apartment's name' */
    private static defaultApartmentName = 'לבחירת דירה יש ללחוץ על שם הדירה'
    /** 'for choosing tenant , press on tenant's name' */
    private static defaultTenantName = 'לבחירת דייר/ת יש ללחוץ על שם הדייר/ת'
    /** 'for choosing guide , press on guide's name' */
    private static defaultGuideName = 'לבחירת מדריכ/ה יש ללחוץ על שם המדריכ/ה'

    /** 'invalid tele/phone number' */
    private static phoneInvalid: string = 'מספר טלפון לא תקין'
    /** 'All fields must be filled out' */
    private static fieldIsEmpty: string = 'יש למלא את כל השדות'
    /** 'end shift date is too far' */
    private static toFarEndDateMsg: string = 'תאריך סיום משמרת רחוק'
    /** 'email (user name) is used , chose a different one' */
    private static userNameIsUsedErrorMsg: string = 'אימייל רשום במערכת , יש לבחור אחד אחר'

    /** 'Password must contain at least 7 characters, 
     * to leave the current password the password field must be left blank' */
    private static adminPasswordToShortErrorString: string =
        'סיסמה צריכה להכיל 7 תווים לפחות , להשארת הסיסמה הנוכחית יש להשאיר את שדה הסיסמה ריק'

    /** 'Should the dates and hours of the shift be included as a replacement offer?' */
    private static confirmEnterRequestTimesHasGuideNewOffer: string =
        ' האם להכניס את תאריכי ושעות המשמרת בתור הצעת החלפה? '

    /** 'The system failed to complete the required operation, please try again later' */
    private static tryAgainLaterErrorMsg: string =
        ' המערכת לא הצליחה להשלים את הפעולה המתבקשת , יש לנסות שוב מאוחר יותר '

    /** 'Delete account from system?' */
    private static confirmAdminDeletingAccount: string = 'האם למחוק את ה חשבון מהמערכת ?'
    /** 'Added to the apartments list of ...' */
    private static isAddedToString: string = ' נוספה לרשימת דירות של '

    private static substringSplitNumberForNavigate = 5
    private static passwordLength = 7

    private static monthInMilliSeconds: number = 2_592_000_000
    private static weekInMilliSeconds: number = 604_800_000
    private static lessThenMinHoursInMilliSeconds: number = 18_000_000
    private static moreThenMaxDaysInMilliSeconds: number = 432_000_000
    private static dayOrMonthIsSingleNumber: number = 10
    private static dayIsSingleNumber: number = 8
    private static addZeroToDay: number = 9
    private static addZeroToMonth: number = 6
    private static fixDay: number = 2
    private static fixMonth: number = 5

    private static comma: string = ","
    private static comma_dot: string = ";"
    private static slash: string = "/"
    private static lowLine: string = "_"
    private static hyphen: string = "-"

    private static resetTimeFiledString: string = '--:--'

    private static zeroString: string = "0"
    private static twoString: string = "2"
    private static threeString: string = "3"

    private static defaultPhoneNumber: string = '05'

    private static DefaultFakeBirthBayString: string = '1111-11-11'
    private static DefaultPasswordString: string = '1234'

    private static hebrewWeekArrayString: string[] =
        ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"]

    constructor() { }

    // Admin functions:

    static getAdminMainUrl(): string { return this.adminMainUrl }

    static getHebrewAdminString(): string { return this.h_admin }

    static getEnglishAdminString(): string { return this.e_admin }

    static getRoleAdminString(): string { return this.r_admin }

    static getAdmin_1_MenuSpot(): string { return this.adminMenu1 }

    static getAdmin_2_MenuSpot(): string { return this.adminMenu2 }

    static getAdmin_3_MenuSpot(): string { return this.adminMenu3 }

    static getAdmin_4_MenuSpot(): string { return this.adminMenu4 }

    static getConfirmAdminDeletingAccount(): string { return this.confirmAdminDeletingAccount }

    static getAdminPasswordToShortError(): string { return this.adminPasswordToShortErrorString }

    static getGirlsString(): string { return this.girlsString }

    static getFemaleString(): string { return this.femaleString }

    static getBoysString(): string { return this.boysString }

    static getMaleString(): string { return this.maleString }

    /** 'to add ... (guideName) to apartment ... (apartmentName) ?'*/
    static confirmAddingGuideToApartment(guideName: string, apartmentName: string): string {
        return 'האם לצרף את ' + guideName + ' לדירת ' + apartmentName + ' ?'
    }

    static apartmentIsAddedToUsersListMsg(apartmentName: string, shekelMember: ShekelMember): string {
        return apartmentName + ' ' + this.isAddedToString + ' ' + shekelMember.firstName + ' ' + shekelMember.lastName
    }

    /** '... (userType(Coordinator/WidthGuide/Guide)) with email ... (username) 
     * is added successfully to the system'  */
    static addedUserToSystemSuccessMsg(username: string, userType: string): string {
        return userType + ' עם אימייל :  ' + username + ' הוכנס בהצלחה למערכת '
    }

    // Coordinator functions:

    static getCoordinatorEnglishPluralString(): string { return this.e_p_coordinator }

    static getCoordinatorEnglishString(): string { return this.e_coordinator }

    static getCoordinatorRoleString(): string { return this.r_coordinator }

    static getToReplaceString(): string { return this.toReplaceString }

    static getDisplayString(): string { return this.display }

    /** 'to delete apartment ... (apartmentName) from the apartments array ?' */
    static confirmDeletingApartmentFromCoordinator_sArray(apartmentName: string): string {
        return 'האם למחוק את הדירה ' + apartmentName + ' מרשימת הדירות ?'
    }

    /** 'to delete tenant ... (tenantName) from the tenants array ?' */
    static confirmDeletingTenantFromApartment_sList(tenant: Tenant): string {
        return "האם להסיר את " + tenant.shekelMember.firstName + " מרשימת הדיירים ?"
    }

    /**'...(shekelMember.firstName(Guide)) offers to replace ...(replacedGuideName) 
     * in apartment ...(replacementRequest.apartment.name),
     * shift start time ...(startDay + replacementRequest.start.time),
     * shift end time ...(endDay + replacementRequest.end.time)'
     */
    static coordinatorApprovalInTableDisplay(
        shekelMember: ShekelMember,
        replacedGuideName: string,
        replacementRequest: Replacement,
        startDay: string,
        endDay: string): string {
        return shekelMember.firstName.fontcolor("green") + "  " + "הצעה להחליף " + replacedGuideName +
            " בדירת :" + replacementRequest.apartment.name.fontcolor(this.blueString) + " תחילת משמרת " +
            startDay.fontcolor("white") + "   " + replacementRequest.start.time.fontcolor("black")
            + " סיום משמרת " + endDay.fontcolor(this.redString) + "    " + replacementRequest.end.time;
    }

    static confirmDeleting(deletingObj: string): string { return 'האם למחוק את ' + deletingObj + ' ?' }

    // WidthGuide functions:

    static getWidthGuideEnglishString(): string { return this.e_width_guide }

    static getWidthGuideRoleString(): string { return this.r_width_guide }

    static getWidthGuideEnglishPluralString(): string { return this.e_p_width_guide }

    // Guide functions:

    static getDefaultGuideName(): string { return this.defaultGuideName }

    static getGuideEnglishString(): string { return this.e_guide }

    static getGuideRoleString(): string { return this.r_guide }

    static getGuideEnglishPluralString(): string { return this.e_p_guide }

    static getGuideBoyHebrewString(): string { return this.h_b_guide }

    static getGuideGirlHebrewString(): string { return this.h_g_guide }

    static getTableString(): string { return this.tableString }

    static getBackgroundString(): string { return this.backgroundString }

    static getRedColorString(): string { return this.redString }

    static navigateGuideToReplacementsPage(): string {
        return PrivateStringsForApp.getGuideEnglishString() + PrivateStringsForApp.getSlash() +
            'replacements' + this.hyphen + 'page'

    }

    static getBlueColorString(): string { return this.blueString }

    //  Apartment functions:

    static getDefaultApartmentName(): string { return this.defaultApartmentName }

    static getApartmentEnglishString(): string { return this.e_apartment }

    static getNameString(): string { return this.apartmentName }

    static getAddressString(): string { return this.address }

    static getApartmentEnglishPluralString(): string { return this.e_p_apartment }

    // Tenant functions:

    static getDefaultTenantName(): string { return this.defaultTenantName }

    static getTenantEnglishString(): string { return this.e_tenant }

    static getTenantMaleHebrewString(): string { return this.h_b_tenant }

    static getTenantFemaleHebrewString(): string { return this.h_g_tenant }

    static getTenantEnglishPluralString(): string { return this.e_p_tenant }

    static getDefaultFakeBirthDayString(): string { return this.DefaultFakeBirthBayString }

    static getDefaultPasswordString(): string { return this.DefaultPasswordString }

    static getOneDay(): number { return 1000 * 60 * 60 * 24 }

    // Medicine function:

    static getMedicineEnglishString(): string { return this.e_medicine }

    // User functions:
    static getUserMainUrl(): string { return this.userMainUrl }

    static getLoginString(): string { return this.loginString }


    static getMultipleRolesString(): string { return this.multipleRoles }

    static getPasswordMinLength(): number { return this.passwordLength }

    static getErrorString(): string { return this.errorString }

    static getPxString(): string { return this.pxString }

    static getIndexString(): string { return this.indexString }

    static getChoreString(): string { return this.choreString }

    static updateUserDetailsUrl(): string { return this.navigateToUpdateUserDetails }

    static getStyleString(): string { return this.styleString }

    static getWeekInHebrewStringArray(): string[] { return this.hebrewWeekArrayString }

    static getHebrewReplacementString(): string { return this.h_replacement }

    static getHebrewRequestString(): string { return this.h_request }

    static getHebrewOfferString(): string { return this.h_offer }

    static getHebrewStartString(): string { return this.h_start }

    static getHebrewEndString(): string { return this.h_end }

    static getAppPdfString(): string { return this.appPdfString }

    static getSubstringSplitNumberForNavigate(): number { return this.substringSplitNumberForNavigate }

    static tryAgainLaterMsg(): string { return this.tryAgainLaterErrorMsg }

    static getEmptyLongPassword(): string { return this.emptyLongString }

    static getEmptyString(): string { return this.emptyString }

    static getEmptySpaceString(): string { return this.emptySpaceString }

    static getImagefileString(): string { return this.imagefileString }

    static getAuthorizationString(): string { return this.authorizationString }

    static getDefaultAssetsString(): string { return this.defaultImgAssetsString }

    static getAbsServiceString(): string { return this.absServiceClassString }

    static getDefaultPhoneNumber(): string { return this.defaultPhoneNumber }

    static getFirstNameForId(): string { return this.firstName }

    static getLastNameForId(): string { return this.lastName }

    static getUserNameForId(): string { return this.username }

    static getPhoneNumberForId(): string { return this.phoneNumber }

    static getMonthInMilliSeconds(): number { return this.monthInMilliSeconds }

    static getWeekInMilliSeconds(): number { return this.weekInMilliSeconds }

    static getLessThenMinHoursInMilliSeconds(): number { return this.lessThenMinHoursInMilliSeconds }

    static getMoreThenMaxDaysInMilliSeconds(): number { return this.moreThenMaxDaysInMilliSeconds }

    static getDayOrMonthIsSingle(): number { return this.dayOrMonthIsSingleNumber }

    static getDayIsSingle(): number { return this.dayIsSingleNumber }

    static getAddZeroToDay(): number { return this.addZeroToDay }

    static getAddZeroToMonth(): number { return this.addZeroToMonth }

    static getFixDay(): number { return this.fixDay }

    static getFixMonth(): number { return this.fixMonth }

    static getComma(): string { return this.comma }

    static getCommaDot(): string { return this.comma_dot }

    static getSlash(): string { return this.slash }

    static getLowLine(): string { return this.lowLine }

    static resetTimeFiled(): string { return this.resetTimeFiledString }

    static getZeroString(): string { return this.zeroString }

    static getTwoString(): string { return this.twoString }

    static getThreeString(): string { return this.threeString }

    static getHyphen(): string { return this.hyphen }

    static showPhoneInvalidMsg(): string { return this.phoneInvalid }

    static getEmptyFieldError(): string { return this.fieldIsEmpty }

    static getToFarEndDateMsg(): string { return this.toFarEndDateMsg }

    static UserNameIsUsedError(): string { return this.userNameIsUsedErrorMsg }

    static navigateToChangePassword(loginType: string): string {
        return loginType + this.change + loginType + this.password
    }

    static apartmentDisplayUrl(userTypeString: string): string {
        return userTypeString + this.slash + this.e_apartment + this.hyphen + this.display
    }

    static getAllFromObjectType(askingTypeString: string, objectTypeString: string): string {
        return askingTypeString + this.slash + 'all-' + objectTypeString + '-in-system'
    }

    static navigateToUserTypeEditObjectType(editorTypeString: string, editedObjectTypeString: string): string {
        return editorTypeString + this.slash + editedObjectTypeString + this.hyphen + this.editString
    }

    static setApartmentEditErrorMsgAttribute(top: number): string {
        return 'position: absolute; color:red; left: 300px; font-size:25px; top:' + top + 'px;z-index:10;'
    }

    static navigateToTenantDetails(userTypeString: string): string {
        return userTypeString + this.slash + this.e_tenant + this.hyphen + this.detailsString
    }

    static nameIsUsedError(name: string): string { return 'השם ' + name + ' תפוס' }

    /** 'date is over' */
    static dateIsOverMessage(overTime: string): string { return 'תאריך ' + overTime + ' עבר' }

    /** '...(request/offer) is added successfully to the system' */
    static getSuccessAddingReplacementMessage(): string { return ' הוכנסה בהצלחה למערכת ' }

    /** 'end date before start date' */
    static getEndBeforeStartErrorMessage(): string { return 'תאריך סיום לפני תאריך התחלה' }

    /** 'Fields don't match' */
    static getFieldsAreNotTheSameError(): string { return 'השדות אינם תואמים' }

    /** 'incorrect email or password' */
    static getLoginError(): string { return 'אימייל או סיסמה שגויים' }

    /** 'system is shot down, try again later' */
    static getSystemShotDownError(): string { return 'המערכת מנותקת,יש לנסות שוב מאוחר יותר' }

    /** 'start time before end time in the shift with the same date' */
    static getEndBeforeStartInSameDateErrorMessage(): string {
        return 'זמן התחלה לפני זמן סיום במשמרת עם אותו תאריך'
    }

    /** 'minimum replacement request/offer is 5 hours' */
    static getMinReplacementTimeMessage(kindOrReplacement: string): string {
        return ' מינימום ' + kindOrReplacement + ' הוא 5 שעות '
    }

    /** 'should the dates and hours of the shift be included as new a replacement offer?,
     * (if the replacement will not be approved, 
     * the replacement offer will be adapted to other replacement requests in the system)' */
    static getToEnterRequestTimesHasGuideNewOfferInCaseOfRejecjen(): string {
        return this.confirmEnterRequestTimesHasGuideNewOffer +
            ' (במידה וההחלפה לא תאושר ההצעת החלפה תותאם לבקשות החלפה אחרות במערכת)'
    }

    /** 'shift in the process of approving another offer, 
     *   should the dates and hours of the shift be included as a new replacement offer?' */
    static getShiftIsInApprovalProsesToEnterRequestTimesHasGuideNewOffer(): string {
        return ' משמרת בתהליך אישור להצעה אחרת, ' + this.confirmEnterRequestTimesHasGuideNewOffer
    }

    /** 'replacement request is not relevant' */
    static getRequestIsNotRelevantException(): string {
        return 'בקשת החלפה לא רלוונטית'
    }

    /** '...(guide's name) is added to apartment's guides list' */
    static showGuideIsAddedToApartmentMsg(guide: Guide): string {
        var isAdded: string = this.b_isAddedString
        var guides: string = this.h_b_p_guide
        if (guide.shekelMember.gender === ApartmentsAndTenantsGender.GIRLS) {
            isAdded = this.g_isAddedString
            guides = this.h_g_p_guide
        }

        return guide.shekelMember.firstName +
            this.emptySpaceString + guide.shekelMember.lastName +
            this.emptySpaceString + isAdded + this.emptySpaceString + 'לרשימת ה' +
            guides + this.emptySpaceString + ' של הדירה '
    }

    /** '...(guide's name) is removed from apartment's guides list' */
    static showGuideIsRemovedFromApartmentMsg(guide: Guide): string {
        var removed: string = this.b_isRemovedString

        if (guide.shekelMember.gender === ApartmentsAndTenantsGender.GIRLS) {
            removed += 'ה'
        }

        return guide.shekelMember.firstName + this.emptySpaceString +
            removed + this.emptySpaceString + 'מרשימת הדיירים של הדירה'
    }

    static getReplacementTableColor(): string { return '#5bc0de' }

}