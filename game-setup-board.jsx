// Mejlis — Game flow: Setup, Board, Question, Final
const { useState: gUS, useEffect: gUE, useRef: gUR } = React;

// === SETUP MODAL — over the library ===
function SetupModal({ t, dir, lang, pack, onCancel, onBegin, tweaks }) {
  const [teamA, setTeamA] = gUS(tweaks.teamAName);
  const [teamB, setTeamB] = gUS(tweaks.teamBName);
  const [rounds, setRounds] = gUS(3);
  const [timer, setTimer] = gUS(tweaks.timerSeconds);
  const [lifelines, setLifelines] = gUS(tweaks.lifelineCount);
  if (!pack) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'rgba(11,15,26,0.6)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }} className="fade-in" onClick={onCancel}>
      <div dir={dir} onClick={e => e.stopPropagation()} style={{
        width: 640, maxWidth: '100%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-2)',
        borderRadius: 24,
        boxShadow: 'var(--shadow-xl)',
        padding: 36,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, [dir === 'rtl' ? 'left' : 'right']: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: pack.color, opacity: 0.15, filter: 'blur(40px)',
        }} />
        <div style={{ position: 'relative' }}>
          <div className="eyebrow" style={{ color: tweaks.teamAColor }}>{t.startGame}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, marginTop: 6, letterSpacing: '-0.02em' }}>
            {lang === 'ar' ? pack.ar : pack.en}
          </h2>
          <p style={{ color: 'var(--fg-3)', fontSize: 13, marginTop: 6 }}>
            {pack.count} {t.questions} · {lang === 'ar' ? pack.desc_ar : pack.desc_en}
          </p>

          {/* Teams row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 28 }}>
            <TeamInput color={tweaks.teamAColor} label={t.teamA} value={teamA} onChange={setTeamA} dir={dir} />
            <TeamInput color={tweaks.teamBColor} label={t.teamB} value={teamB} onChange={setTeamB} dir={dir} />
          </div>

          {/* Settings grid */}
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <SegmentControl label={t.rounds} options={[1,3,5]} value={rounds} onChange={setRounds} dir={dir} />
            <StepperControl label={t.timer} value={timer} onChange={setTimer} unit={t.seconds} min={15} max={120} step={5} dir={dir} />
            <StepperControl label={t.lifelines} value={lifelines} onChange={setLifelines} unit="" min={0} max={5} step={1} dir={dir} />
          </div>

          {/* Actions */}
          <div style={{ marginTop: 32, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn-ghost" onClick={onCancel}>{t.cancel}</button>
            <button className="btn-primary" onClick={() => onBegin({ teamA, teamB, rounds, timer, lifelines, packId: pack.id })}>
              {t.begin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamInput({ color, label, value, onChange, dir }) {
  return (
    <div>
      <div className="eyebrow" style={{ color, marginBottom: 8 }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} dir={dir} style={{
        width: '100%', padding: '12px 14px',
        background: 'var(--bg-canvas)',
        color: 'var(--fg-1)',
        border: `1px solid ${color}`,
        borderRadius: 12,
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
        outline: 'none',
      }} />
    </div>
  );
}

function SegmentControl({ label, options, value, onChange, dir }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', padding: 3, background: 'var(--bg-canvas)', borderRadius: 10, border: '1px solid var(--border-1)' }}>
        {options.map(n => (
          <button key={n} onClick={() => onChange(n)} style={{
            flex: 1, padding: '8px',
            background: value === n ? 'var(--accent)' : 'transparent',
            color: value === n ? 'var(--midnight-950)' : 'var(--fg-2)',
            border: 'none', borderRadius: 8,
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            transition: 'background 140ms',
          }}>{n}</button>
        ))}
      </div>
    </div>
  );
}

function StepperControl({ label, value, onChange, unit, min, max, step, dir }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-canvas)', borderRadius: 10, border: '1px solid var(--border-1)', padding: 3 }}>
        <button onClick={() => onChange(Math.max(min, value - step))} style={{ width: 30, height: 30, background: 'transparent', border: 'none', color: 'var(--fg-2)', fontSize: 18, cursor: 'pointer', borderRadius: 6 }}>−</button>
        <div className="tabular" style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
          {value}{unit && <span style={{ fontSize: 11, color: 'var(--fg-3)', marginInlineStart: 4 }}>{unit}</span>}
        </div>
        <button onClick={() => onChange(Math.min(max, value + step))} style={{ width: 30, height: 30, background: 'transparent', border: 'none', color: 'var(--fg-2)', fontSize: 18, cursor: 'pointer', borderRadius: 6 }}>+</button>
      </div>
    </div>
  );
}

