export class ForgotPWDModel {
    VerifyId: number;
    VerifyOTP1: string;
    VerifyOTP2: string;
    VerifyOTP3: string;
    VerifyOTP4: string;

    constructor(ForgotPWDModel?) {
        ForgotPWDModel = ForgotPWDModel || {};
        this.VerifyId = ForgotPWDModel.VerifyId || 0;
        this.VerifyOTP1 = ForgotPWDModel.VerifyOTP1 || '';
        this.VerifyOTP2 = ForgotPWDModel.VerifyOTP2 || '';
        this.VerifyOTP3 = ForgotPWDModel.VerifyOTP3 || '';
        this.VerifyOTP4 = ForgotPWDModel.VerifyOTP4 || '';
    }
}