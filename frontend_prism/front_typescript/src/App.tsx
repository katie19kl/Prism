import './App.css';


import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";
import Login from './Login/Login';
import StudentMainPage from './MainPage/StudentMainPage';
import About from './MainPage/About';
import { Welcome } from './Component/Welcome';
import PrivateRoute from './Routing/PrivateRouting';

import DashboardAfterLogIn from './MainPage/DashboardAfterLogIN';
import Preferences from './MainPage/Preferences';


export default function App() {
  
  const token = localStorage.getItem('token')!;

  if(!token) {
    console.log(" 1-----------")
    return <Login/>
  }

  
  console.log(" 2-----------")
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <DashboardAfterLogIn />
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}



        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            


     
        {/*/text/path/ are in prop in private route*/}
        
/*

  <PrivateRoute exact path="/student" component={Welcome} text="Hello world!" />

          <Route path="/about">
            <About />
          </Route>

          <Route path="/student">
            <StudentMainPage />
          </Route>
        
 
          <Route path="/log_in">
            <Login />
          </Route>
       
        </Switch>

*/