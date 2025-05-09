import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { router } from '../navigation/router';

const MyProfile = () => {
  const auth = useAuth();

  const handleLogout = () => {
    Cookies.remove('token'); // Elimina el token de las cookies
    auth.setIsAuthenticated(false); // Actualiza el estado de autenticación
    router.navigate('/login'); // Redirige al login
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <h3>John Doe</h3>
                <p className="text-muted">johndoe@example.com</p>
                <p>Full Stack Developer</p>
              </div>
              <div>
                <h5>About Me</h5>
                <p>
                  Hi! I'm John Doe, a passionate full stack developer with a love for building modern and responsive web applications. I specialize in JavaScript, React, Node.js, and other web technologies.
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <Button variant="primary">Edit Profile</Button>
                <Button variant="danger" onClick={handleLogout}>Logout</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;