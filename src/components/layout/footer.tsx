import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between py-6 px-4 md:flex-row md:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} USM Marketplace4U. All rights reserved.
        </p>
        <nav className="mt-4 flex gap-4 sm:gap-6 md:mt-0">
          <Link
            href="#"
            className="text-sm underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm underline-offset-4 hover:underline"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
