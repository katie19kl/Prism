import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import LogINComp from './Component/LogINComp' 
import CommanderMainPage from './MainPage/CommanderMainPage';
import NoPermissions from './MainPage/NoPermissions';

import PrivateRoutingComponent from './Routing/PrivateRoutingComponent'
import MainView from './Component/MainView'
import Logout from './Component/Logout'


const Role = {
	Admin: 'admin',
	User: 'user'    
}


export default function App() {
	return (
	  <Router>
		<div>
		  <nav>
			<ul>

			  <li>
				<Link to="/foo">Login</Link>
			  </li>				

			  <li>
				<Link to="/login">Login</Link>
			  </li>
			  <li>
				<Link to="/mainPage">MainPage</Link>
			  </li>
				<li>
				<Link to="/about">About</Link>
			  </li>

				
			  <li>
				<Link to="/adminPage">Admin Page</Link>
			  </li>
			  
				<li>
				<Link to="/logout">Logout</Link>
			  </li>
			


			</ul>
		  </nav>
  
		  <Switch>
				
				<PrivateRoutingComponent path="/mainPage" component={MainView}>

				</PrivateRoutingComponent>


				<PrivateRoutingComponent path="/adminPage" roles={[Role.Admin]}  component={CommanderMainPage}>
			
				</PrivateRoutingComponent>

			
			<Route path="/login" component={LogINComp}>
			</Route>
			
		
			<Route path="/foo" component={MaterialUI}>
			</Route>

			<Route path="/about" component={About}>
			</Route>

			<Route path="/noPermissions" component={NoPermissions}>
			</Route>

			<Route path="/logout" component={Logout}>
			</Route>

			</Switch>
		</div>
	  </Router>
	);
}


function About() {
	
	return <h2> About Page </h2>;
}

/*
const myAuth = {

	isAuthenticated: false,

	async validateToken()  {

		console.log("try to authentificate, inside App")
		
		let token = localStorage.getItem('token');
		
		if (token === null || token === 'undefined') {
			this.isAuthenticated = false;
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
	
	myAuth.validateToken(),

	<Route {...rest} render={(props) => (
	  myAuth.isAuthenticated === true
		? <Component {...props} />
		: <Redirect to='/login' />
	)} />
)
*/