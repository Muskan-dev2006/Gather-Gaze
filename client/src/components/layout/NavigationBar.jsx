import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import AvatarDropdown from "./AvatarDropdown.jsx";
import MobileNavigationMenu from "./MobileNavigationMenu.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getNotifications } from "../../api/activity.api.js";
import { searchRecipes } from "../../api/browse.api.js";
import useDebounce from "../../hooks/useDebounce.js";

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
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue.trim(), 250);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;
    if (debouncedSearchValue.length < 2) {
      setSuggestions([]);
      setIsSuggestionLoading(false);
      return () => { active = false; };
    }
    setIsSuggestionLoading(true);
    searchRecipes(debouncedSearchValue)
      .then((result) => { if (active) setSuggestions((result.items || []).slice(0, 5)); })
      .catch(() => { if (active) setSuggestions([]); })
      .finally(() => { if (active) setIsSuggestionLoading(false); });
    return () => { active = false; };
  }, [debouncedSearchValue]);

  useEffect(() => {
    let active = true;
    if (!user) { setUnreadCount(0); return () => { active = false; }; }
    async function refresh() {
      try { const data = await getNotifications(); if (active) setUnreadCount(data.unreadCount || 0); } catch { /* Keep the navigation usable during network errors. */ }
    }
    refresh();
    const timer = window.setInterval(refresh, 60000);
    return () => { active = false; window.clearInterval(timer); };
  }, [user]);

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
        setSuggestionsOpen(false);
      } else if (!event.target.closest(".search-autocomplete")) {
        setSuggestionsOpen(false);
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
    setSuggestionsOpen(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  }

  function openRecipeSuggestion(recipe) {
    navigate(`/recipes/${recipe.slug}`);
    setSearchValue("");
    setSuggestionsOpen(false);
    setMobileSearchOpen(false);
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
          <RecipeSearchForm id="desktop-site-search" className={`navigation-search${isSearchActive ? " is-active" : ""}`} searchValue={searchValue} setSearchValue={setSearchValue} onSubmit={search} onPick={openRecipeSuggestion} suggestions={suggestions} suggestionsOpen={suggestionsOpen} setSuggestionsOpen={setSuggestionsOpen} isLoading={isSuggestionLoading} />
          <button className="navigation-add-button" type="button" onClick={() => goToProtectedPage("/create", "Sign in to add your recipe")}><PlusIcon />Add recipe</button>
          {PROTECTED_LINKS.map((item) => <ProtectedNavButton key={item.path} item={item} location={location} onSelect={goToProtectedPage} />)}
          <NotificationButton count={unreadCount} active={location.pathname === "/notifications"} onClick={() => goToProtectedPage("/notifications", "Sign in to view notifications")} />
        </nav>

        <div className="navigation-actions">
          <button className="mobile-icon-button mobile-search-toggle" type="button" aria-label={mobileSearchOpen ? "Close search" : "Open search"} aria-expanded={mobileSearchOpen} onClick={() => { setMobileSearchOpen((open) => !open); setMobileMenuOpen(false); }}><SearchIcon /></button>
          <span className="mobile-notification"><NotificationButton count={unreadCount} active={location.pathname === "/notifications"} onClick={() => goToProtectedPage("/notifications", "Sign in to view notifications")} /></span>
          {!user ? <button className="navigation-sign-in" type="button" onClick={() => openSignIn("Sign in to your account")}>Sign in</button> : <AvatarDropdown user={user} open={profileMenuOpen} setOpen={setProfileMenuOpen} profileActive={location.pathname === "/me/profile"} onProfile={() => goToProtectedPage("/me/profile", "Sign in to view your profile")} onLogout={handleLogout} logoutError={logoutError} />}
          <button className="mobile-icon-button mobile-menu-toggle" type="button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => { setMobileMenuOpen((open) => !open); setMobileSearchOpen(false); }}><MenuIcon open={mobileMenuOpen} /></button>
        </div>
      </div>

      {mobileSearchOpen && <RecipeSearchForm id="mobile-site-search" className="mobile-search-form" autoFocus searchValue={searchValue} setSearchValue={setSearchValue} onSubmit={search} onPick={openRecipeSuggestion} suggestions={suggestions} suggestionsOpen={suggestionsOpen} setSuggestionsOpen={setSuggestionsOpen} isLoading={isSuggestionLoading} />}
      {mobileMenuOpen && <MobileNavigationMenu user={user} location={location} protectedLinks={PROTECTED_LINKS} onNavigate={goToProtectedPage} onHome={() => setMobileMenuOpen(false)} onSignIn={() => openSignIn("Sign in to your account")} onLogout={handleLogout} logoutError={logoutError} />}
    </header>
  );
}

function RecipeSearchForm({ id, className, autoFocus = false, searchValue, setSearchValue, onSubmit, onPick, suggestions, suggestionsOpen, setSuggestionsOpen, isLoading }) {
  const showSuggestions = suggestionsOpen && searchValue.trim().length >= 2;
  return (
    <form className={`${className} search-autocomplete`} role="search" onSubmit={onSubmit} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSuggestionsOpen(false); }}>
      <SearchIcon />
      <label className="visually-hidden" htmlFor={id}>Search recipes</label>
      <input id={id} autoFocus={autoFocus} role="combobox" aria-autocomplete="list" aria-expanded={showSuggestions} aria-controls={`${id}-suggestions`} value={searchValue} onFocus={() => setSuggestionsOpen(true)} onChange={(event) => { setSearchValue(event.target.value); setSuggestionsOpen(true); }} onKeyDown={(event) => { if (event.key === "Escape") setSuggestionsOpen(false); }} placeholder={SEARCH_PLACEHOLDER} />
      {showSuggestions && <div className="search-suggestions" id={`${id}-suggestions`} role="listbox" aria-label="Recipe suggestions">
        {isLoading ? <p className="search-suggestion-message" role="status">Searching recipes…</p> : suggestions.length ? suggestions.map((recipe) => <button className="search-suggestion" key={recipe._id} type="button" role="option" aria-selected="false" onMouseDown={(event) => event.preventDefault()} onClick={() => onPick(recipe)}><span className="search-suggestion-title">{recipe.title}</span><span className="search-suggestion-meta">{recipe.cuisine} · {recipe.difficulty}</span></button>) : <p className="search-suggestion-message">No matching recipes</p>}
      </div>}
    </form>
  );
}

function ProtectedNavButton({ item, location, onSelect }) {
  return <button className={navItemClass(location.pathname === item.path)} type="button" onClick={() => onSelect(item.path, item.message)}>{item.icon && <BookmarkIcon />}{item.label}</button>;
}

function NotificationButton({ active, count, onClick }) {
  return <button className={`notification-button${active ? " is-active" : ""}`} type="button" aria-label={count ? `Notifications, ${count} unread` : "Notifications"} onClick={onClick}><BellIcon />{count > 0 && <span className="notification-unread-count" aria-hidden="true">{count > 99 ? "99+" : count}</span>}</button>;
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
