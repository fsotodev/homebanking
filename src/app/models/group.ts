export class Group {
    public id?: string;
    public groupId: string;
    public active: boolean;
    public order: number;
    public name: string;
    public icon: string;


    constructor() {
        this.groupId = '';
        this.active = false;
        this.order = 1;
        this.name = '';
        this.icon = '';
    }
}