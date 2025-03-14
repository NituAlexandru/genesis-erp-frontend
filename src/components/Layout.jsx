export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar poate fi aici */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
