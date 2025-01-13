export class PrescriptionModel {
    PrescriptionDetailId: number;
    OrderId: number;
    SubOrderId: number;
    PrescriptionId: number;
    MedicineInfo: string;
    NoOfRepeats: string;
    Quantity: string;
    Price: string;
    MedicineName: string;
    OrderScriptId: string;
    Barcode: string;
    OScriptId: string;
    RepeatInterval: string;
    Mobileno: string;
    IsActive: boolean;
    IsMedicineStatus: number;
    CreatedBy: number;
    ModifiedOn: Date;
    CreatedOn: Date;
    IsUploadBy: boolean;
    IsStock: boolean;
    IsUploadType: number;
    Repeats: number;
    TotalRepeats: number;
    DaysRemaining: number;
    OriginalPrice: string;
    PriceVersion: number;
    RemainingRepeats: number;
    FamilyId: number;
    DrugScheduleB: boolean;
    MarketPlaceItemStatus: number;

    constructor(Model?) {
        Model = Model || {};
        this.PrescriptionDetailId = Model.PrescriptionDetailId || 0;
        this.PrescriptionId = Model.PrescriptionId || 0;
        this.OrderId = Model.OrderId || 0;
        this.FamilyId = Model.FamilyId || 0;
        this.DrugScheduleB = Model.DrugScheduleB || 0;
        this.SubOrderId = Model.SubOrderId || 0;
        this.IsUploadType = Model.IsUploadType || 0;
        this.MedicineInfo = Model.MedicineInfo || "";
        this.NoOfRepeats = Model.NoOfRepeats || '';
        this.Quantity = Model.Quantity || '';
        this.MedicineName = Model.MedicineName || "";
        this.OrderScriptId = Model.OrderScriptId || "";
        this.Price = Model.Price || '';
        this.OriginalPrice = Model.OriginalPrice || '';
        this.PriceVersion = Model.PriceVersion || 0;
        this.RepeatInterval = Model.RepeatInterval || '';
        this.IsActive = Model.IsActive || true;
        this.IsMedicineStatus = Model.IsMedicineStatus || 0;
        this.ModifiedOn = Model.ModifiedOn || new Date();
        this.CreatedOn = Model.CreatedOn || new Date();
        this.IsUploadBy = Model.IsUploadBy || true;
        this.IsStock = Model.IsStock || false;
        this.Repeats = Model.Repeats || 2;
        this.TotalRepeats = Model.TotalRepeats;
        this.DaysRemaining = Model.DaysRemaining;
        this.RemainingRepeats = Model.RemainingRepeats;
        this.MarketPlaceItemStatus = Model.MarketPlaceItemStatus;
    }
}

export class UploadPrescriptionModel {
    ProductId: number;
    PrescriptionId: number;
    FullName: string;
    Address: string;
    MedicareNo: string;
    OrderNo: string;
    OrderId: number;
    SubOrderId: number;

    constructor(Model?) {
        Model = Model || {};
        this.ProductId = Model.ProductId || 0;
        this.PrescriptionId = Model.PrescriptionId || 0;
        this.FullName = Model.FullName || "";
        this.Address = Model.Address || '';
        this.MedicareNo = Model.MedicareNo || '';
        this.OrderNo = Model.OrderNo || '';
        this.OrderId = Model.OrderId || 0;
        this.SubOrderId = Model.SubOrderId || 0;
    }
}