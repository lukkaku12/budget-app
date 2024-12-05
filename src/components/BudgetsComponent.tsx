import React from "react";

interface Budget {
  id: number;
  name: string;
}

const mockBudgets: Budget[] = [
  { id: 1, name: "Budget 1" },
  { id: 2, name: "Budget 2" },
  { id: 3, name: "Budget 3" },
  { id: 4, name: "Budget 4" },
];

const Budgets: React.FC = () => {
  return (
    <div style={styles.container}>
      {mockBudgets.map((budget) => (
        <div key={budget.id} style={styles.budgetCard}>
          {budget.name}
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "16px",
    padding: "16px",
    width: "100%",
    height: "100%",
  },
  budgetCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

export default Budgets;