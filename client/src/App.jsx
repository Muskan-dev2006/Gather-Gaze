import { Route, Routes, useLocation } from "react-router-dom";
import NavigationBar from "./components/layout/NavigationBar.jsx";
import PageFooter from "./components/layout/PageFooter.jsx";
import SignInModal from "./components/layout/SignInModal.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const PLACEHOLDER_PAGES = [
  ["/search", "Search recipes"],
  ["/recipes/:slug", "Recipe details"],
  ["/recipes/new", "Create a recipe"],
  ["/recipes/:id/edit", "Edit a recipe"],
  ["/create", "Create a recipe"],
  ["/my/recipes", "My recipes"],
  ["/me/recipes", "My recipes"],
  ["/saved", "Saved recipes"],
  ["/me/saved", "Saved recipes"],
  ["/notifications", "Notifications"],
  ["/profile", "Your profile"],
  ["/me/profile", "Your profile"],
];

function PagePlaceholder({ title }) {
  return <section className="empty-state"><h1>{title}</h1><p>This part of the recipe community is coming together.</p></section>;
}

export default function App() {
  const location = useLocation();
  return (
    <div className="app-shell">
      <NavigationBar />
      <main className="page-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {PLACEHOLDER_PAGES.map(([path, title]) => <Route key={path} path={path} element={<PagePlaceholder title={title} />} />)}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {location.pathname !== "/" && <PageFooter />}
      <SignInModal />
    </div>
  );
}
