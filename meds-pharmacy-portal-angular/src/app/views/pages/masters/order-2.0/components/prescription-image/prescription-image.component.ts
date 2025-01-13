import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TableDataSource } from 'angular4-material-table';
import { ApiServices } from '../../../../../services/api.services';
import { ImageDialogComponent } from '../../../../../common-dialogs/image-dialog/image-dialog.component';
import { CommonServices } from '../../../../../services/common';
import { timer } from 'rxjs';
import { state, style, trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'pp-prescription-image',
    templateUrl: './prescription-image.component.html',
    styleUrls: ['./prescription-image.component.scss'],
    animations: [
        // Each unique animation requires its own trigger. The first argument of the trigger function is the name
        trigger('rotatedState', [
            state('default', style({ transform: 'rotate(0)' })),
            state('rotated', style({ transform: 'rotate(90deg)' })),
            state('rotated1', style({ transform: 'rotate(180deg)' })),
            state('rotated2', style({ transform: 'rotate(270deg)' })),
        ])
    ]
})

export class prescriptionComponent implements OnInit {
    @Input() scripts: any;
    @Input() orderModel: any;
    @Input() scriptData: any;
    @Input() tabIndex: any;
    timerSubscription: any;
    hideOnSubscription: any;
    url = 'PharmacistReviewV2/';
    className = '';
    state: string = 'default';
    constructor(public dialog: MatDialog,
        public commonServices: CommonServices,
        public apiService: ApiServices,
        private cdf: ChangeDetectorRef,
        private sanitizer: DomSanitizer
    ) {

    }

    ngOnInit() {
        this.commonServices.isImgLoaded = false;
        this.commonServices.PrescTabLength = this.scriptData.length;
        // if (this.scripts != null && this.scripts.IsUploadType == 9) {
        //     this.CreateOrderUpload();
        // }
    }

    CreateOrderUpload() {
        this.commonServices.visibility = "shown";
        this.apiService.GetList(this.url + "DownloadFile?orderid=" + this.scripts.OrderId + "&orderprescriptionid=" + this.scripts.OrderPrescriptionId).subscribe((res: any) => {
            this.commonServices.visibility = "hidden"; this.scripts.Base64 = res.Base64;
        }, err => {
            this.commonServices.visibility = "hidden";
            this.cdf.detectChanges();
        });
    }

    downloadFile(val) {
        this.commonServices.visibility = "shown";
        this.apiService.GetList(this.url + "DownloadFile?orderid=" + val.OrderId + "&orderprescriptionid=" + val.OrderPrescriptionId).subscribe((res: any) => {
            debugger
            this.commonServices.visibility = "hidden";
            this.scripts.Base64 = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${res.Base64}`);

            window.open(res.Base64, '_blank');

        }, err => {
            this.commonServices.visibility = "hidden";
            this.cdf.detectChanges();
        });
    }

    openImageModel(record) {
        var stte = this.state;
        var phid = this.orderModel.PharmacyId;
        var tabIndex = this.tabIndex;
        this.cdf.detectChanges();
        this.dialog.open(ImageDialogComponent, {
            height: '70vh',
            width: '30vw',
            data: { record, stte, phid, tabIndex },
            disableClose: true
        }).afterClosed().subscribe(async res => {
            return;
        })
    }

    // onImageLoad() {
    //     // this.loading = false;
    //     var ldimg = document.getElementById('loadSImg').className;
    //     document.getElementById('loadSImg').className = ldimg.replace(/dis-blk/g, 'dis-non');
    //     var srimg = document.getElementById('srcSImg').className;
    //     document.getElementById('srcSImg').className = srimg.replace(/dis-non /g, 'dis-blk ');
    //     this.cdf.detectChanges();
    // }


    loger(er) {
        console.log(er);

    }

    printIt() {
        this.commonServices.visibility = "shown";
        let hideTimer = timer(550);
        let somethingTimer = timer(600);
        this.hideOnSubscription = hideTimer.subscribe(() => this.commonServices.visibility = "hidden");
        this.timerSubscription = somethingTimer.subscribe(() => window.print());
    }

    rotatePic(): void {

        if (this.state === 'default') {
            this.state = 'rotated';
        } else if (this.state === 'rotated') {
            this.state = 'rotated1';
        } else if (this.state === 'rotated1') {
            this.state = 'rotated2';
        } else {
            this.state = 'default';
        }
    }

}
