import * as React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';
import { Fragment } from 'react';

export const LoginMenu = () => {

    const [profile, setProfile] = React.useState({
        isAuthenticated: false,
        userName: null
    });
    const [subscription, setSubscription] = React.useState<any>();

    React.useEffect(() => {

        setSubscription(authService.subscribe(() => populateState()));
        populateState();

        return () => {
            authService.unsubscribe(subscription);
        }
}, []);


    const populateState = async () => {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
        setProfile({
            isAuthenticated,
            userName: user && user.name
        });
    }

    const authenticatedView = (userName, profilePath, logoutPath, logoutState) => {
        return (<Fragment>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={profilePath}>Hello {userName}</NavLink>
            </NavItem>
            <NavItem>
                <NavLink replace tag={Link} className="text-dark" to={logoutPath} state={logoutState}>Logout</NavLink>
            </NavItem>
        </Fragment>);
    }

    const anonymousView = (registerPath, loginPath) => {
        return (<Fragment>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={registerPath}>Register</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={loginPath}>Login</NavLink>
            </NavItem>
        </Fragment>);
    }

    if (!profile.isAuthenticated) {
        const registerPath = `${ApplicationPaths.Register}`;
        const loginPath = `${ApplicationPaths.Login}`;
        return anonymousView(registerPath, loginPath);
    } else {
        const profilePath = `${ApplicationPaths.Profile}`;
        const logoutPath = `${ApplicationPaths.LogOut}`;
        const logoutState = { local: true };
        return authenticatedView(profile.userName, profilePath, logoutPath, logoutState);
    }
}
