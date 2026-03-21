import { Terminal, Mail } from 'lucide-react';

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const Footer = () => (
  <footer className="bg-slate-900 text-white">
    {/* Main footer content */}
    <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-4 gap-12">
      {/* Brand */}
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-5">
          <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-1.5 rounded-lg">
            <Terminal size={22} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            AMARA<span className="text-brand-secondary">NEXA</span>
          </span>
        </div>
        <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
          Building the next generation of engineers, one school at a time. Professional labs, real incentives, and AI-first education.
        </p>

        {/* Social links */}
        <div className="flex items-center gap-3 mt-8">
          {[
            { icon: <XIcon />, href: '#', label: 'X / Twitter', color: 'hover:bg-slate-700' },
            { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn', color: 'hover:bg-[#0077B5]' },
            { icon: <InstagramIcon />, href: '#', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCB045]' },
          ].map(({ icon, href, label, color }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              title={label}
              className={`w-10 h-10 rounded-xl bg-slate-800 ${color} flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg`}
            >
              {icon}
            </a>
          ))}
          <a
            href="mailto:school@amaranexa.com"
            aria-label="Email us"
            title="Email us"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-brand-primary flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <Mail size={16} />
          </a>
        </div>
      </div>

      {/* Company links */}
      <div>
        <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">Company</h5>
        <ul className="space-y-3.5 text-sm">
          {['About Us', 'Careers', 'Partner Schools', 'Press'].map(label => (
            <li key={label}>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Support links */}
      <div>
        <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">Support</h5>
        <ul className="space-y-3.5 text-sm">
          {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Use'].map(label => (
            <li key={label}>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-xs text-slate-600 uppercase tracking-widest font-medium">
          © 2026 Amara Nexa Technologies. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-500 font-medium">All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
);
