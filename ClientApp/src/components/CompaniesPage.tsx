import * as React from 'react';
import { Button, Col, Input, InputGroup, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'

export const CompaniesPage = () => {

    const [data, setData] = React.useState({ companies: [], loading: true });
    const [company, setCompany] = React.useState({ open: false, id: '', name: '' });

    const toggle = () => setCompany({
        ...company,
        open: !company.open,
    });

    React.useEffect(() => {
        populateCompaniesData();
    }, []);

    const submit = async () => {

        const token = await authService.getAccessToken();
        await fetch('companies', {
            method: 'POST',
            body: JSON.stringify({ ...company, id: 0 }),
            headers: !token ? {} : {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        });

        populateCompaniesData();
        toggle();
    }

    const deleteCompany = async (companies: any) => {

        const token = await authService.getAccessToken();
        await fetch('companies/' + companies.id, {
            method: 'DELETE',
            headers: !token ? {} : {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        });

        populateCompaniesData();
    }

    const populateCompaniesData = async () => {
        const token = await authService.getAccessToken();
        const response = await fetch('companies', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setData({ companies: data, loading: false });
    }

    const edit = (company) => {

        setCompany({ open: true, ...company });
    }

    const add = () => {

        setCompany({ open: true, id: '', name: '' });
    }

    const renderForecastsTable = (companies: any) => {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map(company =>
                        <tr key={company.id}>
                            <td onClick={() => edit(company)}>{company.id}</td>
                            <td onClick={() => edit(company)}>{company.name}</td>
                            <td style={{ width: '30px' }} onClick={() => deleteCompany(company)}>
                                X
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    let contents = data.loading
        ? <p><em>Loading...</em></p>
        : renderForecastsTable(data.companies);

    return (
        <div>
            <h1 id="tableLabel">Test company</h1>
            <p>This component demonstrates fetching data from the server.</p>
            <Button color="primary" onClick={add}>
                Add Company
            </Button>
            <Modal isOpen={company.open} toggle={toggle}>
                <ModalHeader toggle={toggle}>{company.id ? "Edit Company" : "Add Company"}</ModalHeader>
                <ModalBody>
                    <Row style={{ marginBottom: '5px' } }>
                        <Col>
                            <InputGroup>
                                <InputGroupText>ID</InputGroupText>
                                <Input disabled placeholder="id" defaultValue={company.id || '---'} />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup>
                                <InputGroupText>Name</InputGroupText>
                                <Input placeholder="name" value={company.name} onChange={(ev) => { setCompany({ ...company, name: ev.target.value }) }} />
                            </InputGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={submit}>
                        Submit
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
            {contents}
        </div>
    );
}
