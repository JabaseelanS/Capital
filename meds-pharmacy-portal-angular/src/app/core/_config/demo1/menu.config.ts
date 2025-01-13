export class MenuConfig {
	public defaults: any = {
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'Dashboard_gray.svg',
					iconActive: "Dashboard_orange.svg",
					page: 'dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: "Settings",
					root: true,
					icon: "Userprofile_gray.svg",
					iconActive: "Userprofile_gray-1.svg",
					bullet: "dot",
					submenu: [{
						title: 'User Guide',
						page: "masters/setting"
					},
					{
						title: 'Holiday calendar & Special hours',
						page: 'masters/special-hours'
					},
						// {
						// 	title: "Upload Drug Imges",
						// 	page: "masters/upload-drug-images",
						// },
					]
				},
				{
					title: "User Profile",
					root: true,
					// activeicon:"",
					icon: "Userprofile_gray.svg",
					iconActive: "Userprofile_gray-1.svg",
					page: "masters/user-profile",
					bullet: "dot"
				},
				{
					title: 'Masters',
					root: true,
					bullet: 'dot',
					icon: 'master_Gray.svg',
					iconActive: "Master_orange.svg",
					submenu: [{
						title: 'Pharmacy',
						page: 'masters/pharmacy'
					},
					{
						title: 'Pharmacy User',
						page: 'masters/user/pharmacy'
					},
					{
						title: 'Pharmacy Admin',
						page: 'masters/groupuser/pharmacy'
					},
					// {
					// 	title: 'Delivery User',
					// 	page: 'masters/user/delivery'
					// },
					{
						title: 'Pharmacy Groups',
						page: 'masters/groups/pharmacy'
					},
					{
						title: "OTC Pricing",
						page: "masters/otc-price"
					},
						// {
						// 	title: "User Guide",
						// 	page: "masters/user-guide"
						// },
					]
				},
				{
					title: "Customers",
					root: true,
					icon: "customer_list.svg",
					iconActive: "customer_list_Red.svg",
					page: 'masters/customers',
					bullet: "dot"
				},
				{
					title: "RAT Live Orders",
					root: true,
					icon: "RAT_Live_Orders_Gray.svg",
					iconActive: "RAT_Live_Orders_Orange.svg",
					page: "masters/new-live-order",
					bullet: "dot"
				},
				{
					title: "Live Orders",
					root: true,
					icon: "Live_orders_gray.svg",
					iconActive: "Live_orders_orange.svg",
					page: "masters/live-order-2",
					bullet: "dot"
				},
				{
					title: "Order History",
					root: true,
					icon: "Orderhistory_gray.svg",
					iconActive: "Orderhistory_orange.svg",
					page: "masters/order-history-2",
					bullet: "dot"
				},
				{
					title: "Invoice Reports",
					root: true,
					icon: "Invoice_Report_Gray.svg",
					iconActive: "Invoice_Report_Orange.svg",
					page: "masters/new-report-v2",
					bullet: "dot"
				},
				{
					title: "Order Reports",
					root: true,
					icon: "Order_reports_Gray.svg",
					iconActive: "Order_reports_Orange.svg",
					page: "masters/report",
					bullet: "dot"
				},
				{
					title: "Order summary",
					root: true,
					icon: "Order_Summary_Gray.svg",
					iconActive: "Order Summary Orange.svg",
					page: "masters/order-summary",
					bullet: "dot"
				},
				// {
				// 	title: "Pharmacy Invoices Report",
				// 	root: true,
				// 	icon: "Pharmacy_Invoice_Report_Gray Option.svg",
				// 	iconActive: "Pharmacy_Invoice_Report_Orange Option.svg",
				// 	page: "masters/invoices-report",
				// 	bullet: "dot"
				// },
				{
					title: "Products",
					root: true,
					icon: "Live_orders_gray.svg",
					iconActive: "Live_orders_orange.svg",
					page: "masters/products",
					bullet: "dot"
				},
			]
		}
	};

	public pharmacyGrpAdmin: any = {
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'Dashboard_gray.svg',
					iconActive: "Dashboard_orange.svg",
					page: 'dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: "User Profile",
					root: true,
					icon: "Userprofile_gray.svg",
					iconActive: "Userprofile_gray-1.svg",
					page: "masters/user-profile",
					bullet: "dot"
				},
				{
					title: 'Master',
					root: true,
					bullet: 'dot',
					icon: 'master_Gray.svg',
					iconActive: "Master_orange.svg",
					submenu: [
						{
							title: 'Pharmacy User',
							page: 'masters/user/pharmacy'
						},
						{
							title: "OTC Pricing",
							page: "masters/otc-price"
						},
					]
				},
				{
					title: "Customers",
					root: true,
					icon: "customer_list.svg",
					iconActive: "customer_list_Red.svg",
					page: 'masters/customers',
					bullet: "dot"
				},
				{
					title: "Live Orders",
					root: true,
					icon: "Live_orders_gray.svg",
					iconActive: "Live_orders_orange.svg",
					page: "masters/live-order-2",
					bullet: "dot"
				},
				{
					title: "Order History",
					root: true,
					icon: "Orderhistory_gray.svg",
					iconActive: "Orderhistory_orange.svg",
					page: "masters/order-history-2",
					bullet: "dot"
				},
				{
					title: "Invoice Reports",
					root: true,
					icon: "Invoice_Report_Gray.svg",
					iconActive: "Invoice_Report_Orange.svg",
					page: "masters/new-report-v2",
					bullet: "dot"
				},
				{
					title: "Order Reports",
					root: true,
					icon: "Order_reports_Gray.svg",
					iconActive: "Order_reports_Orange.svg",
					page: "masters/report",
					bullet: "dot"
				},
				// {
				// 	title: "Pharmacy Invoices Report",
				// 	root: true,
				// 	icon: "customer_list.svg",
				// 	iconActive: "customer_list_Red.svg",
				// 	page: "masters/invoices-report",
				// 	bullet: "dot"
				// },
				// {
				// 	title: "Order summary",
				// 	root: true,
				// 	icon: "customer_list.svg",
				// 	iconActive: "customer_list_Red.svg",
				// 	page: "masters/order-summary",
				// 	bullet: "dot"
				// },
			]
		}
	};

	public pharmacyGrpUserAdmin: any = {
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'Dashboard_gray.svg',
					iconActive: "Dashboard_orange.svg",
					page: 'dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: "User Profile",
					root: true,
					icon: "Userprofile_gray.svg",
					iconActive: "Userprofile_gray-1.svg",
					page: "masters/user-profile",
					bullet: "dot"
				},
				{
					title: 'Masters',
					root: true,
					bullet: 'dot',
					icon: 'master_Gray.svg',
					iconActive: "Master_orange.svg",
					submenu: [{
						title: 'Pharmacy',
						page: 'masters/pharmacy'
					},
					{
						title: 'Pharmacy User',
						page: 'masters/user/pharmacy'
					},
					{
						title: 'Pharmacy Groups',
						page: 'masters/groups/pharmacy'
					},
					{
						title: "OTC Pricing",
						page: "masters/otc-price"
					}
					]
				},
				{
					title: "Customers",
					root: true,
					icon: "customer_list.svg",
					iconActive: "customer_list_Red.svg",
					page: 'masters/customers',
					bullet: "dot"
				},
				{
					title: "RAT Live Orders",
					root: true,
					icon: "RAT_Live_Orders_Gray.svg",
					iconActive: "RAT_Live_Orders_Orange.svg",
					page: "masters/new-live-order",
					bullet: "dot"
				},
				{
					title: "Live Orders",
					root: true,
					icon: "Live_orders_gray.svg",
					iconActive: "Live_orders_orange.svg",
					page: "masters/live-order-2",
					bullet: "dot"
				},
				{
					title: "Order History",
					root: true,
					icon: "Orderhistory_gray.svg",
					iconActive: "Orderhistory_orange.svg",
					page: "masters/order-history-2",
					bullet: "dot"
				},
				{
					title: "Invoice Reports",
					root: true,
					icon: "Invoice_Report_Gray.svg",
					iconActive: "Invoice_Report_Orange.svg",
					page: "masters/new-report-v2",
					bullet: "dot"
				},
				{
					title: "Order Reports",
					root: true,
					icon: "Order_reports_Gray.svg",
					iconActive: "Order_reports_Orange.svg",
					page: "masters/report",
					bullet: "dot"
				},
				// {
				// 	title: "Pharmacy Invoices Report",
				// 	root: true,
				// 	icon: "customer_list.svg",
				// 	iconActive: "customer_list_Red.svg",
				// 	page: "masters/invoices-report",
				// 	bullet: "dot"
				// },
				// {
				// 	title: "Order summary",
				// 	root: true,
				// 	icon: "customer_list.svg",
				// 	iconActive: "customer_list_Red.svg",
				// 	page: "masters/order-summary",
				// 	bullet: "dot"
				// },
			]
		}
	};

	public pharmacyUser: any = {
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'Dashboard_gray.svg',
					iconActive: "Dashboard_orange.svg",
					page: 'dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: "User Profile",
					root: true,
					icon: "Userprofile_gray.svg",
					iconActive: "Userprofile_gray-1.svg",
					page: "masters/user-profile",
					bullet: "dot"
				},
				{
					title: "Customers",
					root: true,
					icon: "customer_list.svg",
					iconActive: "customer_list_Red.svg",
					page: 'masters/customers',
					bullet: "dot"
				},
				{
					title: "OTC Price",
					root: true,
					icon: "OTC_Pricing_Gray.svg",
					iconActive: "OTC_Pricing_Orange.svg",
					page: "masters/otc-price",
					bullet: "dot"
				},
				{
					title: "Live Orders",
					root: true,
					icon: "Live_orders_gray.svg",
					iconActive: "Live_orders_orange.svg",
					page: "masters/live-order-2",
					bullet: "dot"
				},
				{
					title: "Order History",
					root: true,
					icon: "Orderhistory_gray.svg",
					iconActive: "Orderhistory_orange.svg",
					page: "masters/order-history-2",
					bullet: "dot"
				},
				{
					title: "Invoice Reports",
					root: true,
					icon: "Invoice_Report_Gray.svg",
					iconActive: "Invoice_Report_Orange.svg",
					page: "masters/new-report-v2",
					bullet: "dot"
				},
				// {
				// 	title: "Pharmacy Invoices Report",
				// 	root: true,
				// 	icon: "customer_list.svg",
				// 	iconActive: "customer_list_Red.svg",
				// 	page: "masters/invoices-report",
				// 	bullet: "dot"
				// },
			]
		}
	};

	public deliveryUser: any = {
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'Dashboard_gray.svg',
					iconActive: "Dashboard_orange.svg",
					page: 'dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: "User Profile",
					root: true,
					icon: "Userprofile_gray.svg",
					iconActive: "Userprofile_gray-1.svg",
					page: "masters/user-profile",
					bullet: "dot"
				},
				{
					title: "Live Orders",
					root: true,
					icon: "Live_orders_gray.svg",
					iconActive: "Live_orders_orange.svg",
					page: "masters/prescription-orders",
					bullet: "dot"
				},
				// {
				// 	title: "Order History",
				// 	root: true,
				// 	icon: "Orderhistory_gray.svg",
				// 	iconActive: "Orderhistory_orange.svg",
				// 	page: "masters/order-history",
				// 	bullet: "dot"
				// },
			]
		}
	};

	public pharmacyTestUser: any = {
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'Dashboard_gray.svg',
					iconActive: "Dashboard_orange.svg",
					page: 'dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: "User Profile",
					root: true,
					icon: "Userprofile_gray.svg",
					iconActive: "Userprofile_gray-1.svg",
					page: "masters/user-profile",
					bullet: "dot"
				},
				{
					title: "Customers",
					root: true,
					icon: "customer_list.svg",
					iconActive: "customer_list_Red.svg",
					page: 'masters/customers',
					bullet: "dot"
				},
				{
					title: "OTC Price",
					root: true,
					icon: "OTC_Pricing_Gray.svg",
					iconActive: "OTC_Pricing_Orange.svg",
					page: "masters/otc-price",
					bullet: "dot"
				},
				{
					title: "Live Orders",
					root: true,
					icon: "Live_orders_gray.svg",
					iconActive: "Live_orders_orange.svg",
					page: "masters/live-order-2",
					bullet: "dot"
				},
				{
					title: "Order History",
					root: true,
					icon: "Orderhistory_gray.svg",
					iconActive: "Orderhistory_orange.svg",
					page: "masters/order-history-2",
					bullet: "dot"
				},
				{
					title: "Invoice Reports",
					root: true,
					icon: "Invoice_Report_Gray.svg",
					iconActive: "Invoice_Report_Orange.svg",
					page: "masters/new-report-v2",
					bullet: "dot"
				},
				// {
				// 	title: "Pharmacy Invoices Report",
				// 	root: true,
				// 	icon: "customer_list.svg",
				// 	iconActive: "customer_list_Red.svg",
				// 	page: "masters/invoices-report",
				// 	bullet: "dot"
				// },
				// {
				// 	title: "Order summary",
				// 	root: true,
				// 	icon: "customer_list.svg",
				// 	iconActive: "customer_list_Red.svg",
				// 	page: "masters/order-summary",
				// 	bullet: "dot"
				// },
			]
		}
	};

	public get configs(): any {
		return this;
	}
}
