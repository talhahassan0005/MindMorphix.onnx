import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="text-center">
        <div className="mb-4">
          <h1 className="display-1 text-primary fw-bold">404</h1>
          <h2 className="text-light mb-3">Page Not Found</h2>
          <p className="text-muted mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="d-flex justify-content-center gap-3">
          <Link href="/" className="btn btn-primary">
            <i className="bi bi-house me-2"></i>
            Go Home
          </Link>
          <Link href="/Detection" className="btn btn-outline-primary">
            <i className="bi bi-brain me-2"></i>
            Try Detection
          </Link>
        </div>
      </div>
    </div>
  );
}
