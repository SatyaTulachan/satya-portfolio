import Doodle from './Doodle';
import { FACTS } from '@/data/content';

export default function About() {
  return (
    <section id="about">
      <Doodle name="asteroid" depth={0.3} glow />
      <div className="w about">
        <header className="sec-h" data-reveal>
          <span className="label">01 — About</span>
          <h2>Curious about how things work, and why they break.</h2>
        </header>
        <div className="about-body">
          <div data-reveal>
            <p>
              I’m an IT undergraduate at Techspire College with hands-on full stack experience: React frontends, REST APIs in
              Spring Boot and Flask, and relational databases in MySQL and PostgreSQL. I ship with Docker Compose and GitHub
              Actions, and I’ve kept teams disciplined and united across 20+ group projects.
            </p>
            <p>I’m looking for a full stack developer role where I can own features from UI to database, while I keep growing in cloud deployment.</p>
          </div>
          <dl className="facts" data-reveal>
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="label">{f.label}</dt>
                <dd>{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
