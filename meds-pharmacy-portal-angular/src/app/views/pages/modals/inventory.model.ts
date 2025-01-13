export class InventoryModel {
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
    PreferredGenericUPI: number;
    SubCategoryId: number;

    constructor(InventoryModel?) {
        InventoryModel = InventoryModel || {};
        this.BarCode = InventoryModel.BarCode || '';
        this.InventoryTypeId = InventoryModel.InventoryTypeId;
        this.PharmacyId = InventoryModel.PharmacyId || 0;
        this.ModifiedOn = InventoryModel.ModifiedOn || new Date();
        this.CreatedOn = InventoryModel.CreatedOn || new Date();
        this.PharmacyCode = InventoryModel.PharmacyCode || '';
        this.DrugName = InventoryModel.DrugName || '';
        this.Price = InventoryModel.Price || 0;
        this.Quantity = InventoryModel.Quantity || 0;
        this.GeneralPrice = InventoryModel.GeneralPrice || 0;
        this.ConcessionPrice = InventoryModel.ConcessionPrice || 0;
        this.EntitlementPrice = InventoryModel.EntitlementPrice || 0;
        this.SpecialDispensePrice = InventoryModel.SpecialDispensePrice || 0;
        this.PreferredGenericUPI = InventoryModel.PreferredGenericUPI || '';
        this.SubCategoryId = InventoryModel.SubCategoryId;
        // this.Quantity = InventoryModel.Stock || 0;
    }
}
