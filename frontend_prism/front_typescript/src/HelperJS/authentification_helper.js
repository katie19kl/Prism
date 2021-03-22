import axios from "axios";

async function validateTokenFunc()  {

  console.log("@@@@@@@@ try to authentificate, inside PrivateComponent")
  
  let token = localStorage.getItem('token');
  
  if (token === null || token === 'undefined') {
    //this.isAuthenticated = false;
    return false;

  } else {

    if (token[0] === '"' && token[token.length - 1] === '"') {
      token = token.substring(1, token.length - 1);
    }
    
    // send the token to the server and check its response.
    let url = "http://localhost:4000/auth/validate"; 

    const req = await axios.create({
      baseURL: url,
      timeout: 1000,
      headers: {'Authorization': 'Bearer '+ token}
    });

    return await req.get(url, {
    })
    .then((response) => {
      console.log(response);

      // response is ok.
      if (response.data.isValid) {	
        console.log(" true after server validation ")
        //this.isAuthenticated = true;
        return true;
      }else {
                  //this.isAuthenticated = false;
        return false
      }

    },(error) => {
      
      // In case the token was "undefined".
      console.log("false after server validation: " + error);
              //this.isAuthenticated = false;
      return false
    });
  }

}

function currentUserRole(){
	let role = localStorage.getItem('currentRole')
	if (role === undefined || role === null){
		role = " "
	}
	return role;

}

function currentUserUsername(){
	let username = localStorage.getItem('currentUserName')
	if (username === undefined || username === null){
		username = " "
	}

	return username;
}

export {validateTokenFunc, currentUserRole, currentUserUsername}