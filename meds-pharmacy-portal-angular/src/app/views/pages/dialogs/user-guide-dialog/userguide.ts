export class UserGuide {

    UserGuideId: number;
    UserGuide: string;
    ProcessingPrescriptionOrders: string;
    ProcessingOtcOrders: string;
    CarerMode: string;
    RoleId: number;
    Base64UserGuide: any;
    Base64ProcessingPrescriptionOrders: any;
    Base64CarerMode: any;
    Base64ProcessingOtcOrders: any;

    constructor(UserGuide?) {
        UserGuide = UserGuide || {};
        this.UserGuideId = UserGuide.UserGuideId || 0;
        this.UserGuide = UserGuide.UserGuide || '';
        this.ProcessingPrescriptionOrders = UserGuide.ProcessingPrescriptionOrders || '';
        this.ProcessingOtcOrders = UserGuide.ProcessingOtcOrders || '';
        this.CarerMode = UserGuide.CarerMode || '';
        this.RoleId = UserGuide.RoleId || 0;
        this.Base64UserGuide = UserGuide.Base64UserGuide || [];
        this.Base64ProcessingPrescriptionOrders = UserGuide.Base64ProcessingPrescriptionOrders || [];
        this.Base64CarerMode = UserGuide.Base64CarerMode || [];
        this.Base64ProcessingOtcOrders = UserGuide.Base64ProcessingOtcOrders || [];

    }
}