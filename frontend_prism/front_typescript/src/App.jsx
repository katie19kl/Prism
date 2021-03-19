import React, { Component, ReactNode } from 'react';
import './App.css';
import Login from './Login/Login';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

  
export default function App() {
	return (
	  <Router>
		<div>
		  <nav>
			<ul>
			  <li>
				<Link to="/login">Login</Link>
			  </li>
			  <li>
				<Link to="/mainPage">MainPage</Link>
			  </li>

			</ul>
		  </nav>
  
		  <Switch>
			<PrivateRoute path="/mainPage" component={MainPage}>
			</PrivateRoute>
			<Route path="/login" component={LoginComp}>
			</Route>
		  </Switch>
		</div>
	  </Router>
	);
}
  
function LoginComp() {
	
	return <Login />;
}
  
function MainPage() {
	return <h2>my main page!</h2>;
}

const myAuth = {
	isAuthenticated: false,

	authenticate() {
		console.log("try to authentificate")
		let token = localStorage.getItem('token');
		
		if (token === null || token === 'undefined') {
			this.isAuthenticated = false;
		} else {

			if (token[0] === '"' && token[token.length - 1] === '"') {
				token = token.substring(1, token.length - 1);
			}
			
			// send the token to the server and check its response.
			let url = "http://localhost:4000/auth/helloJWT"; 

			const req = axios.create({
				baseURL: url,
				timeout: 1000,
				headers: {'Authorization': 'Bearer '+ token}
			});

			req.get(url, {
			})
			.then((response) => {
				console.log(response);

				// response is ok.
				if (response.data.isValid) {
					this.isAuthenticated = true;
				}

			},(error) => {
				
				// In case the token was "undefined".
				console.log("error in the 'else' scope, app: " + error);
				
			});
		}
	}
}


const PrivateRoute = ({ component: Component, ...rest }) => (
	
	myAuth.authenticate(),

	<Route {...rest} render={(props) => (
	  myAuth.isAuthenticated === true
		? <Component {...props} />
		: <Redirect to='/login' />
	)} />
)
