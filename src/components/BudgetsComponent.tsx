import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Cookies from 'js-cookie';
import { Badge, Button, Card, Spinner } from 'react-bootstrap'; // Importamos Bootstrap components

interface Category {
  id: string;
  name: string;
  user_id: string;
}

interface Budget {
  id: string;
  name: string;
  amount: number;
  start_date: string; // Puede ser tipo Date si deseas trabajar con objetos Date
  end_date: string;   // Igualmente, puedes usar Date si lo prefieres
  status: string;
  category: Category;
}

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState<boolean>(true); // Estado para el loading
  const [error, setError] = useState<string | null>(null); 

  const navigate = useNavigate();
  
  const retrieveUserBudgets = async () => {
    const token = Cookies.get('token')
    try {
      setLoading(true);
      const response = await axios.get(
        "https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/budgets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBudgets(response.data); // Guardar los datos en el estado
    } catch (err) {
      setError("No hay presupuestos para cargar...");
    } finally {
      setLoading(false); // Finalizar loading
    }
  }

  useEffect(() => {
    retrieveUserBudgets();
  }, []);

  if (loading) {
    return (
      <div style={styles.loader}>
        <Spinner animation="border" role="status" />
        <span style={{ marginLeft: "15px" }}>Cargando presupuestos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.containerError} onClick={() => navigate('/create-budget')}>
        <Button variant="success" style={styles.createNewBudgetBtn}>Create new Budget</Button>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Button variant="primary" style={styles.createNewBudgetBtn} onClick={() => navigate('/create-budget')}>
        Create New Budget
      </Button>
      <div className="row">
        {budgets.map((budget) => (
          <div key={budget.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <Card style={styles.budgetCard}>
              <Card.Header as="h5" style={styles.cardHeader}>
                {budget.name}
              </Card.Header>
              <Card.Body>
                <p><strong>Amount:</strong> ${budget.amount.toFixed(2)}</p>
                <p><strong>Start Date:</strong> {new Date(budget.start_date).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(budget.end_date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {budget.status}</p>
              </Card.Body>
              <Card.Footer className="text-muted">
                <Badge bg="info">Category: {budget.category.name}</Badge>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9", // Fondo gris claro
    minHeight: "100vh", 
  },
  containerError: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#f7f9fc',
  },
  createNewBudgetBtn: {
    marginBottom: "20px",
  },
  budgetCard: {
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    border: "none", 
    backgroundColor: "#ffffff",
  },
  loader: {
    textAlign: "center",
    fontSize: "24px",
    color: "#666",
    paddingTop: "50px",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    color: "gray",
  },
};

export default Budgets;