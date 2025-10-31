import React from "react";
import NavBar from "../components/Navbar";

import Footer from "../components/Footer";
import "./HomePage.css";



import { Link } from "react-router-dom";
import "./HomePage.css";         // NOT ../styles/HomePage.css




const HomePage = () => {
  return (
    <>
  

      {/* HERO */}
      <section className="hero">
        {/* Optional motion video like civic.com */}
        {/* <video className="hero__bg" autoPlay muted loop playsInline>
          <source src="/assets/hero-loop.mp4" type="video/mp4" />
        </video> */}
        <div className="hero__gradient" />

        <div className="hero__content">
          <h1>
            The future of civic action runs on{" "}
            <span className="txt-gradient">Civic Sentinel</span>
          </h1>
          <p className="hero__tagline">
            Report local issues in seconds. <b>AI classifies</b> the problem, <b>pinpoints</b> the location,
            and <b>drafts</b> a formal complaint—auto-routed to your municipality.
          </p>

          <div className="hero__actions">
            <Link to="/register" className="btn btn--primary">Get started</Link>
            <a href="#features" className="btn btn--ghost">See features</a>
          </div>

          <div className="hero__badges">
            <span> PWA</span>
            <span> Secure</span>
            <span> AI-assisted</span>
            <span> Geo-exact</span>
          </div>
        </div>
      </section>

      {/* LOGOS (optional) */}
      <section className="logos">
        <div className="container">
          <p>Built with modern, trusted tech</p>
          <div className="logos__row">
            <span>React</span><span>Express</span><span>MongoDB</span><span>Cloudinary</span><span>Gemini</span>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="features">
        <div className="container">
          <h2>Auth & workflows, reimagined for cities</h2>
          <p className="section__lead">
            We remove friction at every step so citizens act fast and authorities respond faster.
          </p>

          <div className="grid">
            <div className="card">
              <div className="card__icon">📸</div>
              <h3>Camera-first reporting</h3>
              <p>Open the app, snap a photo, add an optional note, and submit. Done in under 10 seconds.</p>
            </div>
            <div className="card">
              <div className="card__icon">🧠</div>
              <h3>AI issue detection</h3>
              <p>Computer vision classifies issues like potholes, garbage overflow, streetlights, and more.</p>
            </div>
            <div className="card">
              <div className="card__icon">📍</div>
              <h3>Precise geo-location</h3>
              <p>Auto-captures GPS and reverse-geocodes to street level for pinpoint accuracy.</p>
            </div>
            <div className="card">
              <div className="card__icon">✉️</div>
              <h3>Automated complaints</h3>
              <p>Generates a formal, polite complaint email and routes it to the right department.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SPLIT SECTION (like Civic) */}
      <section id="how" className="split">
        <div className="container split__inner">
          <div className="split__copy">
            <h2>From photo to action in under a minute</h2>
            <ul className="steps">
              <li><b>Capture:</b> Snap an issue—pothole, overflow, broken light.</li>
              <li><b>Confirm:</b> AI suggests category + address; you can edit.</li>
              <li><b>Submit:</b> We email the correct municipal office.</li>
              <li><b>Track:</b> Watch status on your dashboard and community map.</li>
            </ul>
            <div className="cta-row">
              <Link to="/dashboard" className="btn btn--primary">Go to Dashboard</Link>
              <a href="#map" className="btn btn--ghost">View Community Map</a>
            </div>
          </div>

          <div className="split__panel">
            {/* decorative image or a small map preview */}
            <div className="panel__card">
              <div className="panel__hdr">Live Example</div>
              <div className="panel__img">
                <img src="/assets/city-grid.png" alt="City grid preview" />
              </div>
              <div className="panel__meta">
        
                <span>⚙️ MERN + AI</span>
                <span>🔔 Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats">
        <div className="container stats__row">
          <div><h3>10s</h3><p>to file a report</p></div>
          <div><h3>5+</h3><p>issue categories</p></div>
          <div><h3>100%</h3><p>GPS accuracy</p></div>
          <div><h3>24/7</h3><p>status tracking</p></div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta__inner">
          <h2>Ready to make your city better?</h2>
          <p>Join your neighbors and turn moments into momentum.</p>
          <div className="cta__actions">
            <Link to="/register" className="btn btn--primary">Create your account</Link>
            <Link to="/login" className="btn btn--ghost">Log in</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
