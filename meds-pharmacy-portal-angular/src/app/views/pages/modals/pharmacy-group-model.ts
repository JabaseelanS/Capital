export class PharmacyGrpModel {
    PharmacyGrpId: number;
    PharmacyGrpName: string;
    ContactName: string;
    Email: string;
    PhoneNo1: string;
    PhoneNo2: string;
    FaxId: string;
    City: string;
    StateId: number;
    CountryId: number;
    Pincode: string;
    OpeningHours: string;
    ClosingHours: string;
    ModifiedOn: Date;
    CreatedOn: Date;
    ModifiedBy: number;
    IsActive: boolean;
    Address: string;
    pharmacyserve_list: any;
    CreatedBy: number;
    QrCode: string;
    pharmacyGrpServingsList: any;

    constructor(PharmacyGrpModel?) {
        PharmacyGrpModel = PharmacyGrpModel || {};
        this.pharmacyserve_list = PharmacyGrpModel.pharmacyserve_list || [];
        this.QrCode = PharmacyGrpModel.QrCode || "";
        this.PharmacyGrpId = PharmacyGrpModel.PharmacyGrpId || 0;
        this.PharmacyGrpName = PharmacyGrpModel.PharmacyGrpName || '';
        this.ContactName = PharmacyGrpModel.ContactName || '';
        this.Email = PharmacyGrpModel.Email || '';
        this.PhoneNo1 = PharmacyGrpModel.PhoneNo1 || '';
        this.PhoneNo2 = PharmacyGrpModel.PhoneNo2 || '';
        this.City = PharmacyGrpModel.City || '';
        this.StateId = PharmacyGrpModel.StateId || 0;
        this.CountryId = PharmacyGrpModel.CountryId || 0;
        this.Pincode = PharmacyGrpModel.Pincode || '';
        this.Address = PharmacyGrpModel.Address || '';
        this.FaxId = PharmacyGrpModel.FaxId || '';
        this.ModifiedBy = PharmacyGrpModel.ModifiedBy || 0;
        this.OpeningHours = PharmacyGrpModel.OpeningHours || '';
        this.ClosingHours = PharmacyGrpModel.ClosingHours || '';
        this.ModifiedOn = PharmacyGrpModel.ModifiedOn || new Date();
        this.CreatedOn = PharmacyGrpModel.CreatedOn || new Date();
        this.IsActive = PharmacyGrpModel.IsActive || true;
        this.CreatedBy = PharmacyGrpModel.CreatedBy || 0;
        this.pharmacyGrpServingsList = PharmacyGrpModel.pharmacyGrpServingsList;
    }

}