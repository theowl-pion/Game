import React from 'react';
import DashboardLayout from '../../components/DashboardLayout'; // Adjust path if needed
// Removed: import './admin.css';

const AdminDashboard = () => {
  // TODO: Fetch actual admin data (user count, stats, etc.)
  const userCount = 150; // Example data
  const gamePlays = 1250; // Example data

  return (
    <DashboardLayout userType="admin">
      {/* Page specific content */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tableau de Bord Administrateur</h1>

      {/* Example Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Utilisateurs Inscrits</h3>
          <p className="text-3xl font-semibold text-blue-600">{userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Participations au Jeu</h3>
          <p className="text-3xl font-semibold text-green-600">{gamePlays}</p>
        </div>
        {/* Add more cards as needed */}
      </div>
      
      {/* Placeholder for more content like tables, charts, etc. */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Section Contenu Supplémentaire</h3>
          <p className="text-gray-600">Ici pourraient se trouver des graphiques, des listes d'utilisateurs récents, des logs, etc.</p>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
