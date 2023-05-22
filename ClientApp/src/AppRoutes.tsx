import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { CompaniesPage } from "./components/CompaniesPage";
import * as React from 'react';

const AppRoutes = [
    {
        index: true,
        requireAuth: true,
        element: <Home />
    },
    {
        path: '/counter',
        requireAuth: true,
        element: <Counter />
    },
    {
        path: '/fetch-data',
        requireAuth: true,
        element: <FetchData />
    },
    {
        path: '/companies',
        requireAuth: true,
        element: <CompaniesPage />
    },
    ...ApiAuthorzationRoutes
];

export default AppRoutes;
