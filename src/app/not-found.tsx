import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        The page or resource you're looking for doesn't exist.
      </p>
      <Link href="/" className="underline">
        Back home
      </Link>
    </div>
  );
}
