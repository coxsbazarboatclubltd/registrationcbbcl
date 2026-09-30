import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CbbcLogo } from './CbbcLogo';

const SITE_URL = 'https://www.cbbcl.org';

interface NavDropdownItem {
  label: string;
  href: string;
}

interface SiteHeaderProps {
  onClearForm: () => void;
}

const membershipItems: NavDropdownItem[] = [
  { label: 'Donor Membership', href: `${SITE_URL}/membership/donor` },
  { label: 'Life Membership', href: `${SITE_URL}/membership/life` },
  { label: 'Permanent Membership', href: `${SITE_URL}/membership/permanent` },
  { label: 'Associate Membership', href: `${SITE_URL}/membership/associate` },
];

const aboutItems: NavDropdownItem[] = [
  { label: 'About Our Story', href: `${SITE_URL}/about` },
  { label: 'Affiliations', href: `${SITE_URL}/affiliations` },
];

const NavDropdown: React.FC<{ label: string; items: NavDropdownItem[] }> = ({ label, items }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white/85 hover:text-[#c4a56a] transition-colors cursor-pointer"
      >
        {label}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 min-w-[180px] bg-[#1a2744] border border-[#c4a56a]/30 rounded shadow-xl py-1 z-50">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/80 hover:text-[#c4a56a] hover:bg-white/5 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export const SiteHeader: React.FC<SiteHeaderProps> = ({ onClearForm }) => {
  return (
    <header className="no-print">
      {/* TOP INFO BAR — mirrors the CBBCL.WEB header topbar */}
      <div className="bg-[#1a2744] py-2 px-6 text-slate-300 font-sans tracking-wide text-[11px] border-b border-[#263a6b] hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span>📍 Anderson Road, Cox's Bazar 4700. Bangladesh.</span>
            <span>📞 +880 13328 86688</span>
          </div>
          <div className="flex items-center space-x-6">
            <span>✉️ registration@cbbcl.org, info@cbbcl.org</span>
            <span>🌐 www.cbbcl.org</span>
          </div>
        </div>
      </div>

      {/* MAIN MARKETING NAVBAR */}
      <nav className="bg-[#1a2744] border-b-2 border-[#c4a56a] px-6 py-3 flex items-center justify-between flex-wrap gap-y-2">
        {/* LEFT NAV GROUP */}
        <div className="hidden lg:flex items-center gap-6">
          <a href={`${SITE_URL}/`} className="text-[11px] font-bold uppercase tracking-wider text-[#c4a56a] border-b-2 border-[#c4a56a] pb-0.5">
            Home
          </a>
          <a
            href={`${SITE_URL}/facilities`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold uppercase tracking-wider text-white/85 hover:text-[#c4a56a] transition-colors"
          >
            Facilities
          </a>
          <NavDropdown label="Membership" items={membershipItems} />
          <a
            href={`${SITE_URL}/board-of-directors`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold uppercase tracking-wider text-white/85 hover:text-[#c4a56a] transition-colors"
          >
            Board of Directors
          </a>
          <a
            href={`${SITE_URL}/club-members`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold uppercase tracking-wider text-white/85 hover:text-[#c4a56a] transition-colors"
          >
            Club Members
          </a>
          <a
            href={`${SITE_URL}/events`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold uppercase tracking-wider text-white/85 hover:text-[#c4a56a] transition-colors"
          >
            Events
          </a>
        </div>

        {/* CENTER LOGO */}
        <a href={`${SITE_URL}/`} className="mx-auto lg:mx-0" title="Cox's Bazar Boat Club Ltd. — Home">
          <CbbcLogo clipPathId="clippath-nav" className="w-[46px] h-[46px]" />
        </a>

        {/* RIGHT NAV GROUP */}
        <div className="hidden lg:flex items-center gap-6">
          <a
            href={`${SITE_URL}/news`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold uppercase tracking-wider text-white/85 hover:text-[#c4a56a] transition-colors"
          >
            News Feed
          </a>
          <a
            href={`${SITE_URL}/affiliations`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold uppercase tracking-wider text-white/85 hover:text-[#c4a56a] transition-colors"
          >
            Affiliations
          </a>
          <a
            href={`${SITE_URL}/contact`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold uppercase tracking-wider text-white/85 hover:text-[#c4a56a] transition-colors"
          >
            Contact
          </a>
          <NavDropdown label="About" items={aboutItems} />
        </div>
      </nav>

      {/* UTILITY STRIP — form dev/testing controls */}
      <div className="bg-[#1a2744] border-b-2 border-[#c4a56a] px-6 py-1.5 flex items-center justify-between flex-wrap gap-2">
        <div className="text-left">
          <span className="text-[7px] text-gray-400 tracking-[1.5px] uppercase block sm:inline sm:mr-2">
            Established 2026
          </span>
          <span className="font-['Cinzel'] text-[11px] font-bold text-[#c4a56a] tracking-[1px]">
            COX'S BAZAR BOAT CLUB — Member Registration Portal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClearForm}
            className="text-[9px] uppercase tracking-wider text-gray-400 hover:text-white underline transition-colors cursor-pointer"
            title="Reset form fields"
          >
            Clear Form
          </button>
          <span className="text-[9px] uppercase tracking-wider text-gray-500">Member Portal</span>
        </div>
      </div>
    </header>
  );
};
