import { Link } from "react-router-dom";

const features = [
  ["◌", "Goal-led budgets", "Turn monthly limits into clear spending lanes with status, category, and timing in one view."],
  ["▣", "Visual spending rhythm", "Charts and totals make the month easier to scan without digging through raw records."],
  ["✦", "Fast transaction capture", "Add, edit, and review transactions from focused screens that keep you moving."],
];

export default function LandingPage() {
  return (
    <div className="landing-shell">
      <div className="landing-inner">
        <nav className="landing-nav" aria-label="Primary navigation">
          <Link to="/welcome" className="brand-mark text-decoration-none text-white">
            <span className="brand-orb" />
            <span>Payout Pal</span>
          </Link>
          <div className="nav-actions">
            <Link to="/login" className="pp-btn pp-btn-secondary pp-btn-sm">Sign in</Link>
            <Link to="/register" className="pp-btn pp-btn-primary pp-btn-sm">Start free</Link>
          </div>
        </nav>

        <section className="hero">
          <div>
            <span className="eyebrow">Premium personal finance workspace</span>
            <h1>Budget with the calm of a modern finance team.</h1>
            <p className="hero-copy">
              Payout Pal turns everyday budgets into a refined operating system for your money: clean categories,
              focused transaction flows, and visual insight that helps every dollar feel intentional.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="pp-btn pp-btn-primary">Create your workspace →</Link>
              <Link to="/login" className="pp-btn pp-btn-secondary">I already have an account</Link>
            </div>
            <div className="metric-strip" aria-label="Product highlights">
              <div className="metric"><strong>12 mo</strong><span>Monthly planning rhythm</span></div>
              <div className="metric"><strong>3 views</strong><span>Budgets, charts, details</span></div>
              <div className="metric"><strong>24/7</strong><span>Cloud budget access</span></div>
            </div>
          </div>

          <div className="product-card" aria-label="Product preview">
            <div className="product-card-inner">
              <div className="card-topline">
                <div>
                  <span className="pill">Live month</span>
                  <p className="mb-0 mt-2 text-muted">Household operating budget</p>
                </div>
                <strong>May</strong>
              </div>
              <p className="text-muted mb-0">Available plan</p>
              <div className="balance-number">$4,280</div>
              <div className="chart-bars" aria-hidden="true">
                {[42, 72, 50, 88, 64, 38, 92, 58].map((height) => (
                  <span key={height} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="mini-ledger">
                <div className="ledger-row"><span>Food & grocery</span><strong>$640</strong></div>
                <div className="ledger-row"><span>Travel reserve</span><strong>$1,200</strong></div>
                <div className="ledger-row"><span>Subscriptions</span><strong>$86</strong></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="section-light">
        <div className="landing-inner">
          <div className="section-heading">
            <span className="eyebrow text-dark bg-white">Designed for clarity</span>
            <h2>A financial cockpit instead of another generic tracker.</h2>
            <p className="hero-copy text-muted">
              Every screen is structured around quick scanning, decisive action, and a cohesive product feel.
            </p>
          </div>
          <div className="feature-grid">
            {features.map(([icon, title, copy]) => (
              <article className="feature-tile" key={title}>
                <div className="feature-icon">{icon}</div>
                <div>
                  <h3>{title}</h3>
                  <p className="text-muted mb-0">{copy}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="cta-panel">
            <div>
              <span className="pill">Ready when you are</span>
              <h2 className="mt-3 mb-2">Build a calmer budget command center today.</h2>
              <p className="mb-0 text-white-50">Create a workspace, define your categories, and manage transactions with a more polished flow.</p>
            </div>
            <Link to="/register" className="pp-btn pp-btn-primary">Get started</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-inner d-flex justify-content-between flex-wrap gap-3">
          <span>© {new Date().getFullYear()} Payout Pal</span>
          <span>Modern budgeting for clearer decisions.</span>
        </div>
      </footer>
    </div>
  );
}
