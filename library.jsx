// Mejlis — Library screens (Home, Packs, History, Settings)
const { useState: lUS, useEffect: lUE } = React;

function HomeScreen({ t, dir, lang, onStart, setSection, tweaks }) {
  const featured = PACKS[0];
  return (
    <div dir={dir} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
      <div className="zellige-bg" style={{ opacity: tweaks.patternIntensity / 100 * 0.08 }} />
      <div style={{ position: 'relative', padding: '40px 48px 48px', maxWidth: 1100 }}>
        {/* Welcome */}
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          {t.welcomeHost} · {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: lang === 'ar' ? 64 : 56, lineHeight: 1.0, letterSpacing: '-0.02em',
          maxWidth: 720,
        }}>
          {t.twoTeams}
        </h1>
        <p style={{ fontSize: 17, color: 'var(--fg-2)', marginTop: 14, maxWidth: 520, lineHeight: 1.5 }}>
          {t.welcomeSub}
        </p>

        {/* Featured pack — large hero card */}
        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <div className="card fade-in" style={{
            padding: 32, background: 'linear-gradient(135deg, rgba(233,162,27,0.18) 0%, rgba(211,63,92,0.14) 100%)',
            border: '1px solid rgba(246,196,83,0.35)',
            borderRadius: 24,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none',
              backgroundImage: "url('assets/pattern-zellige.svg')", backgroundSize: 180,
            }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 240 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>● {lang === 'ar' ? 'مختار الليلة' : 'Tonight\'s pick'}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 38, lineHeight: 1.05, marginTop: 16, letterSpacing: '-0.02em' }}>
                {lang === 'ar' ? featured.ar : featured.en}
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-2)', marginTop: 8, maxWidth: 380 }}>
                {lang === 'ar' ? featured.desc_ar : featured.desc_en}
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
                <button className="btn-primary" onClick={() => onStart(featured.id)}>
                  {t.startGame} <span style={{ fontSize: 18 }}>{dir === 'rtl' ? '←' : '→'}</span>
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 12 }}>
                  <span style={{ color: 'var(--fg-2)', fontFamily: 'var(--font-mono)' }}>{featured.count} {t.questions}</span>
                  <span style={{ color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{t.lastPlayed}: {featured.last}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats receipt */}
          <div className="card" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="eyebrow">{lang === 'ar' ? 'هذا الشهر' : 'This month'}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 56, lineHeight: 1, color: 'var(--accent)' }} className="tabular">
                {lang === 'ar' ? '١٤' : '14'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>{lang === 'ar' ? 'جلسة مكتملة' : 'sessions hosted'}</div>
            </div>
            <div style={{ height: 1, background: 'var(--border-1)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="eyebrow" style={{ color: 'var(--teal-300)' }}>{t.teamA}</div>
                <div className="tabular" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--teal-300)' }}>{lang === 'ar' ? '٨' : '8'}</div>
              </div>
              <div style={{ textAlign: dir === 'rtl' ? 'left' : 'right' }}>
                <div className="eyebrow" style={{ color: 'var(--rose-300)' }}>{t.teamB}</div>
                <div className="tabular" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--rose-300)' }}>{lang === 'ar' ? '٦' : '6'}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', fontStyle: 'italic', borderTop: '1px dashed var(--border-1)', paddingTop: 14 }}>
              {lang === 'ar' ? '"الديوانية على رأس النتيجة بهامش ضيق."' : '"Al-Diwaniya leads the house, narrowly."'}
            </div>
          </div>
        </div>

        {/* Pack library */}
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>{t.yourPacks}</h2>
            <button onClick={() => setSection('packs')} style={{
              background: 'transparent', border: 'none', color: 'var(--fg-3)',
              fontFamily: 'var(--font-latin)', fontSize: 12, cursor: 'pointer',
            }}>{lang === 'ar' ? 'الكل' : 'View all'} {dir === 'rtl' ? '←' : '→'}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {PACKS.slice(1, 4).map(p => (
              <PackCard key={p.id} pack={p} lang={lang} dir={dir} t={t} onClick={() => onStart(p.id)} />
            ))}
          </div>
        </div>

        {/* Recent history */}
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{t.history}</h2>
          <div className="card" style={{ borderRadius: 20, overflow: 'hidden' }}>
            {HISTORY_GAMES.map((h, i) => (
              <div key={i} dir={dir} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 20px',
                borderBottom: i < HISTORY_GAMES.length - 1 ? '1px solid var(--border-1)' : 'none',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? 'var(--accent)' : 'var(--fg-3)', opacity: i === 0 ? 1 : 0.3 }} />
                <div style={{ flex: 1, fontSize: 13 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{h.pack}</span>
                  <span style={{ color: 'var(--fg-3)', marginLeft: 12, marginRight: 12 }}>·</span>
                  <span style={{ color: 'var(--fg-3)' }}>{h.date}</span>
                </div>
                <div className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)' }}>{h.score}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--accent)', minWidth: 100, textAlign: dir === 'rtl' ? 'left' : 'right' }}>
                  🏆 {h.winner}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PackCard({ pack, lang, dir, t, onClick }) {
  return (
    <button onClick={onClick} dir={dir} style={{
      textAlign: dir === 'rtl' ? 'right' : 'left',
      padding: 20,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-1)',
      borderRadius: 18,
      color: 'var(--fg-1)',
      cursor: 'pointer',
      transition: 'transform 220ms var(--ease-out), border-color 220ms, background 220ms',
      position: 'relative', overflow: 'hidden',
      minHeight: 140,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = pack.color; e.currentTarget.style.background = 'var(--bg-raised)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}>
      <div style={{
        position: 'absolute', top: -20, [dir === 'rtl' ? 'left' : 'right']: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: pack.color, opacity: 0.18, filter: 'blur(20px)',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: pack.color }} />
        {pack.hot && <span className="chip chip-medium" style={{ fontSize: 9, padding: '3px 8px' }}>HOT</span>}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, marginTop: 14, letterSpacing: '-0.01em' }}>
        {lang === 'ar' ? pack.ar : pack.en}
      </div>
      <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 6, lineHeight: 1.45 }}>
        {lang === 'ar' ? pack.desc_ar : pack.desc_en}
      </div>
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>
        <span>{pack.count} {t.questions}</span>
        <span>{pack.last}</span>
      </div>
    </button>
  );
}

