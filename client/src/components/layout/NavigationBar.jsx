import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import AvatarDropdown from "./AvatarDropdown.jsx";
import MobileNavigationMenu from "./MobileNavigationMenu.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const SEARCH_PLACEHOLDER = "Search dishes, ingredients, cuisines";
const PROTECTED_LINKS = [
  { label: "My recipes", path: "/me/recipes", message: "Sign in to see your recipes" },
  { label: "Saved", path: "/me/saved", message: "Sign in to see your saved recipes", icon: "bookmark" },
];

export default function NavigationBar() {
  const { user, requireAuth, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    function updateScrollState() {
      setIsScrolled(window.scrollY > 4);
    }
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!headerRef.current?.contains(event.target)) {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
      }
    }
    function closeOnEscape(event) {
      if (event.key !== "Escape") return;
      setMobileMenuOpen(false);
      setProfileMenuOpen(false);
      setMobileSearchOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function search(event) {
    event.preventDefault();
    const query = searchValue.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  }

  function goToProtectedPage(path, message) {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    requireAuth(() => navigate(path), message);
  }

  function openSignIn(message = "Sign in to continue") {
    setMobileMenuOpen(false);
    requireAuth(() => {}, message);
  }

  async function handleLogout() {
    setLogoutError("");
    try {
      await logout();
      setProfileMenuOpen(false);
      setMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      setLogoutError(error.response?.data?.message || "Couldn't sign out. Please try again.");
    }
  }

  const isSearchActive = location.pathname === "/search";

  return (
    <header ref={headerRef} className={`app-header${isScrolled ? " is-scrolled" : ""}`}>
      <div className="navigation-bar">
        <Link className="navigation-brand" to="/" aria-label="Gather and Gaze home">
          <ForkKnifeMark /><span>Gather<span className="brand-accent">&amp;</span>Gaze</span>
        </Link>

        <nav className="desktop-navigation" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => navItemClass(isActive)}>Home</NavLink>
          <form className={`navigation-search${isSearchActive ? " is-active" : ""}`} role="search" onSubmit={search}>
            <SearchIcon />
            <label className="visually-hidden" htmlFor="desktop-site-search">Search recipes</label>
            <input id="desktop-site-search" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder={SEARCH_PLACEHOLDER} />
          </form>
          <button className="navigation-add-button" type="button" onClick={() => goToProtectedPage("/create", "Sign in to add your recipe")}><PlusIcon />Add recipe</button>
          {PROTECTED_LINKS.map((item) => <ProtectedNavButton key={item.path} item={item} location={location} onSelect={goToProtectedPage} />)}
          <NotificationButton active={location.pathname === "/notifications"} onClick={() => goToProtectedPage("/notifications", "Sign in to view notifications")} />
        </nav>

        <div className="navigation-actions">
          <button className="mobile-icon-button mobile-search-toggle" type="button" aria-label={mobileSearchOpen ? "Close search" : "Open search"} aria-expanded={mobileSearchOpen} onClick={() => { setMobileSearchOpen((open) => !open); setMobileMenuOpen(false); }}><SearchIcon /></button>
          <span className="mobile-notification"><NotificationButton active={location.pathname === "/notifications"} onClick={() => goToProtectedPage("/notifications", "Sign in to view notifications")} /></span>
          {!user ? <button className="navigation-sign-in" type="button" onClick={() => openSignIn("Sign in to your account")}>Sign in</button> : <AvatarDropdown user={user} open={profileMenuOpen} setOpen={setProfileMenuOpen} profileActive={location.pathname === "/me/profile"} onProfile={() => goToProtectedPage("/me/profile", "Sign in to view your profile")} onLogout={handleLogout} logoutError={logoutError} />}
          <button className="mobile-icon-button mobile-menu-toggle" type="button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => { setMobileMenuOpen((open) => !open); setMobileSearchOpen(false); }}><MenuIcon open={mobileMenuOpen} /></button>
        </div>
      </div>

      {mobileSearchOpen && <form className="mobile-search-form" role="search" onSubmit={search}><SearchIcon /><label className="visually-hidden" htmlFor="mobile-site-search">Search recipes</label><input id="mobile-site-search" autoFocus value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder={SEARCH_PLACEHOLDER} /></form>}
      {mobileMenuOpen && <MobileNavigationMenu user={user} location={location} protectedLinks={PROTECTED_LINKS} onNavigate={goToProtectedPage} onHome={() => setMobileMenuOpen(false)} onSignIn={() => openSignIn("Sign in to your account")} onLogout={handleLogout} logoutError={logoutError} />}
    </header>
  );
}

function ProtectedNavButton({ item, location, onSelect }) {
  return <button className={navItemClass(location.pathname === item.path)} type="button" onClick={() => onSelect(item.path, item.message)}>{item.icon && <BookmarkIcon />}{item.label}</button>;
}

function NotificationButton({ active, onClick }) {
  return <button className={`notification-button${active ? " is-active" : ""}`} type="button" aria-label="Notifications, unread items" onClick={onClick}><BellIcon /><span className="notification-unread-dot" aria-hidden="true" /></button>;
}

function navItemClass(isActive) {
  return `navigation-link${isActive ? " is-active" : ""}`;
}

function ForkKnifeMark() {
  return <svg className="brand-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3v6m3-6v6M7.5 3v18M17 3c-2.3 3-3 6-3 9h4v9m-1-18v18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SearchIcon() {
  return <svg className="navigation-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>;
}

function PlusIcon() {
  return <svg className="navigation-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}

function BookmarkIcon() {
  return <svg className="navigation-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z" /></svg>;
}

function BellIcon() {
  return <svg className="navigation-icon bell-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></svg>;
}

function MenuIcon({ open }) {
  return <svg className="navigation-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">{open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>;
}
