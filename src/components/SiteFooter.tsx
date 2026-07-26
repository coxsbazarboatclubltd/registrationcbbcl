import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, ShieldCheck } from 'lucide-react';
import { CbbcLogo } from './CbbcLogo';

const SITE_URL = 'https://www.coxsbazarboatclubltd.com';

const exploreLinks = [
  { label: 'Home Base', href: `${SITE_URL}/` },
  { label: 'About Our Story', href: `${SITE_URL}/about` },
  { label: 'Facilities Showcase', href: `${SITE_URL}/facilities` },
  { label: 'Board of Directors', href: `${SITE_URL}/board-of-directors` },
  { label: 'Club News Feed', href: `${SITE_URL}/news` },
  { label: 'Affiliations', href: `${SITE_URL}/affiliations` },
];

const membershipTiers = [
  { label: 'Donor Membership', href: `${SITE_URL}/membership/donor` },
  { label: 'Life Membership', href: `${SITE_URL}/membership/life` },
  { label: 'Permanent Membership', href: `${SITE_URL}/membership/permanent` },
  { label: 'Associate Membership', href: `${SITE_URL}/membership/associate` },
];

const socialLinks = [
  { icon: Facebook, href: `${SITE_URL}/`, label: 'Facebook' },
  { icon: Twitter, href: `${SITE_URL}/`, label: 'Twitter' },
  { icon: Linkedin, href: `${SITE_URL}/`, label: 'LinkedIn' },
  { icon: Instagram, href: `${SITE_URL}/`, label: 'Instagram' },
  { icon: Youtube, href: `${SITE_URL}/`, label: 'YouTube' },
];

export const SiteFooter: React.FC = () => {
  return (
    <footer className="no-print bg-[#0f1a30] text-white">
      <div className="max-w-6xl mx-auto px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* COLUMN 1: BRAND + EXPLORE + TIERS */}
        <div>
          <h3 className="font-['Cinzel'] text-lg font-bold tracking-[2px] text-[#c4a56a] uppercase mb-4">
            Cox's Bazar Boat Club
          </h3>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-6 max-w-xs">
            Bangladesh's premier coastal sanctuary and private social club, incorporated as a
            Non-Profit Company under The Companies Act, 1994. Elevating nautical culture and
            oceanfront companionship.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/10 pb-2 mb-2.5">
                Explore the Club
              </h4>
              <ul className="space-y-1.5">
                {exploreLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10.5px] text-gray-300 hover:text-[#c4a56a] transition-colors"
                    >
                      &rarr; {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/10 pb-2 mb-2.5">
                Membership Tiers
              </h4>
              <ul className="space-y-1.5">
                {membershipTiers.map((tier) => (
                  <li key={tier.label}>
                    <a
                      href={tier.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10.5px] text-gray-300 hover:text-[#c4a56a] transition-colors"
                    >
                      &rarr; {tier.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* COLUMN 2: CENTERED SEAL LOGO */}
        <div className="flex items-center justify-center">
          <a href={`${SITE_URL}/`} title="Cox's Bazar Boat Club Ltd. — Home">
            <CbbcLogo clipPathId="clippath-footer" className="w-[170px] h-[170px]" />
          </a>
        </div>

        {/* COLUMN 3: CONTACT REGISTRY */}
        <div className="lg:text-right">
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-4">
            Contact Registry
          </h4>

          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#c4a56a] mb-1">
              Clubspace Secretariat
            </div>
            <div className="text-[11px] text-gray-300">
              Coastal Point Bypass, Marine Drive Boulevard, Cox's Bazar, Bangladesh
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#c4a56a] mb-1">
              Registry Email
            </div>
            <div className="text-[11px] text-gray-300">registry@cbbcl.org, admin@cbbcl.org</div>
          </div>

          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#c4a56a] mb-1">
              Reservation Hotline
            </div>
            <div className="text-[11px] text-gray-300">+880 1711-223344</div>
          </div>

          <div className="flex gap-2 lg:justify-end">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="w-8 h-8 flex items-center justify-center border border-white/15 rounded hover:border-[#c4a56a] hover:text-[#c4a56a] transition-colors text-gray-300"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-gray-500 text-center sm:text-left">
            © 2026 Cox's Bazar Boat Club Limited. All Rights Reserved. Incorporated under The
            Companies Act, 1994, Bangladesh.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`${SITE_URL}/privacy-policy`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-500 hover:text-[#c4a56a] transition-colors uppercase tracking-wider"
            >
              Privacy Policy
            </a>
            <a
              href={`${SITE_URL}/terms-of-service`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-500 hover:text-[#c4a56a] transition-colors uppercase tracking-wider"
            >
              Terms of Service
            </a>
            <span className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              Incorporated Company Limited by Guarantee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
