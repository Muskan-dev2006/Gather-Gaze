import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return <section className="empty-state"><h1>We couldn't find that page</h1><p>It may have moved, or the link might be mistyped.</p><Link className="button-primary" to="/">Back to home</Link></section>;
}
