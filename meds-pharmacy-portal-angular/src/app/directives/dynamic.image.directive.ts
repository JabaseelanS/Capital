import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ApiServices } from '../views/services/api.services';

@Directive({
    selector: '[appDynamicImage]'
})
export class DynamicImageDirective implements OnInit {

    @Input()
    dynamicSrc: string;

    private defaultSrc = "../../../../../../assets/img/imageloader.gif";
    private errsrc = "../../../../../../assets/packapill-icons/SVG/prescription_blu.svg";

    constructor(private elem: ElementRef,
        private renderer: Renderer2, private imageCompress: NgxImageCompressService,
        private apiServices: ApiServices,) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.setSource(this.defaultSrc);
            this.compressIt();
        }, 1500);
    }

    setAsyncSource = (src: string) => {
        const dynamicImage = new Image();
        dynamicImage.onload = (e) => {
            this.setSource(src);
            // console.log('onload');
            this.setSrcCls(true);
        }

        dynamicImage.onerror = (e) => {
            this.setSource(this.errsrc);
            this.setSrcCls(false);
            // console.log('Error happened', e)
        }

        dynamicImage.src = src;
    }

    setSource = (src: string) => {
        this.renderer.setAttribute(this.elem.nativeElement, 'src', src);
    }

    // Setting src / error gif size
    setSrcCls(n) {
        console.log("Set Src");
        // setTimeout(() => {
        n == true ? this.renderer.setAttribute(this.elem.nativeElement, 'class', "loadgifaft") : this.renderer.setAttribute(this.elem.nativeElement, 'class', "loadgif");
        // }, 100);

    }


    compressIt() {
        if (this.dynamicSrc != null) {
            var kt = this.dynamicSrc[0];
            // "../../../../../../assets/img/packapillfile_1572539.png";
            this.imageCompress.compressFile(kt, 50, 50).then(
                result => {
                    setTimeout(() => { // just to mock loading time
                        this.setAsyncSource(result);
                    }, 1000);
                    console.log("Result in bytes before", this.imageCompress.byteCount(this.dynamicSrc[0]));
                    console.log("Result in bytes after", this.imageCompress.byteCount(result));

                }).catch(err => {
                    // this.visibility = "hidden";
                    console.log('1', err);
                });
        }
        else {
            this.apiServices.showSnack("Unable to load image.");
        }

    }
}