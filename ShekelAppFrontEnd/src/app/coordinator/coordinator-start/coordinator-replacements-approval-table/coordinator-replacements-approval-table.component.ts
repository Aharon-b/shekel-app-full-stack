import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Guide } from 'src/app/guide/guide.modules';
import { Replacement } from 'src/app/replacements/replacement.modules';
import { CoordinatorService } from '../../coordinator.service';

@Component({
  selector: 'app-coordinator-replacements-approval-table',
  templateUrl: './coordinator-replacements-approval-table.component.html',
  styleUrls: ['./coordinator-replacements-approval-table.component.css']
})

export class CoordinatorReplacmentsApprovalTableComponent implements OnInit {
  // (property binding from 'coordinator-start' component).
  // Initialize an empty array of type JSON.
  @Input("coordinatorApprovalArray") coordinatorApprovalArray: JSON[] = []

  constructor(
    private elementRef: ElementRef,
    private userTypeService: GetUserTypeService,

    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.absService = this.userTypeService.getAbsService()
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#66CDAA';
  }

  ngOnInit(): void {

    setTimeout(() => {
      // For each JSON object in the array.
      this.coordinatorApprovalArray.forEach((approvalJson, index) => {
        // Setting the td table inner text be its index in the array .
        this.setTdInnerText(approvalJson, index)
      })
    }, 100);
  }

  // This function is called when coordinator is pressing on the green (approve) button .
  onApproval(index: number): void {
    if (this.absService instanceof CoordinatorService) {
      // Referring the chosen replacement to a object.
      const json = this.coordinatorApprovalArray[index]
      // Sending the approved replacement to the back-end.
      this.absService.approveReplacementRequest(this.getGuideFromJson(json).id,
        this.getReplacementRequestFromJson(json).id).then(approvedSuccessMsg => {
          // Showing the 'replacement request was approved' message. 
          alert(approvedSuccessMsg)
          // Refreshing coordinator's page.
          AbsServiceClass.doubleNavigate(PrivateStringsForApp.getSlash(),
            PrivateStringsForApp.getCoordinatorEnglishString(),
            this.absService.getRouter())
          // In case of error.
        }, error => {
          // Showing error message.
          alert(error.error.message)
        })
    }
  }

  // This function is called when coordinator is pressing on the red (reject) button .
  onReject(index: number): void {
    if (this.absService instanceof CoordinatorService) {
      // Referring the chosen replacement to a object.
      const json = this.coordinatorApprovalArray[index]
      // Sending the rejected replacement to the back-end.
      this.absService.rejectedReplacementRequest(this.getGuideFromJson(json),
        this.getReplacementRequestFromJson(json).id)
        .then(rejectedSuccessMsg => {
          // Showing the 'replacement request was rejected' message. 
          alert(rejectedSuccessMsg)
          // Refreshing coordinator's page.
          AbsServiceClass.doubleNavigate(PrivateStringsForApp.getSlash(),
            PrivateStringsForApp.getCoordinatorEnglishString(),
            this.absService.getRouter())
          // In case of error.
        }, error => {
          // Showing error message.
          alert(error)
        })
    }
  }


  // Help functions:

  // This function is setting the inner text for each replacement td in the table.
  private async setTdInnerText(approvalObj: JSON, index: number): Promise<void> {
    const guide: Guide = this.getGuideFromJson(approvalObj)
    const replacementRequest: Replacement = this.getReplacementRequestFromJson(approvalObj)
    const td = (<Element>document.getElementById(PrivateStringsForApp.getIndexString() + index))
    var replacedGuideName: string = PrivateStringsForApp.getEmptyString()
    if (replacementRequest.guide != null) {
      if (this.absService instanceof CoordinatorService) {
        await this.absService.getGuideDetails(replacementRequest.guide.id).then(systemGuide => {
          replacedGuideName = PrivateStringsForApp.getToReplaceString() + systemGuide.shekelMember.firstName
        })
      }
    }

    if (td != null) {
      td.innerHTML = PrivateStringsForApp.coordinatorApprovalInTableDisplay
        (guide.shekelMember, replacedGuideName, replacementRequest,
          this.reverseDate(replacementRequest.start.day.toLocaleString()),
          this.reverseDate(replacementRequest.end.day.toLocaleString()))
    }
  }

  // This function is reversing the shift dates.
  private reverseDate(replacementDatesString: string): string {
    return AbsServiceClass.reverseDate(replacementDatesString)
  }

  // This function extracts the Guide object from the JSON object.
  private getGuideFromJson(jsonObj: JSON): Guide {
    return this.setJsonObj(jsonObj).guide
  }

  // This function extracts the ReplacementRequest object from the JSON object.
  private getReplacementRequestFromJson(jsonObj: JSON): Replacement {
    return this.setJsonObj(jsonObj).replacementRequest
  }

  // This function sets the JSON object as js object.
  private setJsonObj(jsonObj: JSON): any {
    return JSON.parse(JSON.stringify(jsonObj))
  }

}
