
export class OtcPrice {

    OTCId: number;
    Pharmacy: number;
    Ean: any;
    Price: number;
    MedicineName: any;
    Stock: number;
    IsActive: boolean;
    DiscountedPrice: number;

    constructor(otc?) {
        otc = otc || {};
        this.OTCId = otc.OTCId || 0;
        this.Pharmacy = otc.Pharmacy || "";
        this.Ean = otc.Ean || "";
        this.Price = otc.Price || 0;
        this.DiscountedPrice = otc.DiscountedPrice || 0;
        this.MedicineName = otc.MedicineName || "";
        this.Stock = otc.Stock || 0;
        this.IsActive = otc.IsActive || false;
    }
}