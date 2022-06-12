import { Byte } from '@angular/compiler/src/util'
import { ApartmentsAndTenantsGender } from '../apartmentsAndTenantsGender'

export class ShekelMember {
    firstName: string
    lastName: string
    phoneNumber: string
    gender: ApartmentsAndTenantsGender
    image: Byte[]

    constructor(
        firstName: string,
        lastName: string,
        phoneNumber: string,
        gender: ApartmentsAndTenantsGender,
        image: Byte[],
    ) {
        this.firstName = firstName
        this.lastName = lastName
        this.phoneNumber = phoneNumber
        this.gender = gender
        this.image = image
    }

}