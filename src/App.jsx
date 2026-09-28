/* eslint-disable react-hooks/set-state-in-effect */
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAccountInfo } from './api/scan';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import './styles.css';

function Shell({ children }) {
  const { isAuthenticated } = useAuth();
  const [account, setAccount] = useState(null);
  const [accountLoading, setAccountLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!isAuthenticated) { setAccount(null); setAccountLoading(false); return () => { alive = false; }; }
    setAccountLoading(true);
    getAccountInfo()
      .then(data => alive && setAccount(data?.eventFiltersInfo || null))
      .catch(() => alive && setAccount(null))
      .finally(() => alive && setAccountLoading(false));
    return () => { alive = false; };
  }, [isAuthenticated]);

  return <><Header account={account} accountLoading={accountLoading} />{children}</>;
}

export default function App() {
  return <Shell><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
    <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
  </Routes></Shell>;
}
