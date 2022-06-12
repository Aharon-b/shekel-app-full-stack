import { Time } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Apartment } from 'src/app/apartment/apartment.modules';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Guide } from 'src/app/guide/guide.modules';
import { GuideService } from 'src/app/guide/guide.service';
import { InApprovalProc } from '../inApprovalProc';
import { Replacement } from '../replacement.modules';
import { ShiftTime } from '../shift_time.modules';

@Component({
  selector: 'app-add-replacement-request-or-offer',
  templateUrl: './add-replacement-request-or-offer.component.html',
  styleUrls: ['./add-replacement-request-or-offer.component.css']
})

export class AddReplacementRequestOrOfferComponent implements OnInit {
  // For when fields in the class needs to be empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()

  // (property  binding from 'guide-start' component).
  // Initialize an empty object of type boolean.
  @Input() kindOfReplacement: boolean = {} as boolean
  // Initialize an empty object of type Guide.
  @Input() guide: Guide = {} as Guide

  // For form title.
  title: string = PrivateStringsForApp.getHebrewReplacementString()
  // For time inputs in the form.
  startTime: string = this.emptyString
  endTime: string = this.emptyString
  // For success/error messages display.
  msgDisplay: string = this.emptyString

  // Initialize an empty object of type Apartment.
  selectedApartment: Apartment = {} as Apartment
  // Initialize an empty array of type Apartment.
  userApartments: Apartment[] = []

  // Initialize an empty object of type ReplacementRequest.
  replacementRequest: Replacement = {
    start: {} as ShiftTime,
    end: {} as ShiftTime,
  } as Replacement

  // For checking if times are valid.
  startTimeObj: Time = {} as Time
  endTimeObj: Time = {} as Time

  // For checking if dates are valid.
  today: Date = new Date()

