export class Report {

    OrderSummaryId: number;
    ReportType:any;
    FromDate: any;
    ToDate: any;
    FileName: any;
    


    constructor(report?) {
        report = report || {};
        this.OrderSummaryId = report.OrderSummaryId || 0;
        this.ReportType=report.ReportType || "";
        this.FromDate = report.FromDate || null;
        this.ToDate = report.ToDate || null;
        this.FileName = report.FileName || '';
        
    }
}