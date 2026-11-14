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
              I’m an IT undergraduate at Techspire College, spending my time where software engineering, backend systems and AI
              meet. I build REST APIs, design relational databases and ship apps with Docker, Kubernetes and GitHub Actions.
            </p>
            <p>I want to grow into a full stack engineer who designs software that is reliable, scalable and easy to use.</p>
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
