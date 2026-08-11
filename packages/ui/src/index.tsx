import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: "linear-gradient(145deg, #1EC8A5, #0F8F78 55%, #141C2B)",
        display: "grid",
        placeItems: "center",
        boxShadow: "0 10px 28px rgba(30,200,165,0.35)",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        color: "#04110d",
        fontSize: size * 0.42,
      }}
      aria-hidden
    >
      O
    </div>
  );
}

export function BrandLockup({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
      <BrandMark />
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.35rem", lineHeight: 1 }}>
          Opero
        </div>
        {subtitle ? (
          <div style={{ color: "var(--opero-muted)", fontSize: "0.78rem", marginTop: 2 }}>
            Business operations Enterprise
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  children: ReactNode;
}) {
  return (
    <button className={`opero-btn opero-btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="opero-input" {...props} />;
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`opero-panel ${className}`}>{children}</div>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="opero-badge">{children}</span>;
}
