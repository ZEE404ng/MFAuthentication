import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const ProtectedRoute = () => {
    const {isLoggedIn, loading} = useSession();
    console.log("The Logged in User is: ", isLoggedIn);
    if(loading){
        return <div>Loading...</div>
    }
    return isLoggedIn ? <Outlet/> : <Navigate to="/login" />;
};

export default ProtectedRoute;