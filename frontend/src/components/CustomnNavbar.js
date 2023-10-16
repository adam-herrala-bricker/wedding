import Language from './Language'
import User from './User'
import text from '../resources/text'

import { Container, Nav, Navbar } from 'react-bootstrap';

function CustomNavbar({ lan, setEntryKey, setLastScroll }) {
    return (
        <Navbar expand="lg" sticky="top" className="p-2 text-dark" style={{backgroundColor : 'rgb(234, 243, 238)', fontWeight : 200}}>
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
                    </Nav>

                    <Nav>
                        <User setEntryKey={setEntryKey} lan={lan} setLastScroll = {setLastScroll}/>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;