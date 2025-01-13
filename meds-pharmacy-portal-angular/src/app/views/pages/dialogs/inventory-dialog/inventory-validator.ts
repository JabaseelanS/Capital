import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidatorService } from 'angular4-material-table';

@Injectable()
export class InventoryValidatorService implements ValidatorService {
    getRowValidator(): FormGroup {
        return new FormGroup({
            PharmacyId: new FormControl(0, [Validators.required]),
            DrugName: new FormControl('', [Validators.required]),
            BarCode: new FormControl('', [Validators.required]),
            SubCategoryId: new FormControl(0),
            Price: new FormControl(0),
            Quantity: new FormControl(0),
            InventoryTypeId: new FormControl(0),
            PharmacyCode: new FormControl(0),
            GeneralPrice: new FormControl(0),
            ConcessionPrice: new FormControl(0),
            EntitlementPrice: new FormControl(0),
            SpecialDispensePrice: new FormControl(0),
            PreferredGenericUPI: new FormControl(0),


        });
    }
}