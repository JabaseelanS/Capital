import { trigger, transition, style, animate } from "@angular/animations";

export const animation =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('animation', [

        // route 'enter' transition
        transition(':enter', [

            // css styles at start of transition
            style({ opacity: 0 }),

            // animation and styles at end of transition
            animate('.5s', style({ opacity: 1 }))
        ]),
    ]);
    