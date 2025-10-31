import React from "react";
import "./Footer.css";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="/assets/logo-light.svg" alt="Civic Sentinel" />
          <span>Civic Sentinel</span>
        </div>

        <div className="footer__links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#map">Community Map</a>
          <a href="mailto:support@civicsentinel.app">Support</a>
        </div>

        <div className="footer__fine">
          <span>© {new Date().getFullYear()} Civic Sentinel</span>
          <a href="/privacy">Privacy</a>
<a href="/terms">Terms</a>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
