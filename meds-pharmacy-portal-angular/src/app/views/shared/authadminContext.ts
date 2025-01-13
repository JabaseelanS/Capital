export class AuthAdminContext {
	public static users: any = JSON.parse(localStorage.getItem("userdetails"));
	public static roles: any = [];
	public static permissions = [];
}
