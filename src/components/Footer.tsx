import { Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const devTeam = [
  {
    name: "Lislie Anne T. Rosario",
    role: "Project Manager / Content Specialist",
    img: "https://cdn.phototourl.com/uploads/2026-01-25-6119e10d-ae30-47ac-9646-de23e0cc0368.jpg",
    quote: "Nothing is so strong as gentleness, nothing so gentle as real strength.",
    author: "Saint Francis de Sales",
    fb: "https://www.facebook.com/lislieannet.rosario",
  },
  {
    name: "Samantha Nicole D. Escosio",
    role: "Assistant Project Manager",
    img: "https://cdn.phototourl.com/uploads/2026-01-25-385c322b-e479-41c3-b3ee-55dad8589b7c.jpg",
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    fb: "https://www.facebook.com/samantha.escosio.3",
  },
  {
    name: "Angeli A. Balay-odao",
    role: "Web Strategist",
    img: "https://cdn.phototourl.com/uploads/2026-01-25-5e476c61-880d-4692-8a42-faba04cfd4f3.jpg",
    quote: "A cat that dreams of being a lion must lose its appetite for rats.",
    author: "African Proverb",
    fb: "https://www.facebook.com/angeli.balay.odao.2024",
  },
  {
    name: "Aldrin D. Antonio",
    role: "Support Team",
    img: "https://cdn.phototourl.com/uploads/2026-01-25-d2cf9f82-eff7-4a78-b31d-fa2f7c443eae.jpg",
    quote: "Don't watch the clock; do what it does. Keep going",
    author: "Sam Levenson",
    fb: "https://www.facebook.com/aldrin.antonio.3762",
  },
  {
    name: "Mark Emman A. Lopez",
    role: "Lead Developer",
    img: "https://cdn.phototourl.com/uploads/2026-01-26-c59eb372-a953-4bf7-a1f2-131b30c17e7f.jpg",
    quote: "You are the poem I never knew how to write, and this life is the story I’ve always wanted to tell.",
    author: "Tyler Knott Gregson",
    fb: "https://www.facebook.com/markemman.lopez",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showDev, setShowDev] = useState(false);

  return (
    <>
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif font-bold text-xl mb-4">
                Binmaley Catholic School Inc.
              </h3>
              <p className="text-sm opacity-90">
                Excellence in Catholic Education. Nurturing minds, hearts, and souls.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/programs">Academic Programs</Link></li>
                <li><Link to="/enrollment">Enrollment</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2 items-center"><MapPin size={16} /> Binmaley, Pangasinan, 2417</li>
                <li className="flex gap-2 items-center"><Phone size={16} /> (075) 540-0145</li>
                <li className="flex gap-2 items-center">
                  <Mail size={16} />
                  <a href="mailto:binmaleycs@yahoo.com.ph">binmaleycs@yahoo.com.ph</a>
                </li>
                <li className="flex gap-2 items-center">
                  <Facebook size={16} />
                  <a href="https://www.facebook.com/binmaleycs" target="_blank">Facebook Page</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm">
            <p>© {currentYear} Binmaley Catholic School, Inc. All rights reserved.</p>
            <p className="text-xs mt-1">Powered by Stellaris Collectives</p>

            {/* ADMIN BUTTON — DO NOT TOUCH */}
            <Link
              id="admin-login"
              to="/login"
              className="block mt-3 text-xs opacity-60 hover:opacity-100"
            >
              Admin Login
            </Link>

            <button
              onClick={() => setShowDev(true)}
              className="mt-2 text-xs underline opacity-70 hover:opacity-100"
            >
              Development Team
            </button>
          </div>
        </div>
      </footer>

      {/* DEV TEAM MODAL */}
      {showDev && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowDev(false)}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl bg-slate-900 border border-blue-400/30 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              onClick={() => setShowDev(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold hover:rotate-90 transition"
            >
              ✕
            </button>

            <h2 className="text-center text-3xl font-serif font-bold text-blue-400 mb-10">
              Stellaris Collectives Development Team
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {devTeam.map((dev, i) => (
                <a
                  key={i}
                  href={dev.fb}
                  target="_blank"
                  className="group relative rounded-xl bg-slate-800 p-6 text-center border border-blue-400/30 overflow-hidden"
                >
                  {/* QUOTE OVERLAY */}
                  <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center px-6 opacity-0 group-hover:opacity-100 transition duration-300">
                    <p className="text-blue-200 italic text-sm text-center leading-relaxed">
                      “{dev.quote}”
                    </p>
                    <span className="mt-3 text-xs text-blue-400 tracking-wide">
                      — {dev.author}
                    </span>
                  </div>

                  {/* DEFAULT CONTENT */}
                  <div className="relative z-10 group-hover:opacity-0 transition duration-300">
                    <div className="mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden border-2 border-blue-400">
                      <img src={dev.img} alt={dev.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{dev.name}</h3>
                    <p className="text-sm text-blue-200">{dev.role}</p>
                  </div>
                </a>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-blue-200/70">
              Hover or tap a card to reveal a quote
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
