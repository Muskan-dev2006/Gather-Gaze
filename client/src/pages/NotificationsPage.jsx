import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markNotificationsRead } from "../api/activity.api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function NotificationsPage() {
  const { notificationSocket } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const result = await getNotifications();
      setItems((current) => mergeNotifications(current, result.notifications || []));
      setError("");
    } catch {
      setError("Couldn't load notifications. Please try again.");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!notificationSocket) return undefined;
    function receiveNotification(event) {
      if (!event?.notification) return;
      setItems((current) => mergeNotifications(current, [event.notification]));
      setError("");
    }
    notificationSocket.on("notification:new", receiveNotification);
    return () => notificationSocket.off("notification:new", receiveNotification);
  }, [notificationSocket]);

  async function markAllRead() {
    await markNotificationsRead();
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
  }
  async function openNotification(item) {
    if (!item.isRead) {
      await markNotificationsRead(item._id);
      setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, isRead: true } : entry));
    }
  }

  return <section className="notifications-page">
    <header className="notifications-heading"><div><p className="eyebrow">Your kitchen community</p><h1>Notifications</h1></div>
      {items.some((item) => !item.isRead) && <button type="button" onClick={markAllRead}>Mark all as read</button>}
    </header>
    {loading ? <p className="notifications-message">Loading notifications…</p> : error ? <div className="notifications-message" role="alert">{error}<button type="button" onClick={load}>Try again</button></div> : items.length === 0 ? <div className="empty-state"><h2>You're all caught up</h2><p>New followers, likes, and reviews on your recipes will show up here.</p></div> :
      <div className="notifications-list">{items.map((item) => {
        const actor = item.actorId?.name || "Someone";
        const recipe = item.recipeId;
        const message = item.type === "review" ? "left a review on" : item.type === "follow" ? "started following you" : "liked";
        return <article key={item._id} className={`notification-item${item.isRead ? "" : " is-unread"}`}>
          <span className="notification-avatar">{actor.charAt(0).toUpperCase()}</span>
          <div className="notification-copy"><p><strong>{actor}</strong> {message} <strong>{recipe?.title || "your recipe"}</strong></p><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time></div>
          {recipe?.slug ? <Link className="notification-open" to={`/recipes/${recipe.slug}`} aria-label={`Open ${recipe.title}`} onClick={() => openNotification(item)}>View</Link> : <button className="notification-open" onClick={() => openNotification(item)}>Mark read</button>}
        </article>;
      })}</div>}
  </section>;
}

function mergeNotifications(current, incoming) {
  const byId = new Map(current.map((item) => [String(item._id), item]));
  for (const item of incoming) byId.set(String(item._id), { ...byId.get(String(item._id)), ...item });
  return [...byId.values()].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt)).slice(0, 50);
}
