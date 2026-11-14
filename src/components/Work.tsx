import Doodle from './Doodle';
import { PROJECTS } from '@/data/content';

export default function Work() {
  return (
    <section id="work">
      <Doodle name="debris" depth={0.25} drift />
      <div className="w">
        <header className="sec-h" data-reveal>
          <span className="label">02 — Work</span>
          <h2>Things I’ve built.</h2>
        </header>
        <ol className="projects">
          {PROJECTS.map((p, i) => (
            <li className="project" key={p.title} data-reveal>
              <span className="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="project-main">
                <span className="label">{p.kind}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
              <div className="project-side">
                <ul className="tags">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="project-links">
                  {p.links.map((l) => (
                    <a key={l.href} className="link" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
