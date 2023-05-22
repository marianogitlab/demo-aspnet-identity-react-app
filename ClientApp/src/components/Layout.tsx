import * as React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export const Layout = ({ children }: { children: any }) => {
    return (
        <div>
            <NavMenu />
            <Container tag="main">
                {children}
            </Container>
        </div>
    );
}
