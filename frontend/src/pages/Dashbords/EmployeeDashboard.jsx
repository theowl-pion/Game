import React from 'react';
import DashboardLayout from '../../components/DashboardLayout'; // Adjust path if needed
// Removed: import './employee.css';

const EmployeeDashboard = () => {
  // TODO: Fetch actual employee data (name, assigned tasks, etc.)
  const employeeName = "Alice Martin"; // Example data
  const tasks = [
      { id: 1, title: "Valider les tickets gagnants", status: "En cours" },
      { id: 2, title: "Préparer les lots pour l'expédition", status: "À faire" },
      { id: 3, title: "Répondre aux demandes clients", status: "En cours" },
  ]; // Example data

  return (
    <DashboardLayout userType="employee">
        {/* Page specific content */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Bienvenue, {employeeName} !
        </h1>

        {/* Example Content Cards */}
        <div className="grid grid-cols-1 gap-6">
            {/* Tasks List Card */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Mes Tâches Actuelles</h3>
                {tasks.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {tasks.map(task => (
                            <li key={task.id} className="py-3 flex justify-between items-center">
                                <span className="text-gray-800">{task.title}</span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {task.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">Vous n'avez aucune tâche assignée pour le moment.</p>
                )}
            </div>

            {/* Add more sections specific to employee tasks or information */}
        </div>
        
         {/* Placeholder for more content */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Notifications</h3>
            <p className="text-gray-600">Ici pourraient se trouver les notifications importantes.</p>
        </div>

    </DashboardLayout>
  );
}

export default EmployeeDashboard;
