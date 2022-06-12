import { Byte } from '@angular/compiler/src/util'
import { Tenant } from 'src/app/tenant/tenant.modules'

export class Medicine {

    id: number
    name: string
    amount: string
    time: string
    tenant: Tenant
    image: Byte[]

    constructor(
        id: number,
        name: string,
        amount: string,
        time: string,
        tenant: Tenant,
        image: Byte[]) {
        this.id = id
        this.name = name
        this.amount = amount
        this.time = time
        this.tenant = tenant
        this.image = image
    }

}