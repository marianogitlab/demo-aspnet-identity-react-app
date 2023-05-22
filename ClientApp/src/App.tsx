import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import { Layout } from './components/Layout';
import './custom.css';
import axios from 'axios';
import authService from './components/api-authorization/AuthorizeService'

const App = () => {

    return (
        <Layout>
            <Routes>
                {AppRoutes.map((route, index) => {
                    const { element, requireAuth, ...rest } = route as any;
                    return <Route key={index} {...rest} element={requireAuth ? <AuthorizeRoute {...rest} element={element} /> : element} />;
                })}
            </Routes>
        </Layout>
    );
}

export default App;
