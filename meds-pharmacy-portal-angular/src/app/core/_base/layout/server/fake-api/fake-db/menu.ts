export class MenuDB {
    public static menus: any =
        {
            aside: {
                self: {},
                admin: [
                    {
                        title: 'Dashboard',
                        root: true,
                        icon: 'dashboard',
                        page: 'dashboard',
                        translate: 'MENU.DASHBOARD',
                        bullet: 'dot',
                        roles: [1, 2, 3]
                    },
                    {
                        title: 'User Management',
                        root: true,
                        bullet: 'dot',
                        translate: 'MENU.USER_MANAGEMENT',
                        icon: 'supervisor_account',
                        roles: [1],
                        submenu: [
                            {
                                title: 'Admin-Users',
                                page: 'user-management/users',
                                translate: 'MENU.ADMIN_USERS',
                                roles: [1],
                            },
                            {
                                title: 'Pillmate-Users',
                                page: 'user-management/pillmate-users',
                                roles: [1],
                            },
                            {
                                title: 'Pharmacy',
                                page: 'user-management/pharmacy',
                                roles: [1],
                            },
                            // {
                            // 	title: 'Roles',
                            // 	page: 'user-management/roles'
                            // }
                        ]
                    },
                    {
                        title: 'Master',
                        root: true,
                        bullet: 'dot',
                        icon: 'account_circle',
                        roles: [1, 2, 3],
                        submenu: [
                            {
                                title: 'Customer',
                                page: 'masters/customer',
                                roles: [1, 2, 3],
                            },
                            {
                                title: 'Category',
                                page: 'masters/category',
                                roles: [1, 2, 3],
                            },
                            {
                                title: 'Sub-Category',
                                page: 'masters/sub-category',
                                roles: [1, 2, 3],
                            },
                            {
                                title: 'Product',
                                page: 'masters/product',
                                roles: [1, 2, 3],
                            },
                            {
                                title: 'Pharmacy',
                                page: 'masters/pharmacy',
                                roles: [1, 3],
                            },
                            {
                                title: 'Pharmacy Group',
                                page: 'masters/grp-pharmacy',
                                roles: [1, 3],
                            },
                            {
                                title: 'Active Material',
                                page: 'masters/active-material',
                                roles: [1],
                            },
                            {
                                title: 'Discount',
                                page: 'masters/discount',
                                roles: [1],
                            },
                            {
                                title: 'Excel Info',
                                page: 'masters/excel-info',
                                roles: [1],
                            }
                        ]
                    },
                    {
                        title: 'Order-Management',
                        root: true,
                        bullet: 'dot',
                        icon: 'add_shopping_cart',
                        roles: [1, 3],
                        submenu: [
                            {
                                title: 'Orders',
                                page: 'pages/orders',
                                roles: [1, 3],
                            },
                            {
                                title: 'Order History',
                                page: 'pages/history-order',
                                roles: [1, 3],
                            },
                        ]
                    },
                    // {
                    // 	title: 'Customer',
                    // 	root: true,
                    // 	icon: 'flaticon2-architecture-and-city',
                    // 	page: 'customer',
                    // 	//translate: 'MENU.MASTER',
                    // 	bullet: 'dot',
                    // }
                ],
                pillmate: [
                    {
                        title: 'Dashboard',
                        root: true,
                        icon: 'dashboard',
                        page: 'dashboard',
                        translate: 'MENU.DASHBOARD',
                        bullet: 'dot',
                    },
                    {
                        title: 'User Management',
                        root: true,
                        bullet: 'dot',
                        translate: 'MENU.USER_MANAGEMENT',
                        icon: 'supervisor_account',
                        submenu: [
                            {
                                title: 'Admin-Users',
                                page: 'user-management/users',
                                translate: 'MENU.ADMIN_USERS',
                            },
                            {
                                title: 'Pillmate-Users',
                                page: 'user-management/pillmate-users'
                            },
                            {
                                title: 'Pharmacy',
                                page: 'user-management/pharmacy'
                            },
                            // {
                            // 	title: 'Roles',
                            // 	page: 'user-management/roles'
                            // }
                        ]
                    },
                    {
                        title: 'Order-Management',
                        root: true,
                        bullet: 'dot',
                        icon: 'add_shopping_cart',
                        submenu: [
                            {
                                title: 'Orders',
                                page: 'pages/orders'
                            },
                            {
                                title: 'Order History',
                                page: 'pages/history-order'
                            },
                        ]
                    },
                    // {
                    // 	title: 'Customer',
                    // 	root: true,
                    // 	icon: 'flaticon2-architecture-and-city',
                    // 	page: 'customer',
                    // 	//translate: 'MENU.MASTER',
                    // 	bullet: 'dot',
                    // }
                ],
                pharmacy: [
                    {
                        title: 'Dashboard',
                        root: true,
                        icon: 'dashboard',
                        page: 'dashboard',
                        translate: 'MENU.DASHBOARD',
                        bullet: 'dot',
                    },
                    {
                        title: 'Order-Management',
                        root: true,
                        bullet: 'dot',
                        icon: 'add_shopping_cart',
                        submenu: [
                            {
                                title: 'Orders',
                                page: 'pages/orders'
                            },
                            {
                                title: 'Order History',
                                page: 'pages/history-order'
                            },
                        ]
                    },
                ]
            }
        }

}
