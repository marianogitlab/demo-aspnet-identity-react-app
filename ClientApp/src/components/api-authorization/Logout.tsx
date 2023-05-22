import * as React from 'react'
import { Component } from 'react';
import authService from './AuthorizeService';
import { AuthenticationResultStatus } from './AuthorizeService';
import { QueryParameterNames, LogoutActions, ApplicationPaths } from './ApiAuthorizationConstants';

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
export const Logout = ({ action }: { action: string }) => {

    const [profile, setProfile] = React.useState({
        message: undefined,
        isReady: false,
        authenticated: false
    });

    React.useEffect(() => {

        switch (action) {
            case LogoutActions.Logout:
                if (!!window.history.state.usr.local) {
                    logout(getReturnUrl());
                } else {
                    // This prevents regular links to <app>/authentication/logout from triggering a logout
                    setProfile({ ...profile, isReady: true, message: "The logout was not initiated from within the page." });
                }
                break;
            case LogoutActions.LogoutCallback:
                processLogoutCallback();
                break;
            case LogoutActions.LoggedOut:
                setProfile({ ...profile, isReady: true, message: "You successfully logged out!" });
                break;
            default:
                throw new Error(`Invalid action '${action}'`);
        }

        populateAuthenticationState();
    }, []);


    const logout = async (returnUrl) => {

        const state = { returnUrl };
        const isauthenticated = await authService.isAuthenticated();
        if (isauthenticated) {
            const result: any = await authService.signOut(state);
            switch (result.status) {
                case AuthenticationResultStatus.Redirect:
                    break;
                case AuthenticationResultStatus.Success:
                    await navigateToReturnUrl(returnUrl);
                    break;
                case AuthenticationResultStatus.Fail:
                    setProfile({ ...profile, message: result.message });
                    break;
                default:
                    throw new Error("Invalid authentication result status.");
            }
        } else {
            setProfile({ ...profile, message: "You successfully logged out!" });
        }
    }

    const processLogoutCallback = async () => {
        const url = window.location.href;
        const result: any = await authService.completeSignOut(url);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                // There should not be any redirects as the only time completeAuthentication finishes
                // is when we are doing a redirect sign in flow.
                throw new Error('Should not redirect.');
            case AuthenticationResultStatus.Success:
                await navigateToReturnUrl(getReturnUrl(result.state));
                break;
            case AuthenticationResultStatus.Fail:
                setProfile({ ...profile, message: result.message });
                break;
            default:
                throw new Error("Invalid authentication result status.");
        }
    }

    const populateAuthenticationState = async () => {
        const authenticated = await authService.isAuthenticated();
        setProfile({ ...profile, isReady: true, authenticated });
    }

    const getReturnUrl = (state?: { returnUrl: string }) => {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get(QueryParameterNames.ReturnUrl);
        if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
            // This is an extra check to prevent open redirects.
            throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
        }
        return (state && state.returnUrl) ||
            fromQuery ||
            `${window.location.origin}${ApplicationPaths.LoggedOut}`;
    }

    const navigateToReturnUrl = (returnUrl: string) => {
        return window.location.replace(returnUrl);
    }

    if (!profile.isReady) {
        return <div></div>
    }
    if (!!profile.message) {
        return (<div>{profile.message}</div>);
    } else {
        switch (action) {
            case LogoutActions.Logout:
                return (<div>Processing logout</div>);
            case LogoutActions.LogoutCallback:
                return (<div>Processing logout callback</div>);
            case LogoutActions.LoggedOut:
                return (<div>{profile.message}</div>);
            default:
                throw new Error(`Invalid action '${action}'`);
        }
    }
}
