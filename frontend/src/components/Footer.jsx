import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import './headerFooter.css'; // Removed old CSS

// Simple SVG placeholders for social icons
const FacebookIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>;
const InstagramIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.271.058 2.161.248 2.772.487.612.241.971.551 1.38.961.41.41.72.769.96 1.38.241.611.43 1.501.487 2.772.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.271-.248 2.161-.487 2.772-.241.612-.551.971-.96 1.38-.41.41-.769.72-1.38.96-.611.241-1.501.43-2.772.487-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.271-.058-2.161-.248-2.772-.487-.612-.241-.971-.551-1.38-.96-.41-.41-.72-.769-.96-1.38-.241-.611-.43-1.501-.487-2.772-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.058-1.271.248-2.161.487-2.772.241-.612.551-.971.96-1.38.41-.41.769-.72 1.38-.96.611-.241 1.501-.43 2.772-.487 1.266.058 1.646.07 4.85.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.356.06-2.329.249-3.164.576-.84.331-1.515.749-2.181 1.415-.667.667-1.084 1.342-1.416 2.181-.327.835-.516 1.808-.576 3.164-.058 1.28-.072 1.688-.072 4.85s.014 3.584.072 4.85c.06 1.356.249 2.329.576 3.164.331.84.749 1.515 1.416 2.181.667.667 1.342 1.084 2.181 1.416.835.327 1.808.516 3.164.576 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.356-.06 2.329-.249 3.164-.576.84-.331 1.515-.749 2.181-1.416.667-.667 1.084-1.342 1.416-2.181.327-.835.516-1.808.576-3.164.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.06-1.356-.249-2.329-.576-3.164-.331-.84-.749-1.515-1.416-2.181-.667-.667-1.342-1.084-2.181-1.416-.835-.327-1.808-.516-3.164-.576-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z" /></svg>;
const TiktokIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>;

// Footer section component for cleaner structure
const FooterSection = ({ title, children, isOpen, onToggle }) => (
  <div className="w-full sm:w-1/2 md:w-1/5 px-4 mb-6 md:mb-0">
    <h3 
      className="text-lg font-semibold text-gray-800 mb-4 cursor-pointer md:cursor-default flex justify-between items-center"
      onClick={onToggle} // Only clickable on mobile
    >
      {title}
      <span className="md:hidden text-xl">{isOpen ? '-' : '+'}</span>
    </h3>
    <div className={`${isOpen ? 'block' : 'hidden'} md:block text-gray-600 space-y-2`}>
      {children}
    </div>
  </div>
);

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status

  // Check login status on mount and changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const handleStorageChange = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const handleToggle = (sectionKey) => {
    setOpenSection(openSection === sectionKey ? null : sectionKey);
  };

  // If user is logged in, don't render the footer
  if (isLoggedIn) {
    return null; // Render nothing
  }

  // Render footer only if not logged in
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4">
        {/* Logo and Columns container */}
        <div className="flex flex-wrap justify-between mb-8">
          {/* Logo - Spans full width on small screens, then takes space */}
          <div className="w-full md:w-1/5 mb-6 md:mb-0 px-4 flex justify-center md:justify-start">
            <img src="/images/logo.png" alt="Thé Tip Top" className="h-12" />
          </div>

          {/* Footer Columns Wrapper - Takes remaining space */}
          <div className="w-full md:w-4/5 flex flex-wrap">
            <FooterSection title="Contact" isOpen={openSection === 'contact'} onToggle={() => handleToggle('contact')}>
              <p>Email: <a href="mailto:contact@thetiptop.com" className="hover:text-teal-600">contact@thetiptop.com</a></p>
              <p>Téléphone: +33 1 23 45 67 89</p>
              <p>Adresse: 10 Rue de Nice, 06000 Nice</p>
            </FooterSection>

            <FooterSection title="Suivez-nous" isOpen={openSection === 'follow'} onToggle={() => handleToggle('follow')}>
              <a href="#" className="flex items-center space-x-2 hover:text-teal-600"><FacebookIcon /><span>Facebook</span></a>
              <a href="#" className="flex items-center space-x-2 hover:text-teal-600"><InstagramIcon /><span>Instagram</span></a>
              <a href="#" className="flex items-center space-x-2 hover:text-teal-600"><TiktokIcon /><span>TikTok</span></a>
            </FooterSection>

            <FooterSection title="Mentions Légales" isOpen={openSection === 'legal'} onToggle={() => handleToggle('legal')}>
              <p><Link to="/cgu" className="hover:text-teal-600">CGU</Link></p>
              <p><Link to="/cgv" className="hover:text-teal-600">CGV</Link></p>
              <p><Link to="/mention" className="hover:text-teal-600">Mentions Légales</Link></p>
              <p><Link to="/politique" className="hover:text-teal-600">Politique de Confidentialité</Link></p>
              <p><Link to="/cookies" className="hover:text-teal-600">Cookies</Link></p>
            </FooterSection>

            <FooterSection title="Navigation" isOpen={openSection === 'nav'} onToggle={() => handleToggle('nav')}>
              <p><Link to="/about" className="hover:text-teal-600">A Propos</Link></p>
              <p><Link to="/game" className="hover:text-teal-600">Espace de jeu</Link></p>
              <p><Link to="/reglement" className="hover:text-teal-600">Règle du jeu</Link></p>
              <p><Link to="/clientDashboard" className="hover:text-teal-600">Espace client</Link></p>
              <p><Link to="/login" className="hover:text-teal-600">Se connecter</Link></p>
              <p><Link to="/contact" className="hover:text-teal-600">Formulaire de contact</Link></p>
            </FooterSection>

            {/* Newsletter might need its own layout adjustment */}
            <FooterSection title="Newsletter" isOpen={openSection === 'newsletter'} onToggle={() => handleToggle('newsletter')}>
               <p className="mb-2">Adhérer à notre newsletter</p>
               <form className="flex flex-col sm:flex-row sm:items-stretch gap-2">
                 <input 
                   type="email" 
                   placeholder="Votre email" 
                   required 
                   className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent flex-grow min-w-0"
                 />
                 <button 
                   type="submit" 
                   className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md transition duration-300 whitespace-nowrap flex-shrink-0"
                 >
                   S&apos;abonner
                 </button>
               </form>
            </FooterSection>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">&copy; 2025 Thé Tip Top - Agence Furious Ducks - Ceci est un site fictif. Projet étudiant</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