// === BOARD — Jeopardy-style 6×3 grid, full-bleed ===
function BoardScreen({ t, dir, lang, game, onPickCell, onEnd, tweaks }) {
  const cats = DEFAULT_BOARD_CATS.map(id => CATEGORIES.find(c => c.id === id));
  const tiers = ['easy', 'medium', 'hard'];
  const usedCells = game.usedCells || {};
  const total = 6 * 3;
  const remaining = total - Object.keys(usedCells).length;

  return (
    <div dir={dir} style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div className="zellige-bg" style={{ opacity: tweaks.patternIntensity / 100 * 0.06 }} />

      {/* Top bar — scores + meta */}
      <BoardTopBar t={t} lang={lang} dir={dir} game={game} onEnd={onEnd} remaining={remaining} total={total} tweaks={tweaks} />

      {/* Board */}
      <div style={{ flex: 1, padding: '12px 32px 32px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 4px 14px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em' }}>{t.boardTitle}</h1>
          <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>{t.boardSub}</span>
        </div>

        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'auto repeat(3, 1fr)',
          gap: 10, minHeight: 0,
        }}>
          {/* Category headers */}
          {cats.map(c => (
            <div key={c.id} style={{
              padding: '14px 12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-1)',
              borderRadius: 14,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              textAlign: 'center',
            }}>
              <span style={{ width: 22, height: 22, color: 'var(--accent)' }} dangerouslySetInnerHTML={{ __html: c.icon }} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, lineHeight: 1.1 }}>
                {lang === 'ar' ? c.ar : c.en}
              </div>
            </div>
          ))}

          {/* Tier cells */}
          {tiers.map(tier => cats.map(cat => {
            const key = `${cat.id}-${tier}`;
            const used = usedCells[key];
            const tierData = TIERS[tier];
            return (
              <button
                key={key}
                disabled={used}
                onClick={() => onPickCell(cat.id, tier)}
                style={{
                  position: 'relative',
                  background: used ? 'rgba(255,255,255,0.02)' : `linear-gradient(160deg, ${tierData.color} 0%, color-mix(in srgb, ${tierData.color} 70%, var(--midnight-950)) 100%)`,
                  border: used ? '1px dashed var(--border-1)' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 14,
                  color: used ? 'var(--fg-3)' : 'var(--fg-1)',
                  cursor: used ? 'default' : 'pointer',
                  transition: 'transform 220ms var(--ease-out), box-shadow 220ms',
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, letterSpacing: '-0.02em',
                  overflow: 'hidden',
                  opacity: used ? 0.4 : 1,
                }}
                onMouseEnter={e => { if (!used) { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 12px 30px ${tierData.color}66`; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                {used ? (
                  <span style={{ fontSize: 14, opacity: 0.5 }}>{used === 'A' ? game.teamAName : used === 'B' ? game.teamBName : '—'}</span>
                ) : (
                  <span className="tabular">
                    {lang === 'ar'
                      ? tierData.pts.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])
                      : tierData.pts}
                  </span>
                )}
                {!used && (
                  <span style={{ position: 'absolute', top: 8, [dir === 'rtl' ? 'right' : 'left']: 10, fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7 }}>
                    {lang === 'ar' ? tierData.ar : tierData.en}
                  </span>
                )}
              </button>
            );
          }))}
        </div>
      </div>
    </div>
  );
}

function BoardTopBar({ t, lang, dir, game, onEnd, remaining, total, tweaks }) {
  const activeIsA = game.activeTeam === 'A';
  return (
    <div dir={dir} style={{
      padding: '14px 24px 8px 24px',
      display: 'flex', alignItems: 'center', gap: 14,
      borderBottom: '0.5px solid rgba(255,255,255,0.06)',
    }}>
      {/* Brand small */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 130 }}>
        <img src="assets/logo-mark.svg" width="20" height="20" alt="" />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14 }}>{t.appName}</div>
      </div>

      {/* Team A */}
      <ScorePill team="A" active={activeIsA} name={game.teamAName} score={game.teamA} streak={game.streakA} color={tweaks.teamAColor} lang={lang} t={t} />

      {/* Center: turn indicator */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <RoundDots remaining={remaining} total={total} />
        <TurnPill team={game.activeTeam} name={activeIsA ? game.teamAName : game.teamBName} color={activeIsA ? tweaks.teamAColor : tweaks.teamBColor} lang={lang} dir={dir} />
      </div>

      {/* Team B */}
      <ScorePill team="B" active={!activeIsA} name={game.teamBName} score={game.teamB} streak={game.streakB} color={tweaks.teamBColor} lang={lang} t={t} />

      {/* End */}
      <button onClick={onEnd} className="btn-icon" aria-label={t.endGame} style={{ marginInlineStart: 8 }}>
        <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/></svg>
      </button>
    </div>
  );
}

function ScorePill({ team, active, name, score, streak, color, lang, t }) {
  const formatted = lang === 'ar' ? score.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]) : score.toLocaleString();
  return (
    <div style={{
      padding: '10px 16px',
      background: active ? `${color}26` : 'rgba(255,255,255,0.03)',
      border: `1px solid ${active ? color : 'var(--border-1)'}`,
      borderRadius: 14,
      minWidth: 180,
      display: 'flex', flexDirection: 'column', gap: 2,
      transition: 'all 220ms var(--ease-out)',
      boxShadow: active ? `0 0 24px ${color}40` : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: active ? `0 0 0 4px ${color}33` : 'none' }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{team === 'A' ? t.teamA : t.teamB}</span>
        </div>
        {streak >= 2 && <span style={{ fontSize: 11 }}>🔥{streak}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--fg-1)', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        <span className="tabular" style={{ marginInlineStart: 'auto', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color, letterSpacing: '-0.02em' }}>
          {formatted}
        </span>
      </div>
    </div>
  );
}

function TurnPill({ team, name, color, lang, dir }) {
  return (
    <div className="glow-pulse" style={{
      padding: '8px 18px',
      background: `${color}1f`,
      border: `1px solid ${color}80`,
      borderRadius: 999,
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
      color, whiteSpace: 'nowrap',
    }}>
      {lang === 'ar' ? `دور ${name}` : `${name}'s turn`}
    </div>
  );
}

function RoundDots({ remaining, total }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: i < total - remaining ? 'var(--fg-3)' : 'var(--accent)',
          opacity: i < total - remaining ? 0.3 : 0.85,
        }} />
      ))}
    </div>
  );
}

Object.assign(window, { SetupModal, BoardScreen, BoardTopBar, ScorePill, TurnPill, RoundDots });
