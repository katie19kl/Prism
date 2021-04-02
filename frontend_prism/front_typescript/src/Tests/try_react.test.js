/*
act() that makes sure all updates related to these “units” 
have been processed and applied to the DOM before you make any assertions:


act(() => {
    render components
});


make assertions

*/

import { Button } from "@material-ui/core";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import MainView from "../Component/MainView";
import Login from "../Login/Login"
import LocalStorage from "./../HelperJS/LocalStorage";

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });


let container = null;
beforeEach(() => {
	LocalStorage.cleanAll()
	// setup a DOM element as a render target
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	
	LocalStorage.cleanAll()		
	// cleanup on exiting
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});



it("renders Main page with or without a name", () => {
	

	act(() => {    render(<MainView title='ficus' />, container);  });
	expect(container.textContent).toEqual("Main page view Component ficus");
  
	act(() => {    render(<MainView/>, container);  });
	expect(container.textContent).toEqual("Main page view Component ");
 
});


it ("local storage testing ", async ()=>{
	
	/*localStorage.setItem('token', '1');
	localStorage.setItem('currentUserName', '2')
	localStorage.setItem('currentRole', '3')
*/

	
	//localStorage.setItem('token','1')
	
	let fakeResponce = {
		tokenInfo : {
			token : '1',
			username : '2',
			role : '3'
		}
	}
	jest.spyOn(global, "fetch").mockImplementation(() =>
	    Promise.resolve({
			json: () => Promise.resolve(fakeResponce.json())    
		})
	);

/*
	act(()=> {
		render (<Login/>, container)	
	});


	let button = document.getElementById('logInButton');
	act(()=> {
		button.dispatchEvent(new MouseEvent("click"));
	});*/

	let mount = Enzyme.mount;
	let component = mount(<Login/>)
	
	component.find('button#logInButton')
	.simulate('onclick', {token: "asd"})
	LocalStorage.getItem('token')


	global.fetch.mockRestore();
})