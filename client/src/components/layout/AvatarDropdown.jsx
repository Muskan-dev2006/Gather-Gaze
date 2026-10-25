import { useState } from "react";

export default function AvatarDropdown({ user, open, setOpen, profileActive, onProfile, onLogout, logoutError }) {
  return (
    <div className="profile-dropdown-wrap">
      <button className="avatar-trigger" type="button" aria-label="Open account menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}><UserAvatar user={user} /></button>
      {open && <div className="profile-dropdown" role="menu">
        <div className="profile-summary"><strong>{user.name}</strong><span>{user.email}</span></div>
        <button className={profileActive ? "is-active" : ""} type="button" role="menuitem" onClick={onProfile}>Profile</button>
        <button type="button" role="menuitem" onClick={onLogout}>Log out</button>
        {logoutError && <p className="navigation-error" role="alert">{logoutError}</p>}
      </div>}
    </div>
  );
}

function UserAvatar({ user }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (user.avatarUrl && !imageFailed) return <img className="user-avatar" src={user.avatarUrl} alt="" onError={() => setImageFailed(true)} />;
  return <span className="user-avatar user-avatar-fallback" aria-hidden="true">{(user.name || user.email || "G").charAt(0).toUpperCase()}</span>;
}
