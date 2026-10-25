import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const pages = [
  ["/", "Home", false],
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
        {pages.map(([path, title]) => <Route key={path} path={path} element={<PagePlaceholder title={title} />} />)}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}
