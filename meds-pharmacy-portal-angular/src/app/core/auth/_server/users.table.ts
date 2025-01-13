export class UsersTable {

	public static users: any = [
		{
			id: '1',
			firstName: 'Sam',
			lastName: 'David',
			username: 'admin',
			password: 'Admin@123',
			email: 'admin@demo.com',
			dob: '1994-02-10T00:00:00',
			userprofile: 'loginpage.jpg',
			mobile: '9944215648',
			status: true,
			designation: 'Admin',
			phone1: '9944778899',
			address1: 'L-12-20 Vertex, Cybersquare',
			phone2: '9944556611',
			address2: 'L-55-20 Vertex, Test',
			state: 'TamilNadu',
			country: 'India',
			usercode: '1',
			userType: 'Admin User',
			pharmacy: {
				id: 1,
				name: 'Pharmacy 1'
			},
			loginHistory: [
				{
					logindetail: '2019-10-14T10:00:00', logoutdetail: '2019-10-14T19:00:00', location: 'Melbourne', logoutLocation: 'Sydney'
				},
				{
					logindetail: '2019-10-15T10:00:00', logoutdetail: '2019-10-15T19:00:00', location: 'Sydney', logoutLocation: 'Melbourne'
				},
				{
					logindetail: '2019-10-16T10:00:00', logoutdetail: '2019-10-16T19:00:00', location: 'Sydney', logoutLocation: 'Sydney'
				}
			],
			connectedPharmcies: [
				{
					pharmacyId: 'PH1122', pharmacyName: 'Pharmacy 1', pharmacyLocation: 'Sydney',
					status: 'Active', orderCount: 5, amount: 200
				},
				{
					pharmacyId: 'PH1142', pharmacyName: 'Pharmacy 2', pharmacyLocation: 'Sydney',
					status: 'Active', orderCount: 5, amount: 200
				},
				{
					pharmacyId: 'PH1152', pharmacyName: 'Pharmacy 3', pharmacyLocation: 'Melbourne',
					status: 'Active', orderCount: 5, amount: 200
				}
			]

		},
		{
			id: '2',
			firstName: 'Stephen',
			lastName: 'David',
			username: 'pillmate',
			password: 'PillmateUser@123',
			email: 'PillmateUser@demo.com',
			dob: '1994-02-10T00:00:00',
			mobile: '9944215648',
			userprofile: 'portal_main copy.jpg',
			status: false,
			designation: 'Manager',
			phone1: '9940617958',
			address1: 'L-12-20 Vertex, Cybersquare',
			phone2: '9944556611',
			address2: 'L-55-20 Vertex, Test',
			state: 'TamilNadu',
			country: 'India',
			pharmacy: {
				id: 2,
				name: 'Pharmacy 2'
			},
			usercode: '2',
			userType: 'Pillmate User',
			loginHistory: [
				{
					logindetail: '2019-10-14T10:00:00', logoutdetail: '2019-10-14T19:00:00', location: 'Melbourne', logoutLocation: 'Sydney'
				},
				{
					logindetail: '2019-10-15T10:00:00', logoutdetail: '2019-10-15T19:00:00', location: 'Sydney', logoutLocation: 'Melbourne'
				},
				{
					logindetail: '2019-10-16T10:00:00', logoutdetail: '2019-10-16T19:00:00', location: 'Sydney', logoutLocation: 'Sydney'
				}
			],
			connectedPharmcies: [
				{
					pharmacyId: 'PH1122', pharmacyName: 'Pharmacy 1', pharmacyLocation: 'Sydney',
					status: 'Active', orderCount: 5, amount: 200
				},
				{
					pharmacyId: 'PH1142', pharmacyName: 'Pharmacy 2', pharmacyLocation: 'Sydney',
					status: 'Active', orderCount: 5, amount: 200
				},
				{
					pharmacyId: 'PH1152', pharmacyName: 'Pharmacy 3', pharmacyLocation: 'Melbourne',
					status: 'Active', orderCount: 5, amount: 200
				}
			]
		}
	];
}
