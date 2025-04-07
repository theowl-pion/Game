import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiLogOut, FiHome, FiPlayCircle } from "react-icons/fi";

const DashboardLayout = ({ userType, children }) => {
  const navigate = useNavigate();

  // Define header styles based on userType
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
    // alert("Déconnexion réussie."); // Consider removing alert or making it a toast
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-600 shadow-md flex flex-col text-white">
        {/* Sidebar Header (Optional: Logo/Brand) */}
        <div className="h-16 flex items-center justify-center border-b border-teal-700">
          {/* Titre "TipTop Game" supprimé */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-teal-100 hover:bg-teal-700 hover:text-white group"
          >
            <FiHome
              className="mr-3 h-5 w-5 text-teal-300 group-hover:text-white"
              aria-hidden="true"
            />
            Accueil
          </Link>

          {/* Conditional "Jouer" Button for Client */}
          {userType === "client" && (
            <Link
              to="/game" // Adjust the path to your game page
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-teal-100 hover:bg-teal-700 hover:text-white group"
            >
              <FiPlayCircle
                className="mr-3 h-5 w-5 text-teal-300 group-hover:text-white"
                aria-hidden="true"
              />
              Jouer
            </Link>
          )}

          {/* Add other common navigation links here if needed */}
        </nav>

        {/* Logout Button at the bottom */}
        <div className="mt-auto p-4 border-t border-teal-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-teal-100 hover:bg-teal-700 hover:text-white group"
          >
            <FiLogOut
              className="mr-3 h-5 w-5 text-teal-300 group-hover:text-white"
              aria-hidden="true"
            />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Header supprimé */}

        {/* Main scrollable content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-10">
          {children} {/* Where the specific dashboard content will be rendered */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
