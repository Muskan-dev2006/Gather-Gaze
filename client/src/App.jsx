import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import HomePage from "./pages/HomePage.jsx";

const pages = [
  ["/search", "Search recipes", false],
  ["/recipes/:slug", "Recipe details", false],
  ["/recipes/new", "Create a recipe", true],
  ["/recipes/:id/edit", "Edit a recipe", true],
  ["/my/recipes", "My recipes", true],
  ["/saved", "Saved recipes", true],
  ["/notifications", "Notifications", true],
  ["/profile", "Your profile", true],
];

function PagePlaceholder({ title }) {
  return <section className="empty-state"><h1>{title}</h1><p>This part of the recipe community is coming together.</p></section>;
}

export default function App() {
  return (
    <main className="page-main bg-cream">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {pages.map(([path, title]) => <Route key={path} path={path} element={<PagePlaceholder title={title} />} />)}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}
