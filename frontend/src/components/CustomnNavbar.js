import Language from './Language'
import User from './User'
import text from '../resources/text'

import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

function CustomNavbar({ lan, setLan, guestUser, user, setUser, setEntryKey, setLastScroll }) {
    return (
        <Navbar expand="lg" sticky="top" className="bg-success p-2 text-dark bg-opacity-10">
            <Container>
                <Navbar.Brand>{text.header[lan]}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#music">{text.music[lan]}</Nav.Link>
                        <Nav.Link href="#image-top">{text.photos[lan]}</Nav.Link>
                        {/* <NavDropdown title="Dropdown" NavDropdown>
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown> */}
                        <Language setLan={setLan} />
                    </Nav>

                    <Nav>
                        <User user={user} setUser={setUser} guestUser={guestUser} setEntryKey={setEntryKey} lan={lan} setLastScroll = {setLastScroll}/>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;