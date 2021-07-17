import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import LocalStorage from '../HelperJS/LocalStorage';
import { prefix_server_url } from '../HelperJS/url_helper';


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


// state type

type State = {
	username: string
	password: string
	isButtonDisabled: boolean
	helperText: string
	isError: boolean
};

const initialState: State = {
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


	function setToken(userToken: string) {

		LocalStorage.setItem(LocalStorage.token, userToken);

	}

	function setUserInfo(response: { username: string; role: string; }) {

		LocalStorage.setItem(LocalStorage.username, response.username)
		LocalStorage.setItem(LocalStorage.role, response.role)
	}


	useEffect(() => {

		if (state.username.trim() && state.password.trim()) {

			dispatch({ type: 'setIsButtonDisabled', payload: false });

		} else {

			dispatch({ type: 'setIsButtonDisabled', payload: true });

		}
	}, [state.username, state.password]);


	let history = useHistory();

	// if there is token OR log in was successfully done 
	function RedirectToMainPage() {

		history.push("/mainPage");
	}



	const handleLogin = () => {

		let url: string;
		//url = "http://localhost:4000/auth/user";
		url = prefix_server_url + "auth/user";

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

				const token = response.tokenInfo.token;


				LocalStorage.cleanAll()
				// Save the token in the localStorage.
				setToken(token);

				// Save the username and his role in the localStorage.
				setUserInfo(response)

				// Since it's a successful login.
				RedirectToMainPage();

			})
			.catch((error) => {
			
				// Show informative msg to the user.
				dispatch({ type: 'loginFailed', payload: 'Incorrect username or password' });

			})

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

						{/*<button color='primary' onClick = {(event:any) => Foo(event)}> ON CLICK </button>*/}
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
						id='logInButton'
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