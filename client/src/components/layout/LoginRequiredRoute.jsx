import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginRequiredRoute({ children, message = "Sign in to continue." }) {
  const { user, loading, requireAuth } = useAuth();
  if (loading) return <p className="py-16 text-center text-[#786f64]" role="status">Checking your sign-in…</p>;
  if (user) return children;

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-[#eee6da] bg-white px-6 py-16 text-center shadow-sm sm:px-12">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#b9382a]">Gather&amp;Gaze</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-[#302b24]">Sign in to continue</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#786f64]">{message}</p>
      <button className="mt-7 rounded-full bg-[#d94a38] px-6 py-3 text-sm font-bold text-white hover:bg-[#b9382a]" type="button" onClick={() => requireAuth(() => {}, message)}>Sign in</button>
      <Link className="ml-4 text-sm font-semibold text-[#786f64] hover:text-[#b9382a]" to="/">Go home</Link>
    </section>
  );
}
