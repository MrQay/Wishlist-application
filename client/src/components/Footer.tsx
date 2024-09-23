import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import giftImage from '../images/gift.png';

interface SocialLinkProps {
  href: string;
  icon: IconDefinition;
  ariaLabel: string;
}

// Component for rendering social media links
const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, ariaLabel }) => (
  <li><a href={href} aria-label={ariaLabel}><FontAwesomeIcon icon={icon} /></a></li>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="container relative">
        <div className="sofa-img">
          <img src={giftImage} alt="Gift" className="img-fluid" />
        </div>
        <div className="row">
          <div className="col-lg-4">
            <div className="mb-4 footer-logo-wrap">
              <a href="/" className="footer-logo">Gift Genie <span>.</span></a>
            </div>
            <p className="mb-4">Gift Genie is your go-to source for creating, managing, and sharing personalized wish lists for every occasion.</p>
            <ul className="list-unstyled custom-social">
              {/* Rendering social media links with aria-labels for better accessibility */}
              <SocialLink href="https://facebook.com" icon={faFacebookF} ariaLabel="Facebook" />
              <SocialLink href="https://twitter.com" icon={faTwitter} ariaLabel="Twitter" />
              <SocialLink href="https://instagram.com" icon={faInstagram} ariaLabel="Instagram" />
              <SocialLink href="https://linkedin.com" icon={faLinkedin} ariaLabel="LinkedIn" />
            </ul>
          </div>
        </div>
        <div className="border-top copyright">
          <div className="row pt-4">
            <div className="col-lg-6">
              {/* Update current year dynamically */}
              <p className="mb-2 text-center text-lg-start">Copyright &copy; {currentYear}. All Rights Reserved. — Gift Genie</p>
            </div>
            <div className="col-lg-6 text-center text-lg-end">
              <ul className="list-unstyled d-inline-flex ms-auto">
                <li className="me-4"><a href="/">Terms & Conditions</a></li>
                <li><a href="/">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
