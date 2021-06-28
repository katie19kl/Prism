import LocalStorage from "./LocalStorage";

export default class Token  {

  static getToken() {

		const token = LocalStorage.getItem(LocalStorage.token)!;
	
		if (token === "undefined" || token === undefined){
			console.log("token undefined")
			return null
		}
		return token;
  
  	}
	
	static setToken(userToken: string) {
	
		LocalStorage.setItem(LocalStorage.token, userToken);
	}
}






