import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';

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

	useEffect(() => {

		if (state.username.trim() && state.password.trim()) {

			dispatch({type: 'setIsButtonDisabled', payload: false});

		} else {

			dispatch({type: 'setIsButtonDisabled', payload: true});

		}
	}, [state.username, state.password]);
	
	const handleLogin = () => {
		
		let token = getToken();
		console.log("token is " + token);

		let url : string;
		
		// first time trying to login.
		if (token === null) {

				url = "http://localhost:4000/auth/user";
				axios.post(url, {

					username: state.username,
					password: state.password,
		
				})
				.then((response) => {
		
					console.log(response + "in response ");
					
					// either a token or "undefined"(in case the username/password was wrong).
					const token = response.data.token;
					setToken(token);
					
					dispatch({type: 'loginSuccess', payload: 'Login Successfully'});
				
				}, (error) => {
				
					console.log(error + "in error, first login");
					dispatch({type: 'loginFailed', payload: 'Incorrect username or password'});
				
				});
		}
		
		// a token is stored in the localStorage.
		else {

			url = "http://localhost:4000/auth/helloJWT"; 

			const REQ = axios.create({
				baseURL: url,
				timeout: 1000,
				headers: {'Authorization': 'Bearer '+ token}
			});

			REQ.get(url, {
			})
			.then((response) => {
				console.log(response);

			},(error) => {
				
				// In case the token was "undefined".
				console.log("error in the 'else' scope: " + error);
				
			});
		}

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


	return (
		<form className={classes.container} noValidate autoComplete="off">
		<Card className={classes.card}>
			<CardHeader className={classes.header} title="Login" />
			<CardContent>
			<div>
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