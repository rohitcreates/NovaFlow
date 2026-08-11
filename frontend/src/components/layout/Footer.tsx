export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <p className="text-sm font-medium">
          NovaFlow
        </p>

        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} NovaFlow
        </p>
      </div>
    </footer>
  );
}