import * as React from 'react';
import authService from './api-authorization/AuthorizeService'

export const FetchData = () => {
    const [data, setData] = React.useState({ forecasts: [], loading: true });

    React.useEffect(() => {
        populateWeatherData();
    }, []);

    const populateWeatherData = async () => {
        const token = await authService.getAccessToken();
        const response = await fetch('weatherforecast', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setData({ forecasts: data, loading: false });
    }
    const renderForecastsTable = (forecasts: any) => {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    let contents = data.loading
        ? <p><em>Loading...</em></p>
        : renderForecastsTable(data.forecasts);

    return (
        <div>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
}
