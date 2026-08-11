"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BrandLockup, Button, Badge } from "@opero/ui";
import { OPERO_FEATURES } from "@opero/types";
import Link from "next/link";

const HeroScene = dynamic(() => import("../components/HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <div className="canvas-wrap" />,
});

const userUrl = process.env.NEXT_PUBLIC_USER_APP_URL || "http://localhost:3001";
const adminUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL || "http://localhost:3002";

export default function HomePage() {
  return (
    <div className="shell">
      <div className="noise" />
      <header className="hero">
        <nav className="nav">
          <BrandLockup />
          <div className="nav-links">
            <span style={{ color: "var(--opero-muted)", fontSize: "0.9rem" }}>Realtime ops for modern companies</span>
            <Link href="/auth">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/auth?mode=register">
              <Button>Get Opero</Button>
            </Link>
          </div>
        </nav>

        <div className="hero-stage">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Badge>Enterprise workspace</Badge>
              <h1 className="brand-hero">Opero</h1>
              <p className="tagline">Business operations Enterprise</p>
              <p className="lead">
                One secure fabric for team messages, live calls, project delivery, and data platforms —
                Power BI, Snowflake, Dataflake, and big-data pipelines — built for work.
              </p>
              <div className="cta-row">
                <Link href="/auth?mode=register">
                  <Button>Start collaborating</Button>
                </Link>
                <a href={userUrl}>
                  <Button variant="ghost">Open user app</Button>
                </a>
                <a href={adminUrl}>
                  <Button variant="ghost">Admin console</Button>
                </a>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <HeroScene />
          </motion.div>
        </div>
      </header>

      <section className="section">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Built for the full operating stack
        </motion.h2>
        <p className="sub">
          Messaging and meetings stay in sync with projects, analytics connectors, compliance, and automation —
          across web, iOS, and Android.
        </p>
        <div className="feature-grid">
          {OPERO_FEATURES.map((f) => (
            <div className="feature-item" key={f.key}>
              <h3>{f.label}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
