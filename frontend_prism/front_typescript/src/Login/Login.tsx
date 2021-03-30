import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			display: 'flex',
			flexWrap: 'wrap',
			width: 400,
			margin: `${theme.spacing(0)} auto`
		},
		loginBtn: {
			marginTop: theme.spacing(2),
			flexGrow: 1
		},
		header: {
			textAlign: 'center',
			background: '#212121',
			color: '#fff'
		},
		card: {
			marginTop: theme.spacing(10),
			background: 'linear-gradient(45deg, #b3ecff 40%, #e6ccff 80%)',
		}
	})
);


//state type

type State = {
	username: string
	password:  string
	isButtonDisabled: boolean
	helperText: string
	isError: boolean
};

const initialState:State = {
	username: '',
	password: '',
	isButtonDisabled: true,
	helperText: '',
	isError: false
};

type Action = { type: 'setUsername', payload: string }
  | { type: 'setPassword', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'loginSuccess', payload: string }
  | { type: 'loginFailed', payload: string }
  | { type: 'setIsError', payload: boolean };

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'setUsername': 
			return {
				...state,
				username: action.payload
			};
		case 'setPassword': 
			return {
				...state,
				password: action.payload
			};
		case 'setIsButtonDisabled': 
			return {
				...state,
				isButtonDisabled: action.payload
			};
		case 'loginSuccess': 
			return {
				...state,
				helperText: action.payload,
				isError: false
			};
		case 'loginFailed':
			return {
				...state,
				helperText: action.payload,
				isError: true
			};
		case 'setIsError': 
			return {
				...state,
				isError: action.payload
			};
	}
}

const Login = () => {
	const classes = useStyles();
	const [state, dispatch] = useReducer(reducer, initialState);

	function getToken() {

		const tokenString = localStorage.getItem('token')!;

		if (tokenString === "undefined"){
			console.log("no token given");
			return " ";
		}
		const userToken = JSON.parse(tokenString);
		console.log(userToken);
		return userToken;
	
	}
	
	function setToken(userToken: string) {
	
		localStorage.setItem('token', JSON.stringify(userToken));
	
	}

	function setUserInfo(response: { username: string; role: string; }){

		localStorage.setItem('currentUserName', response.username)
		localStorage.setItem('currentRole', response.role)
	}


	useEffect(() => {

		if (state.username.trim() && state.password.trim()) {

			dispatch({type: 'setIsButtonDisabled', payload: false});

		} else {

			dispatch({type: 'setIsButtonDisabled', payload: true});

		}
	}, [state.username, state.password]);
	

	let history = useHistory();

	// if there is token OR log in was successfully done 
	function RedirectToMainPage(){

		console.log("before redirection to about ");
		history.push("/mainPage");
	}



	const handleLogin = () => {
		
		let token = getToken();
		console.log("in handle log IN-----token is " + token);

		let url : string;
		
		// first time trying to login.
		//if (token === null || 1 === 1) {

			url = "http://localhost:4000/auth/user";

			let data = {
				username: state.username,
				password: state.password
			};

			fetch(url, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			})
			.then((response) => response.json())
			.then((response) => {

				console.log("the token received from server: " + response.tokenInfo.token);
				const token = response.tokenInfo.token;
				

				localStorage.clear()
				// Save the token in the localStorage.
				setToken(token);
				
				// Save the username and his role in the localStorage.
				setUserInfo(response)


				// Since it's a successful login.
				RedirectToMainPage();

			})
			.catch((error) => {
				console.log("an error has occured, trying to login: " + error);

				// Show informative msg to the user.
				dispatch({type: 'loginFailed', payload: 'Incorrect username or password'});

			})
		//}

 };

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13 || event.which === 13) {
			state.isButtonDisabled || handleLogin();
		}
	};

	const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
		(event) => {
			dispatch({
				type: 'setUsername',
				payload: event.target.value
			});
		};

	const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
		(event) => {
			dispatch({
				type: 'setPassword',
				payload: event.target.value
			});
		};

	function Foo(e:Event) { // works, to be deleted!
	
		e.preventDefault()
		history.push("/about");

	}

	return (
		<form className={classes.container} noValidate autoComplete="off">
		<Card className={classes.card}>
			<CardHeader className={classes.header} title="Login" />
			<CardContent>
			<div>

			<button color='primary' onClick = {(event:any) => Foo(event)}> ON CLICK </button>

			<br></br>
			<br></br>
			<br></br>
			<br></br>
			<br></br>
				<TextField
				error={state.isError}
				fullWidth
				id="username"
				type="email"
				label="Username"
				placeholder="Username"
				margin="normal"
				onChange={handleUsernameChange}
				onKeyPress={handleKeyPress}
				/>
				<TextField
				error={state.isError}
				fullWidth
				id="password"
				type="password"
				label="Password"
				placeholder="Password"
				margin="normal"
				helperText={state.helperText}
				onChange={handlePasswordChange}
				onKeyPress={handleKeyPress}
				/>
			</div>
			</CardContent>
			<CardActions>
			<Button
				id = 'logInButton'
				variant="contained"
				size="large"
				color="secondary"
				className={classes.loginBtn}
				onClick={handleLogin}
				disabled={state.isButtonDisabled}>
				Login
			</Button>
			</CardActions>
		</Card>
		</form>
	);
}

export default Login;