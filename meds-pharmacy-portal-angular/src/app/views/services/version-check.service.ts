import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    handleError(error: any): void {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        console.log('errorrrrrrrrrrr', error);
        if (chunkFailedMessage.test(error.message)) {
            window.location.reload();
        }
        // other stuff for error handling.
    }
}