function PacksScreen({ t, dir, lang, onStart }) {
  return (
    <div dir={dir} style={{ flex: 1, overflowY: 'auto', padding: '32px 48px' }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{t.library}</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36, letterSpacing: '-0.02em' }}>{t.packs}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 28 }}>
        {PACKS.map(p => <PackCard key={p.id} pack={p} lang={lang} dir={dir} t={t} onClick={() => onStart(p.id)} />)}
      </div>
    </div>
  );
}

function HistoryScreen({ t, dir, lang }) {
  return (
    <div dir={dir} style={{ flex: 1, overflowY: 'auto', padding: '32px 48px' }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{t.library}</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36, letterSpacing: '-0.02em' }}>{t.history}</h1>
      <div className="card" style={{ borderRadius: 20, overflow: 'hidden', marginTop: 24 }}>
        {[...HISTORY_GAMES, ...HISTORY_GAMES].map((h, i) => (
          <div key={i} dir={dir} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 20px',
            borderBottom: i < 7 ? '1px solid var(--border-1)' : 'none',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: i % 2 === 0 ? 'rgba(31,140,118,0.18)' : 'rgba(211,63,92,0.18)',
              color: i % 2 === 0 ? 'var(--teal-300)' : 'var(--rose-300)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14,
            }}>{i % 2 === 0 ? 'A' : 'B'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{h.pack}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{h.date} · {h.winner}</div>
            </div>
            <div className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-2)' }}>{h.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ t, dir, lang }) {
  return (
    <div dir={dir} style={{ flex: 1, overflowY: 'auto', padding: '32px 48px', maxWidth: 720 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{t.appName}</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36, letterSpacing: '-0.02em' }}>{t.settings}</h1>
      <p style={{ color: 'var(--fg-3)', fontSize: 13, marginTop: 8 }}>
        {lang === 'ar' ? 'استخدم لوحة "تعديل" للتجربة المباشرة.' : 'Use the Tweaks panel for live preferences.'}
      </p>
      <div className="card" style={{ padding: 24, borderRadius: 20, marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { label: lang === 'ar' ? 'العرض الكبير (TV)' : 'TV out (1080p)', val: lang === 'ar' ? 'مفعّل' : 'On' },
          { label: lang === 'ar' ? 'صوت الإجابة الصحيحة' : 'Correct-answer sound', val: lang === 'ar' ? 'طبل' : 'Tabla' },
          { label: lang === 'ar' ? 'النمط' : 'Theme', val: lang === 'ar' ? 'الديوانية' : 'Diwaniya dark' },
          { label: lang === 'ar' ? 'لغة الواجهة' : 'UI language', val: lang === 'ar' ? 'العربية' : 'English' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: 14, color: 'var(--fg-1)' }}>{s.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, PackCard, PacksScreen, HistoryScreen, SettingsScreen });