  constructor(
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
    private userTypeService: GetUserTypeService
  ) {
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void {
    // Checking operation type.
    if (this.kindOfReplacement) {
      // If request operation:

      // Getting user's apartments.
      this.absService.getUserApartments()
      this.absService.apartmentsEmitter.subscribe(userApartments => {
        // Referring the 'guideApartments' array field to the emitted array.
        this.userApartments = userApartments
        // Referring the 'selectedApartment' field to the first element of the emitted array.
        this.selectedApartment = this.userApartments[0]
      })
      // Setting the 'title' field as 'replacement request'.
      this.setTitleType(PrivateStringsForApp.getHebrewRequestString())
    } else {
      // If offer operation:
      // Setting the 'title' field as 'replacement offer'.
      this.setTitleType(PrivateStringsForApp.getHebrewOfferString())
    }
  }

  // When user is pressing the submit button.
  onSubmit() {
    // Setting the 'startTimeObj' & 'endTimeObj' fields for the 'checkIfFormIsValid()' function.
    this.setTime()
    // Checking form validation.
    if (this.checkIfFormIsValid()) {
      // Setting Replacement Fields.
      this.setReplacementFields()
      // Adding the replacement to the system.
      this.absService.addReplacementToUserArray(this.replacementRequest).then(() => {
        // Showing success operation message for two seconds & hiding the component.
        setTimeout(() => {
          this.absService.showReplacementRequestEmitter.emit(false)
          this.msgDisplay = this.emptyString
        }, 2000);
        this.msgDisplay = this.title + PrivateStringsForApp.getSuccessAddingReplacementMessage()
      }, /** In case of error */ error => {
        /** displaying error message */ this.displayErrorMsg(error.error.message)
      })
    }
  }

  // This function is called when user is leaving one of the date input fields.
  checkIfDateIsOver(startOrEndDate: number) {
    // For error message in case of error.
    var startOrEndErrorText;
    // In case the given parameter is the start date & date is before today.
    if (startOrEndDate == 0 && this.setConditionIfDateIsOver(this.replacementRequest.start.day)) {
      // Resetting the start date input field.
      this.resetStartDate()
      startOrEndErrorText = PrivateStringsForApp.getHebrewStartString()
      // In case the given parameter is the end date & date is before today.
    } else if (startOrEndDate == 1 && this.setConditionIfDateIsOver(this.replacementRequest.end.day)) {
      // Resetting the end date input field.
      this.resetEndDate()
      startOrEndErrorText = PrivateStringsForApp.getHebrewEndString()
    } else {
      // Date is valid.
      return;
    }
    // Display the '...(start/end) date is over' error message.
    this.displayErrorMsg(PrivateStringsForApp.dateIsOverMessage(startOrEndErrorText))
  }

  // This function is called when user is canceling the operation.
  onCancel() {
    this.absService.showReplacementRequestEmitter.emit(false)
  }

  // Help functions:

  // For setting the 'startTimeObj' & 'endTimeObj' fields.
  private setTime() {
    const currentTimesArray: string[] = []

    this.setTimesArray().forEach(timeString => {
      if (timeString.substring(0, 1) == PrivateStringsForApp.getZeroString()) {
        timeString = timeString.substring(1, 2)
      }
      currentTimesArray.push(timeString)
    })

    this.setTimesJson(currentTimesArray)
  }

  // For splitting time fields & returning them inside array.
  private setTimesArray() {
    const hourStartIndex: number = 0
    const hourEndIndex: number = 2
    const minuteStartIndex: number = 3
    const minuteEndIndex: number = 5
    const startTimeHour: string = this.startTime.substring(hourStartIndex, hourEndIndex)
    const startTimeMinute: string = this.startTime.substring(minuteStartIndex, minuteEndIndex)
    const endTimeHour: string = this.endTime.substring(hourStartIndex, hourEndIndex)
    const endTimeMinute: string = this.endTime.substring(minuteStartIndex, minuteEndIndex)
    return [startTimeHour, startTimeMinute, endTimeHour, endTimeMinute]
  }

  // For setting the 'startTimeObj' & 'endTimeObj' fields .
  private setTimesJson(currentTimesArray: string[]) {
    this.startTimeObj = {
      hours: JSON.parse(currentTimesArray[0]),
      minutes: JSON.parse(currentTimesArray[1])
    } as Time

    this.endTimeObj = {
      hours: JSON.parse(currentTimesArray[2]),
      minutes: JSON.parse(currentTimesArray[3])
    } as Time
  }

  // For checking if the given date parameter is over.
  private setConditionIfDateIsOver(dateToCheck: Date): boolean {
    return dateToCheck !== undefined && dateToCheck.toString() !== this.emptyString
      && this.setDateObject(dateToCheck) < this.setDateObject(this.today)
      && this.setDateObject(dateToCheck).toString().substring(0, 15) !== this.today.toString().substring(0, 15)
  }

  // For checking all of the scenarios that could invalidate the form
  // and displaying the error message if form dates/times is invalid.
  private checkIfFormIsValid(): boolean {
    const startDate = this.setDateObject(this.replacementRequest.start.day)
    startDate.setHours(this.startTimeObj.hours)
    startDate.setMinutes(this.startTimeObj.minutes)
    const endDate = this.setDateObject(this.replacementRequest.end.day)
    endDate.setHours(this.endTimeObj.hours)
    endDate.setMinutes(this.endTimeObj.minutes)
    if (startDate.valueOf() > endDate.valueOf()) {
      this.resetEndDate()
      this.displayErrorMsg(PrivateStringsForApp.getEndBeforeStartErrorMessage())

      return false
    } else if (endDate.getDay() == startDate.getDay() && endDate.getMonth() == startDate.getMonth()) {
      if (this.startTimeObj.hours > this.endTimeObj.hours || this.startTimeObj.hours == this.endTimeObj.hours && this.startTimeObj.minutes > this.endTimeObj.minutes) {

        this.resetEndTime()
        this.displayErrorMsg(PrivateStringsForApp.getEndBeforeStartInSameDateErrorMessage())
        return false
      } else if ((startDate.valueOf() + PrivateStringsForApp.getLessThenMinHoursInMilliSeconds()) > endDate.valueOf()) {

        this.resetEndTime()
        this.displayErrorMsg(PrivateStringsForApp.getMinReplacementTimeMessage(this.title))
        return false
      }
    } else if (endDate.valueOf() > (startDate.valueOf() + PrivateStringsForApp.getMoreThenMaxDaysInMilliSeconds())) {
      this.resetEndDate()
      this.displayErrorMsg(PrivateStringsForApp.getToFarEndDateMsg())
      return false
    }
    // If form times are valid.
    return true
  }

  // For setting the replacement fields.
  private setReplacementFields() {
    this.replacementRequest.start.time = this.startTime
    this.replacementRequest.end.time = this.endTime
    this.replacementRequest.apartment = this.selectedApartment
    this.replacementRequest.inApprovalProc = InApprovalProc.no
  }

  // For displaying error message on the screen.
  private displayErrorMsg(msg: string) {
    this.absService.flashErrorMessage(msg, 3)
    this.absService.msgEmitter.subscribe(msg => {
      setTimeout(() => {
        this.msgDisplay = this.emptyString
      }, 1000);
      this.msgDisplay = msg
    })
  }

  // For setting form title field.
  private setTitleType(typeOfRequest: string) {
    this.title = typeOfRequest + PrivateStringsForApp.getEmptySpaceString() + this.title
  }

  private setDateObject(dateToSet: Date): Date {
    return new Date(dateToSet)
  }

  // Reset dates & times fields function:

  private resetStartDate() {
    const saveTime = this.replacementRequest.start.time
    this.replacementRequest.start = { time: saveTime } as ShiftTime
  }

  private resetEndDate() {
    const saveTime = this.replacementRequest.end.time
    this.replacementRequest.end = { time: saveTime } as ShiftTime
  }

  private resetEndTime() {
    this.endTime = PrivateStringsForApp.resetTimeFiled()
  }

}
