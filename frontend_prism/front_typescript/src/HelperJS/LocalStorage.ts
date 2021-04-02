export default class LocalStorage  {

	static role = "currentRole"
	static token = "token"
	static username = "currentUsername"

	static setItem (itemName: string, value: string) {
		
		console.log("assigning " + value + " to " + itemName + " in local storage")
		localStorage.setItem(itemName, value)

	}

	static getItem (itemName: string){

		let value = localStorage.getItem(itemName)
		return value
	}

	static cleanAll(){
		localStorage.clear()
	}
}