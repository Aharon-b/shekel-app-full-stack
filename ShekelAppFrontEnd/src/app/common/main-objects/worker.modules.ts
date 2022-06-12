import { PrivateStringsForApp } from '../PrivateStringsForApp';
import { ShekelMember } from './shekelMember.modules';

export class Worker {
    shekelMember: ShekelMember
    username: string

    constructor() {
        this.shekelMember = {} as ShekelMember
        this.username = PrivateStringsForApp.getEmptyString()
    }

}