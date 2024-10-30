import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { push as Menu } from 'react-burger-menu';

const Sidebar = ({ pageWrapId, outerContainerId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStateChange = (state) => {
    setIsMenuOpen(state.isOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="burger-button" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Menu 
        pageWrapId={pageWrapId} 
        outerContainerId={outerContainerId}
        isOpen={isMenuOpen}
        onStateChange={handleStateChange}
        customBurgerIcon={false}
      >
        <Link to="/" className="menu-item" onClick={closeMenu}>Home</Link>
        <Link to="/voicemail" className="menu-item" onClick={closeMenu}>Voicemail Transcriber</Link>
        <Link to="/dashboard" className="menu-item" onClick={closeMenu}>Ticket Dashboard</Link>
        <Link to="/meeting-notes" className="menu-item" onClick={closeMenu}>Meeting Notes</Link>
        <Link to="/printer-lookup" className="menu-item" onClick={closeMenu}>Printer Lookup</Link>
        <div className="menu-footer">
          <p>© 2024 Anne</p>
        </div>
      </Menu>
    </>
  );
};

export default Sidebar;
