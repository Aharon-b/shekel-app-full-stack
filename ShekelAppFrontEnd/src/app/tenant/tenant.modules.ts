import { Apartment } from '../apartment/apartment.modules'
import { Chore } from '../chores/chores.modules'
import { ShekelMember } from '../common/main-objects/shekelMember.modules'
import { Medicine } from '../medicine/medicine-list/medicine.modules'

export class Tenant {

    id: number
    shekelMember: ShekelMember
    workPlace: string
    description: string
    apartment: Apartment
    medicine: Medicine[] = []
    chores: Chore[] = []
    birthDay: Date

    constructor(
        id: number = 0,
        shekelMember: ShekelMember,
        workPlace: string,
        description: string,
        apartment: Apartment,
        medicine: Medicine[],
        chores: Chore[],
        birthDay: Date
    ) {
        this.id = id
        this.shekelMember = shekelMember
        this.workPlace = workPlace
        this.description = description
        this.apartment = apartment
        this.chores = chores
        this.medicine = medicine
        this.birthDay = birthDay
    }

}