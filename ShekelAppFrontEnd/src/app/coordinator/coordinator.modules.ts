import { Apartment } from '../apartment/apartment.modules'
import { Worker } from '../common/main-objects/worker.modules'
import { WidthGuide } from '../width-guide/width-guide-modules'

export class Coordinator extends Worker {

    id: number
    widthGuide: WidthGuide
    apartments: Apartment[]

    constructor(
        id: number,
        widthGuide: WidthGuide,
        apartments: Apartment[],
    ) {
        super()
        this.id = id
        this.widthGuide = widthGuide
        this.apartments = apartments
    }

}