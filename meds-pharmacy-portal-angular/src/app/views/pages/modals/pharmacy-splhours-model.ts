export class PharmacySplHoursModel {
    PharmacyId: number;
    Days: string;
    SpecialhrsId: number;
    SpecialhrsDate: Date;
    FromDate: Date;
    SearchForPharmacies: string;
    ExcludedPharmacies: string;
    StateId: string;
    ToDate: Date;
    OpeningHours: string;
    ClosingHours: string;
    LabelAs: string;
    RepeatEveryYear: boolean;
    IsClosed: boolean;
    IsActive: boolean;
    FormandToDate: string;
    CreatedOn: Date;
    CreatedBy: number;

    constructor(PharmacyModel?) {
        PharmacyModel = PharmacyModel || {};
        this.SpecialhrsId = PharmacyModel.SpecialhrsId || 0;
        this.PharmacyId = PharmacyModel.PharmacyId || 0;
        this.OpeningHours = PharmacyModel.OpeningHours || '';
        this.ClosingHours = PharmacyModel.ClosingHours || '';
        this.FormandToDate = PharmacyModel.FormandToDate || '';
        this.LabelAs = PharmacyModel.LabelAs || '';
        this.SearchForPharmacies = PharmacyModel.SearchForPharmacies || '';
        this.StateId = PharmacyModel.StateId || '';
        this.ExcludedPharmacies = PharmacyModel.ExcludedPharmacies || "";
        this.Days = PharmacyModel.Days || "";
        this.RepeatEveryYear = PharmacyModel.RepeatEveryYear || false;
        this.IsClosed = PharmacyModel.IsClosed || false;
        this.IsActive = PharmacyModel.IsActive || false;
        this.CreatedOn = PharmacyModel.CreatedOn || Date();
        this.CreatedBy = PharmacyModel.CreatedBy || 0;
    }

}