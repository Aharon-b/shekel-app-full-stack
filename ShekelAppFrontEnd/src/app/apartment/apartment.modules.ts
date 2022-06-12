import { Byte } from '@angular/compiler/src/util'
import { SafeUrl } from '@angular/platform-browser'
import { ApartmentsAndTenantsGender } from '../common/apartmentsAndTenantsGender'
import { Coordinator } from '../coordinator/coordinator.modules'
import { Guide } from '../guide/guide.modules'
import { Tenant } from '../tenant/tenant.modules'

export class Apartment {
    id: number
    name: string
    image: Byte[]
    phoneNumber: string
    address: string
    imageUrl: SafeUrl = {}
    coordinator: Coordinator
    guides: Guide[]
    tenants: Tenant[] = []
    gender: ApartmentsAndTenantsGender

    constructor(
        id: number,
        name: string,
        phoneNumber: string,
        address: string,
        image: Byte[],
        coordinator: Coordinator,
        guides: Guide[],
        tenants: Tenant[],
        gender: ApartmentsAndTenantsGender,

    ) {
        this.id = id
        this.name = name
        this.phoneNumber = phoneNumber
        this.address = address
        this.image = image
        this.coordinator = coordinator
        this.guides = guides
        this.tenants = tenants
        this.gender = gender
    }

}