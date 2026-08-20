import { Header } from '@/components/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="kicker mb-4">404</p>
          <h1 className="text-4xl md:text-5xl font-serif text-wine mb-4">This path is still unfolding.</h1>
          <p className="text-text/70 mb-8 font-sans leading-relaxed">
            The page you are looking for doesn't exist. Return home and keep walking with us.
          </p>
          <a href="/" className="btn-wine">
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
