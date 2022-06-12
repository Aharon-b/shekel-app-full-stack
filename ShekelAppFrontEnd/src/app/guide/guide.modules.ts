import { Apartment } from '../apartment/apartment.modules'
import { Worker } from '../common/main-objects/worker.modules'
import { Replacement } from '../replacements/replacement.modules'

export class Guide extends Worker {
    id: number
    apartments: Apartment[]
    replacementRequests: Replacement[]

    constructor(

        id: number,
        apartments: Apartment[],
        replacementRequests: Replacement[]
    ) {
        super()
        this.id = id
        this.apartments = apartments
        this.replacementRequests = replacementRequests
    }

}