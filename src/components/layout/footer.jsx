import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "@/components/layout/navbar";
function Footer() {
  return <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              RoomSathi helps students find verified rooms, PGs and compatible roommates near their
              college — with zero brokerage.
            </p>
            <div className="flex gap-2">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => <span
    key={i}
    className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
  >
                  <Icon className="h-4 w-4" />
                </span>)}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/rooms" className="hover:text-primary">
                  Find Rooms
                </Link>
              </li>
              <li>
                <Link to="/roommates" className="hover:text-primary">
                  Find Roommates
                </Link>
              </li>
              <li>
                <Link to="/expenses" className="hover:text-primary">
                  Expense Calculator
                </Link>
              </li>
              <li>
                <Link to="/owner-register" className="hover:text-primary">
                  Become an Owner
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/owner" className="hover:text-primary">
                  Owner Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Get in touch</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> roomsathiadmin@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> +91 8962859858
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Indore, Madhya pradesh
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {(/* @__PURE__ */ new Date()).getFullYear()} RoomSathi. All rights reserved.</p>
          <p>Built for students, by students.</p>
        </div>
      </div>
    </footer>;
}
export {
  Footer
};
