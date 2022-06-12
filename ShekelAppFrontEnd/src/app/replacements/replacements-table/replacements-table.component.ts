import { AfterContentChecked, AfterContentInit, AfterViewChecked, Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { Apartment } from 'src/app/apartment/apartment.modules';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { GuideService } from 'src/app/guide/guide.service';
import { InApprovalProc } from '../inApprovalProc';
import { Replacement } from '../replacement.modules';
import { ShiftTime } from '../shift_time.modules';

@Component({
  selector: 'app-replacements-table',
  templateUrl: './replacements-table.component.html',
  styleUrls: ['./replacements-table.component.css']
})

export class ReplacementsTableComponent implements OnInit, AfterViewChecked, AfterContentInit {
  // For setting fields type string as empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()

  // Initialize an empty array of type ReplacementRequest for all replacements that doesn't belong to guide.
  allNotGuidesReplacementsRequests: Replacement[] = []
  // Initialize an empty array of type ReplacementRequest for all guide's approved offers.
  guideReplacementApprovedOffers: Replacement[] = []
  // Initialize an empty array of type ReplacementRequest for all guide's replacements that are 'offer' type.
  allGuideOffers: Replacement[] = []
  // Initialize an empty array of type ReplacementRequest for all guide's replacements that are 'request' type.
  allGuideRequests: Replacement[] = []
  // Initialize an empty array of type ReplacementRequest for all requests in the system that matches 
  // guide's offer.
  allOffersRequests: Replacement[] = []

  // When mouse is on one of the 'start'/'end' tds in one of the tables ,will show the day of the shift 
  // and when mouse is off the field is for showing the shift time.
  time: string = this.emptyString
  // For displaying comment on the screen.
  commentsString: string = this.emptyString
  // For deciding if to show comment on the screen.
  shortCommentLength: number = 6

  // When mouse is on/off a comment.
  showCommentsBoolean: boolean = false
  // For showing 'guide's-offers' table.
  showOffers: boolean = false
  // For showing page.
  showPage: boolean = false

  // For where to show comment on the screen.
  @ViewChild('commentsElement', { read: ElementRef }) commentsElement: ElementRef = {} as ElementRef

  constructor(
    private userTypeService: GetUserTypeService,
    private ngZone: NgZone,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass
  ) {
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void {
    if (this.absService instanceof GuideService) {
      // Setting the 'allNotGuidesReplacementsRequests' field 
      // as the AbsServiceClass 'allNotGuidesReplacementsRequests' field.
      this.allNotGuidesReplacementsRequests = this.absService.allNotGuidesReplacementsRequests
      // Getting all guide's approved offers from the system.
      this.absService.getGuideReplacementApprovedOffers().then(replacementOfferArray => {
        // Referring the given array to the 'guideReplacementApprovedOffers' field.
        this.guideReplacementApprovedOffers = replacementOfferArray
      }).then(() => {
        // From all guide's replacements, separating between requests and offers.
        this.separationBetweenRequestsAndOffers()
          .then(() => {
            // Matching between guide's offers and requests in the system.
            this.adaptingSystemRequestsToGuideOffers().then(showPage => {
              // Displaying the component.
              this.showPage = showPage
            })
          })
      })
    }
  }

  // Removing all not guide's requests that are in the 'guide's-offers' table 
  // from the 'all not guide's requests' table.
  ngAfterViewChecked(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.allGuideRequests != undefined) {
        this.allOffersRequests.forEach((offerOfRequest) => {
          this.allNotGuidesReplacementsRequests.forEach((notGuideRequest, index) => {
            if (offerOfRequest.id == notGuideRequest.id) {
              this.allNotGuidesReplacementsRequests.splice(index, 1)
            }
          })
        })
      }
    })
  }

  // Getting all requests that doesn't belong to guide.
  ngAfterContentInit(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    if (this.absService instanceof GuideService) {
      // For all replacements in the system than doesn't belong to guide.
      this.absService.getAllNotGuide_sRequests().then(allNotGuidesReplacementsRequests => {
        // Referring the given array to the 'allNotGuidesReplacementsRequests' field in the GuideService Class.
        this.allNotGuidesReplacementsRequests = allNotGuidesReplacementsRequests
        // Abling the 'requests' button.
      })
    }

  }

  // This function is for separating between guide's requests and offers.
  private separationBetweenRequestsAndOffers(): Promise<void> {
    return new Promise((res) => {
      if (this.absService instanceof GuideService) {
        // Getting all guide's replacements from the system.
        this.absService.getAllGuideReplacementsRequestsAndOffers().then(allGuideRequests => {
          // Running on the given array.
          allGuideRequests.forEach(replacement => {
            // Checking if replacement as defied Apartment field.
            if (replacement.apartment == undefined) {
              // If not, the replacement is a 'offer' type (adding to the 'allGuideOffers' array field).
              this.allGuideOffers.push(replacement)

              // If yes, the replacement is a 'request' type (and checking if the request is approved).
            } else if (replacement.inApprovalProc.toLocaleString() !== InApprovalProc.approved.toString()) {
              // If not, adding to the 'allGuideRequests' array field.
              this.allGuideRequests.push(replacement)
            }
          })
          setTimeout(() => {
            // Showing 'guide's-offers' table.
            this.showOffers = true
          }, 100);
          res()
        })
      }
    })
  }

  // This function is for matching between guide's offer and requests from the system.
  private adaptingSystemRequestsToGuideOffers(): Promise<boolean> {
    return new Promise((res) => {
      // Running on the 'allGuideOffers' array field.
      this.allGuideOffers.forEach(request => {
        if (this.absService instanceof GuideService) {
          // Getting all requests that matches offer shift times from the system.
          this.absService.checkIfOfferHasRequests(request).then(offersToRequest => {
            offersToRequest.forEach(request => {
              // Adding each one of the given array to the 'allOffersRequests' array.
              this.allOffersRequests.push(request)
            })
            // Referring the given array to the request 'requestOffers' field.
            request.requestOffers = offersToRequest
          })
        }
      })
      res(true)
    })
  }

  // This function is for showing date as dd/mm/yyyy instead of yyyy-mm-dd.
  reverseDate(replacementDatesString: string): string {
    return AbsServiceClass.reverseDate(replacementDatesString)
  }

  // This function is called when guide is pressing on the 'x' button.
  back(): void {
    // Showing 'start-page' elements.
    this.absService.showStartPageElementsEmitter?.emit(true)
    // Navigating to start page.
    AbsServiceClass.doubleNavigate(
      PrivateStringsForApp.getSlash(),
      this.userTypeService.getUserTypeString(),
      this.absService.getRouter())
  }

  // This function is called when guide is pressing on one of the 
  // apartments names in the 'all not guide's requests' table or on the 'guide's offers' table.
  goToApartmentPage(apartment: Apartment): void {
    if (this.absService instanceof GuideService) {
      // For navigating back from the 'tenants-list' component to this one. 
      this.absService.doNavigateToReplacementPage()
    }
    // Setting the apartment field in the AbsServiceClass.
    this.absService.apartment = apartment
  }

  // This function is called when guide offers him self to a 
  // request from the 'all not guide's requests' table.
  sendOfferToRequest(replacementRequest: Replacement, index: number): void {
    if (this.absService instanceof GuideService) {
      // Removing request from the table.
      this.allNotGuidesReplacementsRequests.splice(index, 1)
      // Checking the request status.
      this.absService.checkIfReplacementIsInApprovingProcess(replacementRequest.id).then(isNotInApprovalProses => {
        // If the request is not in a approval proses.
        if (isNotInApprovalProses) {
          // Sending the request for coordinator's approval.
          this.sendRequestAndOfferToCoordinatorsApproval(replacementRequest, 0)
          // Checking if guide wants to add a offer with request shift times 
          // in case coordinator rejects this request.
          if (confirm(PrivateStringsForApp.getToEnterRequestTimesHasGuideNewOfferInCaseOfRejecjen())) {
            // Adding offer to guide's replacements array in the system.
            this.setReplacmentRequestAsReplacmentOfferInSystemToGuide(replacementRequest, InApprovalProc.yes)
          }
          // If request is in approval proses, checking if guide wants to add a offer with request shift times.
        } else if (confirm(PrivateStringsForApp.getShiftIsInApprovalProsesToEnterRequestTimesHasGuideNewOffer())) {
          // Adding offer to guide's replacements array in the system.
          this.setReplacmentRequestAsReplacmentOfferInSystemToGuide(replacementRequest, InApprovalProc.no)
        }
      }, error => {
        // If guide as a shift (in the 'all guide's requests' table or in the 'guides approved offers' table)
        // that overlaps the request shift times he can't offer him self to the request
        // (showing guide's shift in the table in a red color).
        if (error.status == 409) {
          this.showUserHisReplacementInTable(JSON.parse(error.error.message))
        }
      })
    }
  }

  // This function is called when mouse is on a comment that as more then 6 chars.
  showComments(stringToShow: string, mousePosition: MouseEvent, left: string): void {
    // Showing comment on the screen.
    this.showCommentsBoolean = true
    setTimeout(() => {
      // Setting comment position.
      this.setCommentsElement(mousePosition.y, stringToShow, left)
    }, 100);
  }

  // This function is called when mouse is off a comment that as more then 6 chars.
  hideComments(): void {
    this.showCommentsBoolean = false
    this.commentsString = this.emptyString
  }

  // This function is called when mouse is on a 'start'/'end' shift time on on of the tables.
  showDayInWeek(shiftTime: ShiftTime): void {
    this.time = shiftTime.time
    var dayNumber = new Date(shiftTime.day).getDay()
    // In hebrew saturday night as a different name, checking if the day is in saturday
    // and if the hour is in the night.
    if (this.checkHour(this.time, dayNumber)) {
      dayNumber++
    }
    shiftTime.time = AbsServiceClass.getDaysInWeekArray()[dayNumber]
  }

  // This function is called when mouse is off a 'start'/'end' shift time on on of the tables.
  showShiftTime(shiftTime: ShiftTime) {
    shiftTime.time = this.time
  }

  // This function is for sending request to coordinator's approval.
  sendRequestAndOfferToCoordinatorsApproval(replacementRequest: Replacement, offerId: number): void {
    if (this.absService instanceof GuideService) {
      // Adding the request and the offer id to coordinator's approval array.
      this.absService.sendRequestAndOfferToCoordinatorsApproval(replacementRequest, offerId).then(successMessage => {
        // Displaying the success message on the screen.
        alert(successMessage)
        // Removing the offer element from the 'all guide offers' table.
        this.deleteItemFromOffersTable(offerId)
        // Reloading page.
        AbsServiceClass.doubleNavigate(
          this.userTypeService.getUserTypeString(),
          PrivateStringsForApp.navigateGuideToReplacementsPage(),
          this.absService.getRouter())
        // AbsServiceClass.doubleNavigate('/guide','guide/replacements-page',this.absService.getRouter())
      }, /** In case of error */  error => {
        if (error.status == 404) {
          // Displaying 'request not relevant' message.
          alert(PrivateStringsForApp.getRequestIsNotRelevantException())
          // Removing the request from the offer requests array field.
          this.deleteItemFromOfferRequestsArrayInGuideOffersTable(replacementRequest.id)
        } else {
          alert(error.error.message)
        }
      })
    }
  }

  // This function is called when guide deletes a replacement request/offer 
  // from one of the 'guide's requests'/'guide's offers' tables
  deleteReplacement(replacementRequestOrOffer: Replacement, replacementArray: Replacement[]): void {
    if (this.absService instanceof GuideService) {
      this.absService.deleteReplacement(replacementRequestOrOffer).then(replacementRequestId => {
        // Removing the replacement from it's table.
        replacementArray.forEach(replacement => {
          if (replacement.id == replacementRequestId) {
            const index = replacementArray.indexOf(replacement)
            if (index > -1) {
              replacementArray.splice(index, 1)
            }
          }
        })
      })
    }
  }

  // Help functions:

  // This function is called for setting the 'commentsElement' next to the component td in it's table.
  private setCommentsElement(topPx: number, stringToShow: string, left: string): void {

    if (this.commentsElement !== undefined) {
      this.commentsElement.nativeElement.style.top = topPx - 40 + PrivateStringsForApp.getPxString()
      this.commentsElement.nativeElement.style.left = left + PrivateStringsForApp.getPxString()
      this.commentsElement.nativeElement.style.paddingLeft = 15 + PrivateStringsForApp.getPxString()
      this.commentsElement.nativeElement.style.paddingRight = 15 + PrivateStringsForApp.getPxString()
      this.commentsElement.nativeElement.style.color = PrivateStringsForApp.getBlueColorString()

      this.commentsString = stringToShow
    }
  }

  // This function is for checking if the displayed day is in saturday and if the hour is in the night.
  private checkHour(hour: string, dayNumber: number): boolean {
    var startSubString = 0
    if (hour[0] == PrivateStringsForApp.getZeroString()) {
      startSubString = 1
    }
    const endSubString = 2
    const eightPm = 20
    const saturdayNumber = 6
    return Number.parseInt(hour.substring(startSubString, endSubString)) > eightPm && dayNumber == saturdayNumber
  }

  // This function is called when guide confirm adding a replacement offer to his array 
  // from the request he offered him self to.
  private setReplacmentRequestAsReplacmentOfferInSystemToGuide(replacementRequest: Replacement, inApprovalProc: InApprovalProc): void {
    const offer: Replacement = {} as Replacement
    offer.start = replacementRequest.start
    offer.end = replacementRequest.end
    offer.inApprovalProc = inApprovalProc
    offer.apartment = replacementRequest.apartment
    offer.apartment.id = 0
    // Adding the offer to guide's replacements array in the system.
    this.absService.addReplacementToUserArray(offer).then(() => { }, /** In case of error */ error => {
      // Displaying error message.
      alert(error.error.message)
    })
  }

  // This function for checking in which table guide as a replacement that 
  // overlaps the request he offered him self to.
  private showUserHisReplacementInTable(replacementId: number): void {
    var index: number = 0
    var tableNumber: string = this.emptyString
    var returnColor: string = this.emptyString

    // Running on the 'allGuideRequests' array field for checking if the overlapped replacement
    // is from there.
    this.allGuideRequests.forEach((request, i) => {
      if (request.id == replacementId) {
        index = i
        tableNumber = PrivateStringsForApp.getTableString() + PrivateStringsForApp.getTwoString()
        returnColor = PrivateStringsForApp.getReplacementTableColor()
      }
    })

    // If non of the guide requests id matched the replacement id.
    if (index == 0) {
      // Running on the 'guideReplacementApprovedOffers' array field for checking
      // if the overlapped replacement is from there.
      this.guideReplacementApprovedOffers.forEach((offer, i) => {
        if (offer.id == replacementId) {
          index = i
          tableNumber = PrivateStringsForApp.getTableString() + PrivateStringsForApp.getThreeString()
          returnColor = PrivateStringsForApp.getBlueColorString()
        }
      })
    }

    // Flashing the replacement element in the relevant table.
    this.lightReplacementInTable(index, tableNumber, returnColor)
  }

  // This function is called flashing of the alternate element in alternating red and blue colors.
  private lightReplacementInTable(index: number, tableId: string, returnColor: string): void {
    const trInTable = (<Element>document.getElementById(PrivateStringsForApp.getIndexString() + tableId + index))

    var times = 3

    const intervalId = setInterval(() => {
      trInTable.scrollIntoView(true)
      setTimeout(() => {
        trInTable.setAttribute(PrivateStringsForApp.getStyleString(), this.setElementColor(PrivateStringsForApp.getRedColorString()))
      }, 500);
      setTimeout(() => {
        trInTable.setAttribute(PrivateStringsForApp.getStyleString(), this.setElementColor(returnColor))
      }, 1000);
      times--
      if (times === 0) {
        clearInterval(intervalId)
      }
    }, 1500)
  }

  // This function is called for setting element's color.
  private setElementColor(color: string): string {
    return PrivateStringsForApp.getBackgroundString() + color + PrivateStringsForApp.getCommaDot()
  }

  // This function is for deleting offer request from 'all guide offers' table.
  private deleteItemFromOffersTable(offerId: number): void {
    if (offerId > 0) {
      this.allGuideOffers.forEach(offers => {
        if (offers.id == offerId) {

          const index = this.allGuideOffers.indexOf(offers)
          if (index > -1) {
            this.allGuideOffers.splice(index, 1)
          }
        }
      })
    }
  }

  // This function for deleting a request from a offer 'requestOffers' field in the 'all guide offers' table.
  private deleteItemFromOfferRequestsArrayInGuideOffersTable(replacementRequestId: number): void {
    this.allGuideOffers.forEach(offer => {
      offer.requestOffers.forEach(request => {
        if (request.id == replacementRequestId) {
          offer.requestOffers.splice(offer.requestOffers.indexOf(request), 1)
          // Breaking out of the loop.
          return;
        }
      })
    })
  }

}