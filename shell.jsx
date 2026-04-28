// Mejlis — sidebar + window shell for the web app.
// Branded dark canvas with a glassy sidebar. RTL-aware. Supports a
// "fullscreen game mode" that hides the sidebar so the room sees the board.

const MAC_FONT = '-apple-system, BlinkMacSystemFont, "SF Pro", "Helvetica Neue", sans-serif';

// Sidebar item — dark, with phosphor-style icon + label, RTL-aware
function SidebarItem({ icon, label, sublabel, selected, onClick, dir, badge }) {
  return (
    <button onClick={onClick} dir={dir} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px',
      margin: '0 8px',
      borderRadius: 10,
      background: selected ? 'rgba(233,162,27,0.14)' : 'transparent',
      border: 'none', textAlign: dir === 'rtl' ? 'right' : 'left',
      width: 'calc(100% - 16px)',
      color: selected ? 'var(--accent)' : 'var(--fg-2)',
      cursor: 'pointer',
      transition: 'background 140ms var(--ease-out), color 140ms var(--ease-out)',
      position: 'relative',
    }}
    onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
    onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
      <span style={{ width: 16, height: 16, flexShrink: 0, color: selected ? 'var(--accent)' : 'var(--fg-3)' }}
            dangerouslySetInnerHTML={{ __html: icon }} />
      <span style={{ flex: 1, fontFamily: dir === 'rtl' ? 'var(--font-display)' : MAC_FONT, fontSize: 13, fontWeight: 500, lineHeight: 1.2 }}>
        {label}
      </span>
      {sublabel && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', opacity: 0.7 }}>{sublabel}</span>
      )}
      {badge && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
      )}
    </button>
  );
}

function SidebarSection({ label, dir, children }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div dir={dir} style={{
        padding: dir === 'rtl' ? '4px 20px 6px 12px' : '4px 12px 6px 20px',
        fontFamily: dir === 'rtl' ? 'var(--font-body)' : MAC_FONT,
        fontSize: 10, fontWeight: 600, letterSpacing: dir === 'rtl' ? 0 : '0.08em',
        textTransform: dir === 'rtl' ? 'none' : 'uppercase',
        color: 'var(--fg-3)', opacity: 0.7,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{children}</div>
    </div>
  );
}

// Sidebar — dark frosted, holds traffic lights + nav
function Sidebar({ section, setSection, t, dir, lang, onCreate }) {
  const items = [
    { id: 'home',    icon: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M218.83 103.77 138.83 30.42a16 16 0 0 0-21.66 0L37.17 103.77A16 16 0 0 0 32 115.55V208a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-92.45a16 16 0 0 0-5.17-11.78ZM208 208h-48v-48h-32v48H48v-92.45l80-73.34 80 73.34Z"/></svg>', label: t.home },
    { id: 'packs',   icon: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M223.68 66.15 135.68 18a15.94 15.94 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.92 15.92 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03ZM128 32l80.34 44-29.77 16.3-80.35-44Zm0 88L47.66 76l33.9-18.56 80.34 44Zm88 55.85-80 43.79V133.83l32-17.51v34.7l16-8.76v-34.7l32-17.51Z"/></svg>', label: t.packs, sublabel: PACKS.length },
    { id: 'history', icon: ICON.history, label: t.history },
    { id: 'settings',icon: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="m230.66 90.41-30.31-17.5a59.89 59.89 0 0 0-22.07-22.07l-17.5-30.31a8 8 0 0 0-13.86 8l17.5 30.31a44 44 0 1 1-44.84 0l17.5-30.31a8 8 0 1 0-13.86-8l-17.5 30.31a59.89 59.89 0 0 0-22.07 22.07l-30.31 17.5a8 8 0 0 0 8 13.86l30.31-17.5a44 44 0 1 1 0 44.84l-30.31-17.5a8 8 0 0 0-8 13.86l30.31 17.5a59.89 59.89 0 0 0 22.07 22.07l17.5 30.31a8 8 0 0 0 13.86-8l-17.5-30.31a44 44 0 1 1 44.84 0l-17.5 30.31a8 8 0 0 0 13.86 8l17.5-30.31a59.89 59.89 0 0 0 22.07-22.07l30.31-17.5a8 8 0 0 0-8-13.86Z"/></svg>', label: t.settings },
  ];
  return (
    <div style={{
      width: 240, height: '100%', flexShrink: 0,
      background: 'rgba(11,15,26,0.85)',
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      borderRight: dir === 'rtl' ? 'none' : '0.5px solid rgba(255,255,255,0.08)',
      borderLeft:  dir === 'rtl' ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Brand lockup */}
      <div dir={dir} style={{ padding: '20px 16px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="assets/logo-mark.svg" width="24" height="24" alt="" style={{ filter: 'drop-shadow(0 2px 8px rgba(233,162,27,0.4))' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>
            {t.appName}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            v1.0 · Host
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8 }}>
        <SidebarSection label={t.library} dir={dir}>
          {items.map(it => (
            <SidebarItem key={it.id} dir={dir}
              icon={it.icon} label={it.label} sublabel={it.sublabel}
              selected={section === it.id} onClick={() => setSection(it.id)} />
          ))}
        </SidebarSection>

        <SidebarSection label={t.packs} dir={dir}>
          {PACKS.slice(0, 5).map(p => (
            <SidebarItem key={p.id} dir={dir}
              icon={`<svg viewBox="0 0 256 256" fill="${p.color}"><circle cx="128" cy="128" r="80"/></svg>`}
              label={lang === 'ar' ? p.ar : p.en}
              badge={p.hot} />
          ))}
        </SidebarSection>
      </div>

      {/* Bottom: create pack */}
      <div style={{ padding: 12, borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
        <button onClick={onCreate} dir={dir} style={{
          width: '100%', padding: '10px 12px',
          background: 'rgba(255,255,255,0.04)', color: 'var(--fg-1)',
          border: '1px dashed rgba(245,235,214,0.2)', borderRadius: 10,
          fontFamily: dir === 'rtl' ? 'var(--font-display)' : MAC_FONT,
          fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          cursor: 'pointer',
        }}>
          <span>+</span> {t.create}
        </button>
      </div>
    </div>
  );
}

// Top toolbar within the content area
function Toolbar({ title, subtitle, lang, setLang, dir, right }) {
  return (
    <div dir={dir} style={{
      height: 52, padding: '0 24px',
      display: 'flex', alignItems: 'center', gap: 16,
      borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
      background: 'rgba(11,15,26,0.5)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.2 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 1 }}>{subtitle}</div>
        )}
      </div>
      {right}
      {/* Language toggle */}
      <div style={{ display: 'flex', padding: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 8, gap: 0 }}>
        {['ar', 'en'].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: '4px 10px',
            background: lang === l ? 'rgba(233,162,27,0.2)' : 'transparent',
            color: lang === l ? 'var(--accent)' : 'var(--fg-3)',
            border: 'none', borderRadius: 6,
            fontFamily: l === 'ar' ? 'var(--font-display)' : MAC_FONT,
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>{l === 'ar' ? 'ع' : 'EN'}</button>
        ))}
      </div>
    </div>
  );
}

// The main window frame — content is composed by the app shell
function MejlisWindow({ children, sidebar, fullscreen }) {
  if (fullscreen) {
    return (
      <div style={{
        width: '100%', height: '100%', overflow: 'hidden',
        background: 'var(--bg-canvas)', position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        {children}
      </div>
    );
  }
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      background: 'var(--bg-canvas)',
      display: 'flex',
    }}>
      {sidebar}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, SidebarItem, SidebarSection, Toolbar, MejlisWindow });
