import {useSelector} from 'react-redux';
import User from './User';

import {Container, Nav, Navbar} from 'react-bootstrap';

const CustomNavbar = () => {
  const textLan = useSelector((i) => i.view.textLan);

  return (
    <Navbar
      expand = "lg"
      sticky = "top"
      className = "p-2 text-dark"
      style = {{backgroundColor: 'rgb(234, 243, 238)', fontWeight: 200}}>
      <Container>
        <Navbar.Brand>{textLan.header}</Navbar.Brand>
        <Navbar.Toggle aria-controls = "basic-navbar-nav" />
        <Navbar.Collapse id = "basic-navbar-nav">
          <Nav className = "me-auto">
            <Nav.Link href = "#music">{textLan.music}</Nav.Link>
            <Nav.Link href = "#image-top">{textLan.photos}</Nav.Link>
          </Nav>
          <Nav>
            <User />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>);
};

export default CustomNavbar;
