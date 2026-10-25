import { NavLink } from "react-router-dom";

export default function MobileNavigationMenu({ user, location, protectedLinks, onNavigate, onHome, onSignIn, onLogout, logoutError }) {
  return (
    <nav className="mobile-menu-panel" aria-label="Mobile navigation">
      <NavLink to="/" end className={({ isActive }) => navigationClass(isActive)} onClick={onHome}>Home</NavLink>
      <button className="mobile-add-link" type="button" onClick={() => onNavigate("/create", "Sign in to add your recipe")}><PlusIcon />Add recipe</button>
      {protectedLinks.map((item) => <button key={item.path} className={navigationClass(location.pathname === item.path)} type="button" onClick={() => onNavigate(item.path, item.message)}>{item.icon === "bookmark" && <BookmarkIcon />}{item.label}</button>)}
      <button className={navigationClass(location.pathname === "/me/profile")} type="button" onClick={() => onNavigate("/me/profile", "Sign in to view your profile")}>Profile</button>
      {user ? <button className="mobile-account-action" type="button" onClick={onLogout}>Log out</button> : <button className="mobile-account-action" type="button" onClick={onSignIn}>Sign in</button>}
      {logoutError && <p className="navigation-error" role="alert">{logoutError}</p>}
    </nav>
  );
}

function navigationClass(isActive) {
  return `navigation-link${isActive ? " is-active" : ""}`;
}

function PlusIcon() {
  return <svg className="navigation-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}

function BookmarkIcon() {
  return <svg className="navigation-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z" /></svg>;
}
