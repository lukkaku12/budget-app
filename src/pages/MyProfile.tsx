import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import { router } from "../navigation/router";
import axios from "axios";

interface UserProfile { id: string; name: string; email: string; role: string; onboarding: boolean; }

const MyProfile = () => {
  const auth = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get("https://raspy-jacquenette-testingbruhhh-6daeb85c.koyeb.app/api/v1/users/profile", { headers: { Authorization: `Bearer ${token}` } });
        setUser(response.data);
      } catch (error) { console.error("Error fetching profile:", error); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    auth.setIsAuthenticated(false);
    router.navigate("/welcome");
  };

  if (loading) return <div className="loading-state"><div><div className="spinner-dot" /><h2>Loading profile</h2></div></div>;

  return (
    <div>
      <header className="topbar"><div><h1>Profile</h1><p>Manage your account identity and session.</p></div></header>
      <section className="panel profile-card">
        <img src="https://picsum.photos/id/237/300/300" alt="Profile" className="avatar mb-4" />
        <span className="status-pill active">{user?.role}</span>
        <h2 className="mt-3 mb-1">{user?.name}</h2>
        <p className="text-muted">{user?.email}</p>
        <p className="mx-auto text-muted" style={{ maxWidth: 520 }}>Welcome to your polished Payout Pal workspace. Your budgets, categories, and transaction workflows are designed to stay organized and easy to scan.</p>
        <div className="action-row justify-content-center mt-4"><button className="pp-btn pp-btn-secondary">Edit profile</button><button className="pp-btn pp-btn-danger" onClick={handleLogout}>Logout</button></div>
      </section>
    </div>
  );
};

export default MyProfile;
