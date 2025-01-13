import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class LoaderService {
    public status = true;

    display(value: boolean) {
        this.status = value;
    }
}