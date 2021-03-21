export class Token  {

  static getToken() {

    const tokenString = localStorage.getItem('token')!;

  
    if (tokenString === "undefined"){
      console.log("1")
      return " "
    }
    const userToken = JSON.parse(tokenString);
    console.log(userToken);
    return userToken;
  
  }
  
  static setToken(userToken: string) {
  
    localStorage.setItem('token', JSON.stringify(userToken));
  
  }
  
}






