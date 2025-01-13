// Angular
import { Injectable } from '@angular/core';
// Angular in memory
import { InMemoryDbService } from 'angular-in-memory-web-api';
// RxJS
import { Observable } from 'rxjs';
// Auth
import { AuthDataContext } from '../../../../auth';
// ECommerce
// import { ECommerceDataContext } from '../../../../e-commerce';
// Models
import { CarsDb } from './fake-db/cars';
import { CategoryDb } from './fake-db/category';
import { ProductDb } from './fake-db/product';
import { PharmacyDb } from './fake-db/pharmacy';
import { OrdersDB } from './fake-db/orders';
import { PharmacyGrpDb } from './fake-db/pharmacy-grp';
import { SubCategoryDb } from './fake-db/sub-category';
import { ActiveMaterialDb } from './fake-db/activeMaterial';
import { OrderHistoryDB } from './fake-db/order-history';
import { MenuDB } from './fake-db/menu';
// import { UsersTable } from 'src/app/core/auth/_server/users.table';
import { StateDb } from './fake-db/state';
import { CityDb } from './fake-db/city';
import { CountryDb } from './fake-db/country';

@Injectable()
export class FakeApiService implements InMemoryDbService {
	/**
	 * Service Constructore
	 */
	constructor() { }

	/**
	 * Create Fake DB and API
	 */
	createDb(): {} | Observable<{}> {
		// tslint:disable-next-line:class-name
		const db = {

			// For Menus
			menus: MenuDB.menus,

			// // auth module
			users: AuthDataContext.users,
			roles: AuthDataContext.roles,
			permissions: AuthDataContext.permissions,

			// e-commerce
			// customers
			// customers: ECommerceDataContext.customers,
			// // products
			// products: ECommerceDataContext.cars,
			// productRemarks: ECommerceDataContext.remarks,
			// productSpecs: ECommerceDataContext.carSpecs,

			// orders
			// orders: ECommerceDataContext.orders,

			// data-table
			cars: CarsDb.cars,


			// Category List
			category: CategoryDb.category,

			// Sub Category
			sub_category: SubCategoryDb.sub_category,

			// Products List
			product: ProductDb.product,

			// Pharmacy List
			pharmacy: PharmacyDb.pharmacy,

			// Orders List
			orders: OrdersDB.order,

			city: CityDb.city,
			state: StateDb.state,
			country: CountryDb.country,

			// Pharmacy Group
			pharmacyGrp: PharmacyGrpDb.pharmacyGrp,

			// Active Material
			active_material: ActiveMaterialDb.active_material,

			// Order History
			order_history: OrderHistoryDB.order_history
		};
		return db;
	}
}
