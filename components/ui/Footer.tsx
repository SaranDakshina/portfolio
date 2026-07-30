export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-grey-border)] py-8">
      <div className="container-content flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="label-caps text-[var(--color-grey)]">
          © {year} Saran
        </span>
        <div className="flex items-center gap-6">
          <a
            href="mailto:hello@saran.dev"
            className="label-caps link-underline text-[var(--color-grey)] hover:text-[var(--color-ink)]"
          >
            Email
          </a>
          <a
            href="https://linkedin.com/in/saran"
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps link-underline text-[var(--color-grey)] hover:text-[var(--color-ink)]"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/saran"
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps link-underline text-[var(--color-grey)] hover:text-[var(--color-ink)]"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
