export class PharmacyUserModel {
    UserId: number;
    UserName: string;
    UserPassword: string;
    Mobileno: string;
    FirstName: string;
    LastName: string;
    Gender: number;
    UserEmail: string;
    UserDob: Date;
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
    PharmacyGroupUserId: string;
    userprofile: string;
    userType: string;
    loginHistory: any;
    connectedPharmcies: any;
    RoleId: number;
    IsUserType: boolean;
    // Pillmate
    BankName: string;
    AccountNumber: string;
    BranchName: string;
    IfscCode: string;
    pharmacyUsers: any;
    // Pharmacy
    PharmacyId: number;
    CreatedBy: number;
    ModifiedOn: Date;
    CreatedOn: Date;
    IsPharmacyGroup: number;
    IsGroupAdmin: boolean;

    constructor(userModel?) {
        userModel = userModel || {};
        this.UserId = userModel.UserId || 0;
        this.UserName = userModel.UserName || '';
        this.Status = userModel.Status || true;
        this.UserPassword = userModel.UserPassword || '';
        this.UserEmail = userModel.UserEmail || '';
        this.UserDob = userModel.UserDob || new Date();
        this.IsPharmacyGroup = userModel.IsPharmacyGroup || 0;
        this.IsGroupAdmin = userModel.IsGroupAdmin || 0;
        this.Phoneno1 = userModel.Phoneno1 || '';
        this.Phoneno2 = userModel.Phoneno2 || '';
        this.designation = userModel.designation || 'Admin';
        this.Address1 = userModel.Address1 || '';
        this.Address2 = userModel.Address2 || '';
        this.address3 = userModel.address3 || '';
        this.address4 = userModel.address4 || '';
        this.StateId = userModel.StateId || 0;
        this.pharmacyUsers = userModel.pharmacyUsers || [];
        this.CountryId = userModel.CountryId || 0;
        this.PharmacyGroupUserId = userModel.PharmacyGroupUserId || "";
        //this.usercode = userModel.usercode || '';
        this.userprofile = userModel.userprofile || '';
        this.userType = userModel.userType || '';
        this.loginHistory = userModel.loginHistory || null;
        this.Mobileno = userModel.Mobileno || '';
        this.FirstName = userModel.FirstName || '';
        this.LastName = userModel.LastName || '';
        this.Gender = userModel.Gender || null;
        this.City = userModel.City || '';
        this.Pincode = userModel.Pincode || '';
        this.BankName = userModel.BankName || '';
        this.AccountNumber = userModel.AccountNumber || '';
        this.BranchName = userModel.BranchName || '';
        this.IfscCode = userModel.IfscCode || '';
        this.connectedPharmcies = userModel.connectedPharmcies || null;
        this.RoleId = 3;
        this.IsUserType = userModel.IsUserType || false;
        this.PharmacyId = userModel.PharmacyId || null;
        this.CreatedBy = userModel.CreatedBy || 0;
        this.ModifiedOn = userModel.ModifiedOn || new Date();
        this.CreatedOn = userModel.CreatedOn || new Date();

    }
}