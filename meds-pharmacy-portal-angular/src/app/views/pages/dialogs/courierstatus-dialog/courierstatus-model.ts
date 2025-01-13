export class CourierStatusModel {
    DriverName: string;
    DriverMobileNumber: string;
    MarketPlace: number;
    CostOfDelivery: number;
    OrderId: number;
    constructor(courierModel?) {
        courierModel = courierModel || {};
        this.DriverName = courierModel.DriverName || "";
        this.DriverMobileNumber = courierModel.DriverMobileNumber || "";
        this.MarketPlace = courierModel.MarketPlace || "";
        this.CostOfDelivery = courierModel.CostOfDelivery || "";
        this.OrderId = courierModel.OrderId || "";
    }
}