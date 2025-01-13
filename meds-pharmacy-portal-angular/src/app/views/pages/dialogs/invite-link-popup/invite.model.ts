export class InviteModel {
    MobileNo: string;
    FirstName: string;
    LastName: string;
    PharmacyId: number;
    constructor(inviteModel) {
        this.MobileNo = inviteModel.MobileNo || '';
        this.FirstName = inviteModel.FirstName || '';
        this.LastName = inviteModel.LastName || '';
        this.PharmacyId = inviteModel.PharmacyId || 0;
    }
}