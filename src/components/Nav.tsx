import { NAV } from '@/data/content';

export default function Nav() {
  return (
    <nav aria-label="Primary">
      <a className="logo" href="#hero">
        Satya Tulachan
      </a>
      <div>
        {NAV.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
