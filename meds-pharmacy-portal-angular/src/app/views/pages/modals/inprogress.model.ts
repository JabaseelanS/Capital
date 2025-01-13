export class InprogressModel {
    MedicineName: string;
    MedicineInfo: string;
    Quantity: number;
    OrderStatus: number;
    ModifiedOn: Date;
    CreatedOn: Date;
    MedicineStatus: number;
    NoOfRepeats: number;

    constructor(InprogressModel?) {
        InprogressModel = InprogressModel || {};
        this.MedicineName = InprogressModel.MedicineName || '';
        this.MedicineInfo = InprogressModel.MedicineInfo || '';
        this.OrderStatus = InprogressModel.OrderStatus;
        this.MedicineStatus = InprogressModel.MedicineStatus;
        this.NoOfRepeats = InprogressModel.NoOfRepeats;

        this.Quantity = InprogressModel.Quantity;
        this.ModifiedOn = InprogressModel.ModifiedOn || new Date();
        this.CreatedOn = InprogressModel.CreatedOn || new Date();



    }
}