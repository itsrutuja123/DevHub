import React,{useEffect} from 'react';
import {useNavigate,useRoutes} from 'react-router-dom';

//Pages

import Dashboard from './components/dashboard/dashboard';

import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/signup";
import { useAuth } from './authContex';

const ProjectRoutes=()=>{
    const {currentUser,setCurrentUser}=useAuth();
    const navigate = useNavigate();
    //runs once only when file loaded first time
    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");
        //User logged in then set up as cuurent user
        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }
        //not logged in take to auth path 
        if(!userIdFromStorage && !["/auth","/signup"].includes(window.location.pathname)){
            navigate("/auth");
        }
        //if already logged in take to home route
        if(userIdFromStorage && window.location.pathname =="./auth"){
            navigate('/');
        }
    },[currentUser,navigate,setCurrentUser]);

    let element = useRoutes([
        {
            path : '/',
            element :<Dashboard/>
        },
        {
            path:'/auth',
            element:<Login/>
        },
        {
            path :'signup',
            element :<Signup/>
        },
        {
            path:'profile',
            element:<Profile/>
        }
    ]);
    return element;
}
export default ProjectRoutes;