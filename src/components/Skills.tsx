import { SKILLS } from '@/data/content';
import Doodle from './Doodle';

export default function Skills() {
  return (
    <section id="skills">
      <Doodle name="crystal" depth={0.5} glow />
      <div className="w">
        <header className="sec-h" data-reveal>
          <span className="label">03 — Skills</span>
          <h2>What I work with.</h2>
        </header>
        <dl className="skills" data-reveal>
          {SKILLS.map((g) => (
            <div key={g.label}>
              <dt className="label">{g.label}</dt>
              <dd>
                {g.items.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
