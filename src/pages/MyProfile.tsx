import { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Container, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { router } from '../navigation/router';
import axios from 'axios';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  onboarding: boolean;
}

const MyProfile = () => {
  const auth = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get('https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    auth.setIsAuthenticated(false);
    router.navigate('/welcome');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="text-center">
                <img
                  src="https://picsum.photos/id/237/200/300"
                  alt="Profile"
                  className="rounded-circle mb-3 border border-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <h3 className="fw-bold">{user?.name}</h3>
                <p className="text-muted mb-1">{user?.email}</p>
                <span className="badge bg-success text-uppercase mb-3">{user?.role}</span>
              </div>
              <div>
                <h5 className="mt-4">About Me</h5>
                <p>
                  Welcome to your profile! This section will eventually display your personal bio and app usage statistics. For now, enjoy the simplicity of this dashboard.
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <Button variant="outline-primary">Edit Profile</Button>
                <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;