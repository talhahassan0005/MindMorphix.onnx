// components/Footer.js

export default function Footer() {
    return (
      <footer className="bg-dark text-white py-5 px-3">
        {/* Discord CTA */}
        <div className="text-center mb-5">
          <h4 className="mb-3">Join Our Discord <span>🎧</span></h4>
          <p className="mx-auto" style={{ maxWidth: '600px' }}>
            Dive into our exclusive Discord community tailored for prop trading enthusiasts. 
            Join us to discuss strategies, insights, and connect with fellow traders.
          </p>
          <button className="btn btn-outline-light rounded-pill mt-3">Join our discord</button>
        </div>
  
        {/* Main Footer Grid */}
        <div className="container">
          <div className="row text-start">
  
            {/* Programs */}
            <div className="col-md-3 mb-4">
              <h5>Programs</h5>
              <ul className="list-unstyled">
                <li>Copper 4 phase</li>
                <li>Bronze 3 phase</li>
                <li>Silver 2 phase</li>
                <li>Gold 1 phase</li>
                <li>Diamond</li>
                <li>Competition</li>
                <li>Leaderboard</li>
              </ul>
              <button className="btn btn-outline-light btn-sm rounded-pill mt-2">Free trial</button>
            </div>
  
            {/* About Us */}
            <div className="col-md-3 mb-4">
              <h5>About us</h5>
              <ul className="list-unstyled">
                <li>About us</li>
                <li>FAQ</li>
                <li>Blog</li>
                <li>Symbols</li>
                <li>Affiliate partnership</li>
                <li>MindMorphix manual</li>
                <li>S.Engineer Talha Hassan </li>
              </ul>
            </div>
  
            {/* Legal Info */}
            <div className="col-md-3 mb-4">
              <h5>Legal informations</h5>
              <ul className="list-unstyled">
                <li>Contact</li>
                <li>Cookies</li>
                <li>Risk warning</li>
                <li>Data protection</li>
                <li>Terms and conditions</li>
                <li>Know your customer</li>
                <li>Anti money laundering</li>
              </ul>
            </div>
  
            {/* Trustpilot & Socials */}
            <div className="col-md-3 mb-4">
              <div className="bg-secondary p-3 rounded mb-3">
                <strong className="text-dark ">Trustpilot</strong>
                <p className="mb-0">Excellent 4.9 ★★★★★<br /><small>Based on 922 reviews</small></p>
              </div>
              <div className="d-flex gap-2 mb-2 fs-5">
                <span>📷</span>
                <span>📘</span>
                <span>❌</span>
                <span>▶️</span>
                <span>🎵</span>
                <span>💬</span>
              </div>
              <p>talhafast0005#gmail.com</p>
            </div>
          </div>
        </div>
  
        {/* Bottom Links */}
        <div className="text-center mt-4 border-top pt-3 text-secondary small">
          <a href="#" className="text-secondary me-3">Terms of use</a>
          <a href="#" className="text-secondary">Privacy Policy</a>
          <p className="mt-2">MindMorphix, LLC. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  