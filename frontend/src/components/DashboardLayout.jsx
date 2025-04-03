import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import icons (example using react-icons)
import { FiHome, FiUsers, FiSettings, FiLogOut, FiGift, FiUser, FiTrello, FiBell } from 'react-icons/fi'; 

const DashboardLayout = ({ userType, children }) => {
    const navigate = useNavigate();

    // Define sidebar styles and links based on userType
    let sidebarBgColor = 'bg-gray-800'; // Default
    let sidebarTextColor = 'text-gray-300';
    let sidebarHoverColor = 'hover:bg-gray-700 hover:text-white';
    let activeLinkColor = 'bg-gray-900 text-white';
    let title = 'Dashboard';
    let navLinks = [];

    switch (userType) {
        case 'admin':
            sidebarBgColor = 'bg-blue-900';
            sidebarTextColor = 'text-blue-100';
            sidebarHoverColor = 'hover:bg-blue-800 hover:text-white';
            activeLinkColor = 'bg-blue-950 text-white';
            title = 'Admin Panel';
            navLinks = [
                { path: '/admindashboard', icon: <FiHome />, label: 'Tableau de bord' },
                { path: '/admin/users', icon: <FiUsers />, label: 'Utilisateurs' }, // Example paths
                { path: '/admin/stats', icon: <FiGift />, label: 'Statistiques Jeu' }, // Example paths
                { path: '/admin/settings', icon: <FiSettings />, label: 'Paramètres' },
            ];
            break;
        case 'client':
            sidebarBgColor = 'bg-teal-800';
            sidebarTextColor = 'text-teal-100';
            sidebarHoverColor = 'hover:bg-teal-700 hover:text-white';
            activeLinkColor = 'bg-teal-900 text-white';
            title = 'Espace Client';
            navLinks = [
                { path: '/clientdashboard', icon: <FiHome />, label: 'Tableau de bord' },
                { path: '/game', icon: <FiGift />, label: 'Jouer au jeu' },
            ];
            break;
        case 'employee':
            sidebarBgColor = 'bg-indigo-800';
            sidebarTextColor = 'text-indigo-100';
            sidebarHoverColor = 'hover:bg-indigo-700 hover:text-white';
            activeLinkColor = 'bg-indigo-900 text-white';
            title = 'Espace Employé';
            navLinks = [
                { path: '/employeedashboard', icon: <FiHome />, label: 'Tableau de bord' },
                { path: '/employee/tasks', icon: <FiTrello />, label: 'Mes Tâches' }, // Example paths
                { path: '/employee/projects', icon: <FiBell />, label: 'Notifications' }, // Example paths
            ];
            break;
        default:
            // Default or handle error/redirect
            break;
    }

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        // TODO: Potentially call a logout API endpoint
        navigate('/login');
        alert('Déconnexion réussie.');
    };

    // Helper to check if a link is active (can be improved with useLocation)
    const isActive = (path) => {
        // Basic check, for more complex routing use useLocation().pathname
        return window.location.pathname === path;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`w-64 ${sidebarBgColor} ${sidebarTextColor} flex flex-col`}>
                <div className="px-4 py-6">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                </div>
                <nav className="flex-1 px-2 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium ${sidebarHoverColor} ${isActive(link.path) ? activeLinkColor : ''}`}
                        >
                            <span className="mr-3">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                </nav>
                {/* Logout Button */}
                <div className="p-4 mt-auto">
                     <button
                        onClick={handleLogout}
                        className={`w-full flex items-center px-4 py-2.5 rounded-md text-sm font-medium ${sidebarHoverColor}`}
                     >
                        <FiLogOut className="mr-3" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Optional Header inside main content area */}
                {/* <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-xl font-semibold text-gray-900">Page Title</h1>
                    </div>
                </header> */}
                
                {/* Content Area */}    
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-10">
                    {children} {/* Where the specific dashboard content will be rendered */}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 