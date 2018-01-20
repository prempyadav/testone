export class Country {
    public id: string;
    public name: string;
    public isoCode: string;
    public rssFeed: string;

    public Country() {
        this.id = "";
        this.name = "";
        this.isoCode = "";
        this.rssFeed = "";
    }
    
    //constructor(public id: number, public name: string) { }

}