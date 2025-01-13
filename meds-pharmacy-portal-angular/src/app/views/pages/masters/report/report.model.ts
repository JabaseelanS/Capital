export class ReportModel {

    Week: string;
    ReportId: number;
    PharmacyId: number;
    TaxInvoice: string;
    PaymentSummary: string;
    B64string: string;
    B64string2: string;

    constructor(reportModel) {
        reportModel = reportModel || {};
        this.Week = reportModel.Week || '';
        this.ReportId = reportModel.ReportId || 0;
        this.PharmacyId = reportModel.PharmacyId || 0;
        this.TaxInvoice = reportModel.TaxInvoice || '';
        this.PaymentSummary = reportModel.PaymentSummary || '';
        this.B64string = reportModel.B64string || '';
        this.B64string2 = reportModel.B64string2 || '';
    }
}
