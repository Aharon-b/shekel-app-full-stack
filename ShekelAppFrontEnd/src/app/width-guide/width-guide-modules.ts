import { Worker } from '../common/main-objects/worker.modules'
import { Coordinator } from '../coordinator/coordinator.modules'

export class WidthGuide extends Worker {

    id: number
    coordinator: Coordinator

    constructor(
        id: number,
        coordinator: Coordinator
    ) {
        super()
        this.id = id
        this.coordinator = coordinator
    }

}