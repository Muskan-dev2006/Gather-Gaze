export default function EmptyStateMessage({ message }) {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-3xl border border-[#eee6da] bg-white px-6 py-10 text-center shadow-sm" role="status">
      <p className="max-w-lg text-base leading-7 text-[#786f64]">{message}</p>
    </div>
  );
}
