export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <h1 className="text-4xl font-serif text-wine mb-4">Page not found</h1>
        <p className="text-text/70 mb-8 font-sans">The path you are looking for doesn't exist.</p>
        <a href="/" className="inline-flex items-center justify-center rounded-full bg-wine px-6 py-3 text-sm font-medium text-cream shadow hover:bg-wine/90 transition-colors">
          Return Home
        </a>
      </div>
    </div>
  );
}