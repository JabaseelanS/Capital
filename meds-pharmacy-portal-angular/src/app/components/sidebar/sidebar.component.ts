import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';

declare const $: any;
declare interface RouteInfo {
  path?: string;
  title: string;
  icon?: string;
  class?: string;
  child?: any;
  header?: string;
  isView?: boolean;
}
export const ROUTES: RouteInfo[] = [
  {
    path: 'dashboard',
    header: '/app/dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    class: ''
  },
  {
    path: 'user-profile',
    header: '/app/user-profile',
    title: 'User Profile',
    icon: 'account_circle',
    class: ''
  },
  {
    title: 'Masters',
    icon: 'person',
    child: [
      {
        path: 'master/users-list',
        title: 'Users',
        header: '/app/master/users-list',
        icon: 'supervisor_account',
        flag: true,
      },
      {
        path: 'master/pharmacy-list',
        header: '/app/master/pharmacy-list',
        title: 'Pharmacies',
        icon: 'local_hospital',
      },
      {
        path: 'master/pharmacy-group',
        header: '/app/master/pharmacy-group',
        title: 'Pharmacies Group',
        icon: 'local_pharmacy',
      }
    ],
    isView: false
  },
  {
    path: 'master/inventory',
    header: '/app/master/inventory',
    title: 'Inventories',
    icon: 'add_shopping_cart',
  },
  // {
  //   path: 'master/order-history',
  //   header: '/app/master/order-history',
  //   title: 'Order Histories',
  //   icon: 'history',
  // },
  // {
  //   path: 'master/order-inprogress',
  //   header: '/app/master/order-inprogress',
  //   title: 'Order Inprogress',
  //   icon: 'content_paste',
  // },
  // {
  //   path: 'master/live-orders',
  //   header: '/app/master/live-orders',
  //   title: 'Live Orders',
  //   icon: 'shopping_cart',
  // },
  {
    path: 'master/prescription-orders',
    header: '/app/master/prescription-orders',
    title: 'Prescription Orders',
    icon: 'shopping_cart',
  },

  // { path: 'typography', title: 'Typography',  icon:'library_books', class: '' },
  //{ path: 'icons', title: 'Icons', icon: 'bubble_chart', class: '' },
  // { path: 'maps', title: 'Maps',  icon:'location_on', class: '' },
  // { path: 'upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger(
      'transation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]
    )
  ]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  isView = true;
  location: Location;
  flag = false;
  constructor(location: Location, private router: Router) {
    this.location = location;
  }

  ngOnInit() {
    // debugger
    let data;
    let logindetails = JSON.parse(localStorage.getItem("logindetails"));
    let userdetails = JSON.parse(localStorage.getItem("userdetails"));
    let authDetails = JSON.parse(localStorage.getItem("authDetails"));

    if (userdetails.UserId == 1) {
      this.flag = true;
    }

    data = ROUTES.filter(menuItem => menuItem);
    // data.forEach((menuItem: any) => {
    //   this.setView(menuItem);
    // });
    for (let i = 0; i < data.length; i++) {
      this.setView(data[i], i);
    }
    this.menuItems = data;
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  logOut(): void {
    this.router.navigate(['auth/login']);
  }

  setView(menuItem, i): any {
    if (menuItem.child) {
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if (titlee.charAt(0) === '#') {
        titlee = titlee.slice(1);
      }
      for (var item = 0; item < menuItem.child.length; item++) {
        if (menuItem.child[item].header === titlee) {
          menuItem.isView = true;
        }
      }
    }
  }

}
