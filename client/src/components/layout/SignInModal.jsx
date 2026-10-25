import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function SignInModal() {
  const { isSignInOpen, signInMessage, closeSignIn, completeSignIn } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSignInOpen) return null;

  async function handleGoogleSuccess(response) {
    if (!response.credential) {
      setError("Google sign-in did not return an ID token. Please try again.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await completeSignIn(response.credential);
    } catch (signInError) {
      setError(signInError.response?.data?.message || "We couldn't sign you in. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSignIn(); }}>
      <section className="modal-card sign-in-modal" role="dialog" aria-modal="true" aria-labelledby="sign-in-heading">
        <button className="modal-close" type="button" aria-label="Close sign-in dialog" onClick={closeSignIn}>×</button>
        <p className="sign-in-eyebrow">A seat at the table</p>
        <h2 id="sign-in-heading">Sign in to Gather&amp;Gaze</h2>
        <p className="sign-in-message">{signInMessage}</p>
        {error && <p className="sign-in-error" role="alert">{error}</p>}
        {!GOOGLE_CLIENT_ID ? <p className="sign-in-error" role="status">Set VITE_GOOGLE_CLIENT_ID in client/.env to enable Google sign-in.</p> : (
          <div className="google-login-wrap">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google sign-in was cancelled. Please try again.")} text="continue_with" shape="pill" theme="outline" />
          </div>
        )}
        {isSubmitting && <p className="sign-in-pending" role="status">Signing you in…</p>}
      </section>
    </div>
  );
}
