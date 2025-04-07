import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiHome } from "react-icons/fi";

const DashboardLayout = ({ userType, children }) => {
  const navigate = useNavigate();

  // Define header styles based on userType
  let headerBgColor = "bg-white";
  let title = "Dashboard";

  switch (userType) {
    case "admin":
      title = "Panneau Administrateur";
      break;
    case "client":
      title = "Espace Client";
      break;
    case "employee":
      title = "Espace Employé";
      break;
    default:
      // Default or handle error/redirect
      break;
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    // TODO: Potentially call a logout API endpoint
    navigate("/login");
    alert("Déconnexion réussie.");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className={`${headerBgColor} shadow`}>
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <FiHome className="mr-2" />
              Accueil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <FiLogOut className="mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-10">
        {children} {/* Where the specific dashboard content will be rendered */}
      </main>
    </div>
  );
};

export default DashboardLayout;
