import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  countryList: any = [{ "id": 1, "name": "Australia" }, { "id": 2, "name": "India" }];
  stateList: any = [{ "id": 1, "name": "Tamil Nadu" }, { "id": 2, "name": "Pondycherry" }];
  designationList: any = [{ "id": 1, "name": "Manager" }, { "id": 2, "name": "Admin" }];

  baseUrl = 'http://localhost:4200/api/';

  constructor() { }

}