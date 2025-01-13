import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() { }

    fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    fileExtension = '.xlsx';

    public exportExcel(jsonData: any[], fileName: string): void {
        // var ws: XLSX.WorkSheet;
        // var wk: XLSX.WorkSheet;
        // var wl: XLSX.WorkSheet;

        // if (fileName == 'Order History') {
        //     ws = XLSX.utils.json_to_sheet(jsonData);
        // }
        // if (fileName == 'Medicine Details') {
        //     wk = XLSX.utils.json_to_sheet(jsonData);
        // }
        // if (fileName == 'Patient Details') {
        //     wl = XLSX.utils.json_to_sheet(jsonData);
        // }
        //const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData[0]);
        const wk: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData[1]);
        const wl: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData[2]);



        const wb: XLSX.WorkBook = { Sheets: { 'Order History': ws, 'Medicine Details': wk, 'Patient Details': wl }, SheetNames: ['Order History', 'Medicine Details', 'Patient Details'] };
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        // ws.column(2).hide();

        this.saveExcelFile(excelBuffer, fileName);
    }

    private saveExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: this.fileType });
        FileSaver.saveAs(data, fileName + this.fileExtension);
    }

}