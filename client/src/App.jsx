import { Route, Routes, useLocation } from "react-router-dom";
import NavigationBar from "./components/layout/NavigationBar.jsx";
import LoginRequiredRoute from "./components/layout/LoginRequiredRoute.jsx";
import PageFooter from "./components/layout/PageFooter.jsx";
import SignInModal from "./components/layout/SignInModal.jsx";
import CreateRecipePage from "./pages/CreateRecipePage.jsx";
import EditRecipePage from "./pages/EditRecipePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.jsx";
import SavedRecipesPage from "./pages/SavedRecipesPage.jsx";
import MyRecipesPage from "./pages/MyRecipesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RecipeCardGrid from "./components/recipe/RecipeCardGrid.jsx";

const PLACEHOLDER_PAGES = [
  ["/search", "Search recipes"],
  ["/notifications", "Notifications"],
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
          <Route path="/create" element={<LoginRequiredRoute message="Sign in to add your recipe."><CreateRecipePage /></LoginRequiredRoute>} />
          <Route path="/recipes/new" element={<LoginRequiredRoute message="Sign in to add your recipe."><CreateRecipePage /></LoginRequiredRoute>} />
          <Route path="/recipes/:slug/edit" element={<LoginRequiredRoute message="Sign in to edit your recipe."><EditRecipePage /></LoginRequiredRoute>} />
          <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
          <Route path="/saved" element={<LoginRequiredRoute message="Sign in to see your saved recipes."><SavedRecipesPage RecipeCardGrid={RecipeCardGrid} /></LoginRequiredRoute>} />
          <Route path="/me/saved" element={<LoginRequiredRoute message="Sign in to see your saved recipes."><SavedRecipesPage RecipeCardGrid={RecipeCardGrid} /></LoginRequiredRoute>} />
          <Route path="/my/recipes" element={<LoginRequiredRoute message="Sign in to see your recipes."><MyRecipesPage RecipeCardGrid={RecipeCardGrid} /></LoginRequiredRoute>} />
          <Route path="/me/recipes" element={<LoginRequiredRoute message="Sign in to see your recipes."><MyRecipesPage RecipeCardGrid={RecipeCardGrid} /></LoginRequiredRoute>} />
          <Route path="/profile" element={<LoginRequiredRoute message="Sign in to view your profile."><ProfilePage RecipeCardGrid={RecipeCardGrid} /></LoginRequiredRoute>} />
          <Route path="/me/profile" element={<LoginRequiredRoute message="Sign in to view your profile."><ProfilePage RecipeCardGrid={RecipeCardGrid} /></LoginRequiredRoute>} />
          {PLACEHOLDER_PAGES.map(([path, title]) => <Route key={path} path={path} element={<PagePlaceholder title={title} />} />)}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {location.pathname !== "/" && <PageFooter />}
      <SignInModal />
    </div>
  );
}
