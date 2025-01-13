export class StateDb {
    id: any;
    name: string;

    public static state: any = [
        {
            "id": 1,
            "name": "New South Wales",
            "abbreviation": "NSW"
        },
        {
            "id": 2,
            "name": "Victoria",
            "abbreviation": "VIC"
        },
        {
            "id": 3,
            "name": "Queensland",
            "abbreviation": "QLD"
        },
        {
            "id": 4,
            "name": "Tasmania",
            "abbreviation": "TAS"
        },
        {
            "id": 5,
            "name": "South Australia",
            "abbreviation": "SA"
        },
        {
            "id": 6,
            "name": "Western Australia",
            "abbreviation": "WA"
        },
        {
            "id": 7,
            "name": "Northern Territory",
            "abbreviation": "NT"
        },
        {
            "id": 8,
            "name": "Australian Capital Territory",
            "abbreviation": "ACT"
        }
    ]

    // constructor(stateModel?) {
    //     stateModel = stateModel || {};
    //     this.StateId = userModel.id || '';
    //     this.UserName = userModel.UserName || '';
    // }

}