import React, { Component, ReactNode } from 'react';
import './App.css';
import Login from './Login/Login';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';
import MainPage from './MainPage/MainCommonPage';
import { useState, useEffect } from 'react';
import LogINComp from './Component/LogINComp' 


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
				<li>
				<Link to="/about">About</Link>
			  </li>

			</ul>
		  </nav>
  
		  <Switch>
			<PrivateRoute path="/mainPage" component={MainPage}>
			</PrivateRoute>
			
			<Route path="/login" component={LogINComp}>
			</Route>
			
			<Route path="/about" component={About}>
			</Route>
		  
			</Switch>
		</div>
	  </Router>
	);
}

function About() {
	/*
		console.log("-----in log in comp func------")
		myAuth.authenticate()
		
		if (myAuth.isAuthenticated){
			return <MainPage />
		}*/
	
		return <h2> HUI WHERE IS ?? </h2>;
}






/*
function LoginComp() {

	console.log("-----in log in comp func------")
	
	if (myAuth.isAuthenticated){
		return <MainPage />
	}

	return <Login />;
}*/
  


const myAuth = {

	isAuthenticated: false,

	async authenticate()  {

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

			const req = await axios.create({
				baseURL: url,
				timeout: 1000,
				headers: {'Authorization': 'Bearer '+ token}
			});

			await req.get(url, {
			})
			.then((response) => {
				console.log(response);

				// response is ok.
				if (response.data.isValid) {
					console.log("I am authentificated !!!! in checking ")
					this.isAuthenticated = true;
					
				}

			},(error) => {
				
				// In case the token was "undefined".
				console.log("------------error in the 'else' scope, app: " + error);

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
