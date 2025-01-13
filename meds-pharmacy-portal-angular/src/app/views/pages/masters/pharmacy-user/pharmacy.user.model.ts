export class PharmacyUserModel {
    UserId: number;
    UserName: string;
    UserPassword: string;
    Mobileno: string;
    FirstName: string;
    LastName: string;
    Gender: number;
    UserEmail: string;
    UserDob: string;
    Phoneno1: string;
    Phoneno2: string;
    Status: boolean;
    designation: string;
    Address1: string;
    Address2: string;
    address3: string;
    address4: string;
    City: string;
    StateId: number;
    CountryId: number;
    Pincode: string;
    userprofile: string;
    userType: string;
    IsPharmacyGroup: number;
    loginHistory: any;
    connectedPharmcies: any;
    // Pillmate
    BankName: string;
    AccountNumber: string;
    BranchName: string;
    IfscCode: string;
    RoleId: number;
    // Pharmacy
    PharmacyId: number;

    ModifiedOn: Date;
    CreatedOn: Date;

    constructor(userModel?) {
        userModel = userModel || {};
        this.UserId = userModel.UserId || 0;
        this.UserName = userModel.UserName || '';
        this.Status = userModel.Status || true;
        this.UserPassword = userModel.UserPassword || '';
        this.UserEmail = userModel.UserEmail || '';
        this.UserDob = userModel.UserDob || '';
        this.Phoneno1 = userModel.Phoneno1 || '';
        this.Phoneno2 = userModel.Phoneno2 || '';
        this.designation = userModel.designation || 'Admin';
        this.Address1 = userModel.Address1 || '';
        this.Address2 = userModel.Address2 || '';
        this.address3 = userModel.address3 || '';
        this.address4 = userModel.address4 || '';
        this.StateId = userModel.StateId || 0;
        this.CountryId = userModel.CountryId || 0;
        //this.usercode = userModel.usercode || '';
        this.userprofile = userModel.userprofile || '';
        this.userType = userModel.userType || '';
        this.IsPharmacyGroup = userModel.IsPharmacyGroup || 0;
        this.loginHistory = userModel.loginHistory || null;
        this.Mobileno = userModel.Mobileno || '';
        this.FirstName = userModel.FirstName || '';
        this.LastName = userModel.LastName || '';
        this.Gender = userModel.Gender || 0;
        this.City = userModel.City || '';
        this.Pincode = userModel.Pincode || '';
        this.BankName = userModel.BankName || '';
        this.AccountNumber = userModel.AccountNumber || '';
        this.BranchName = userModel.BranchName || '';
        this.IfscCode = userModel.IfscCode || '';
        this.connectedPharmcies = userModel.connectedPharmcies || null;
        this.RoleId = 3;
        this.PharmacyId = userModel.PharmacyId || 0;

        this.ModifiedOn = userModel.ModifiedOn || new Date();
        this.CreatedOn = userModel.CreatedOn || new Date();

    }
}