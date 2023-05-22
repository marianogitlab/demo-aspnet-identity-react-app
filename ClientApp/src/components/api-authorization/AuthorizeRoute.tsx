import * as React from 'react'
import { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { ApplicationPaths, QueryParameterNames } from './ApiAuthorizationConstants'
import authService from './AuthorizeService'

const AuthorizeRoute = ({ path, element }: any)=> {

    const [_subscription, setSubscription] = React.useState(0);
    const [state, setState] = React.useState({
        ready: false,
        authenticated: false
    });

    React.useEffect(() => {

        setSubscription(authService.subscribe(() => authenticationChanged()));
        populateAuthenticationState();

        return () => {
            authService.unsubscribe(_subscription);
        }
    }, []);


    const populateAuthenticationState = async () => {
        const authenticated = await authService.isAuthenticated();
        setState({ ready: true, authenticated });
    }

    const authenticationChanged = async () => {
        setState({ ready: false, authenticated: false });
        await populateAuthenticationState();
    }

    var link = document.createElement("a");
      link.href = path ;
    const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
    const redirectUrl = `${ApplicationPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`;
    if (!state.ready) {
      return <div></div>;
    } else {
        return state.authenticated ? element : <Navigate replace to={redirectUrl} />;
    }
}

export default AuthorizeRoute;
