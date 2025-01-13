export const environment = {
	version: "0.0.14",
	oneSignalAppId: 'ae47543c-4c22-433e-8621-fe1a0d435beb',
	OnesignalToken: 'NjJlM2EwMjctMzdmYy00ODgyLWFmZmItMDdiZTc3NjU3YWYy',
	production: true,
	isMockEnabled: true, // You have to switch this, when your real back-end is done
	authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',

	notifierDownloadLocation: "https://p.hlhlth.app/assets/pharmacynotifier/Holahealth.OrderNotifier.application", //QA
	// notifierDownloadLocation: "	https://passets.hola.health/packapill/pharmacynotifier/Holahealth.OrderNotifier.application", //Live

	// apiEndpoint: 'http://localhost:60248/api', /** => Local Api */
	// apiEndpointR: 'http://localhost:60248',
	// portalURL: 'http://localhost:4200/#/app/masters/live-order-2',
	// portalTabURL: 'http://localhost:4200/#/app/masters/tabs',
	// portalURL1: 'http://localhost:4200/#/app/masters/',

	apiEndpoint: 'https://aapi.hlhlth.app/api', /** =>Qa Api */
	apiEndpointR: 'https://aapi.hlhlth.app',
	portalURL: 'https://p.hlhlth.app/#/app/masters/live-order-2',
	portalTabURL: 'https://p.hlhlth.app/#/app/masters/tabs',
	portalURL1: 'https://p.hlhlth.app/#/app/masters/',

	// apiEndpoint: 'https://api.hola.health/api', /** =>Live Api */
	// apiEndpointR: 'https://api.hola.health', /** =>Live Api */
	// portalURL: 'https://pharmacy.hola.health/#/app/masters/live-order-2',
	// portalTabURL: 'https://pharmacy.hola.health/#/app/masters/tabs',
	// portalURL1: 'https://pharmacy.hola.health/#/app/masters/',

	// apiEndpoint: 'https://devapi.packapill.com/api', /** =>Live Api */
	// apiEndpointR: 'https://devapi.packapill.com', /** =>Live Api */
	// portalURL: 'https://devpharmacy.packapill.com/#/app/masters/live-order-2',
	// portalTabURL: 'https://devpharmacy.packapill.com/#/app/masters/tabs',
	// portalURL1: 'https://devpharmacy.packapill.com/#/app/masters/',

	branchkey: "key_test_noQXaLIdFIC5VZuv7Q6QVejnDsmKPXdD",
	firebaseConfig: {
		apiKey: "AIzaSyCAAf2PrE6sDF0vCpCi805Urs8-MQDygfg",
		authDomain: "packapill-consumerapp.firebaseapp.com",
		databaseURL: "https://packapill-consumerapp.firebaseio.com",
		projectId: "packapill-consumerapp",
		storageBucket: "packapill-consumerapp.appspot.com",
		messagingSenderId: "13529015542",
		appId: "1:13529015542:web:0159e88031d66ebb7e78d7",
		measurementId: "G-5YVFBJK6NT"
	},
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
