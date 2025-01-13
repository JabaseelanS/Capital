export class CustomerModel {
    FirstName: string;
    LastName: string;
    Mobileno: number;
    EmailId: string;
    Dob: string;
    MedicareNo: string;
    MedicareValidTo: string;
    ConcessionNo: string;
    ConcessionValidTo: string;
    Address: string;
    IsPreferredPharmacy: boolean;
    IsDefault: boolean;

    constructor(CustomerModel?) {
        CustomerModel = CustomerModel || {};
        this.FirstName = CustomerModel.FirstName || '';
        this.LastName = CustomerModel.LastName || '';
        this.Mobileno = CustomerModel.Mobileno || 0;
        this.EmailId = CustomerModel.EmailId || '';
        this.Dob = CustomerModel.Dob || '';
        this.MedicareNo = CustomerModel.MedicareNo || '';
        this.MedicareValidTo = CustomerModel.MedicareValidTo || '';
        this.ConcessionNo = CustomerModel.ConcessionNo || '';
        this.ConcessionValidTo = CustomerModel.ConcessionValidTo || '';
        this.Address = CustomerModel.Address || '';
        this.IsPreferredPharmacy = CustomerModel.IsPreferredPharmacy || false;
        this.IsDefault = CustomerModel.IsDefault || false;
    }
}