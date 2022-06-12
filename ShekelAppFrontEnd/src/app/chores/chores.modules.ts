export class Chore {

    id: number
    name: string
    description: string
    day: string

    constructor(id: number, name: string, description: string, day: string) {
        this.id = id
        this.name = name
        this.description = description
        this.day = day
    }

}