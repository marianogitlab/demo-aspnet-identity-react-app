import * as React from "react";
import authService from "./api-authorization/AuthorizeService";

export const CompaniesPage = () => {

    const [companies, setCompanies] = React.useState([]);

    React.useEffect(() => {
        const call = async function() {

            const token = await authService.getAccessToken();
            const response = await fetch('companies', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setCompanies(data);
        }
        call();
    }, []);

    return (
        <div>
            Companies
            {JSON.stringify(companies)}
        </div>
    );
}