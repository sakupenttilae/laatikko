import React, { useEffect } from 'react';

const Header = ({ onRender }) => {
  useEffect(() => {
    // Call the onRender callback after the component has mounted
    onRender();
  }, [onRender]);

  return (
    <header style={{backgroundColor: "red", height: "10vh"}}>
        
    </header>
  );
};

export default Header;
