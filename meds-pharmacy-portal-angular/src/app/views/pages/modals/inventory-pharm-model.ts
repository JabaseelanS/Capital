export class InventoryPharmModel {
    DrugName: string;
    BarCode: string;
    Price: number;
    Quantity: number;
    InventoryTypeId: number;
    PharmacyId: number;
    InventoryId: number;
    ModifiedOn: Date;
    CreatedOn: Date;
    PharmacyCode: string;
    GeneralPrice: number;
    ConcessionPrice: number;
    EntitlementPrice: number;
    SpecialDispensePrice: number;
    PreferredGenericUPI: string;
    constructor(InventoryPharmModel?) {

        InventoryPharmModel = InventoryPharmModel || {};
        this.BarCode = InventoryPharmModel.BarCode || '';
        this.InventoryTypeId = InventoryPharmModel.InventoryTypeId;
        this.PharmacyId = InventoryPharmModel.PharmacyId || 0;
        this.ModifiedOn = InventoryPharmModel.ModifiedOn || new Date();
        this.CreatedOn = InventoryPharmModel.CreatedOn || new Date();
        this.PharmacyCode = InventoryPharmModel.PharmacyCode || '';
        this.DrugName = InventoryPharmModel.DrugName || '';
        this.Price = InventoryPharmModel.Price || 0;
        this.Quantity = InventoryPharmModel.Quantity || 0;
        this.GeneralPrice = InventoryPharmModel.GeneralPrice || 0;
        this.ConcessionPrice = InventoryPharmModel.ConcessionPrice || 0;
        this.EntitlementPrice = InventoryPharmModel.EntitlementPrice || 0;
        this.SpecialDispensePrice = InventoryPharmModel.SpecialDispensePrice || 0;
        this.PreferredGenericUPI = InventoryPharmModel.PreferredGenericUPI || '';
    }
}