// Mejlis — Question stage + Final scoreboard
const { useState: qUS, useEffect: qUE, useRef: qUR } = React;

function QuestionStage({ t, dir, lang, game, cellKey, onAward, onPass, tweaks }) {
  // Defensive: parent can briefly leave the question flow with cellKey=null
  // during the 400ms transition; render nothing until it remounts.
  if (!cellKey) return null;
  const [catId, tier] = cellKey.split('-');
  const cat = CATEGORIES.find(c => c.id === catId);
  const tierData = TIERS[tier];
  const localFallback = QUESTIONS[catId]?.[tier] || { q_en: 'Sample question.', q_ar: 'سؤال نموذجي.', a_en: 'Sample answer.', a_ar: 'إجابة نموذجية.' };

  // OpenTDB fetch — one question per cell mount. Falls back to localFallback on error.
  const [apiQ, setApiQ] = qUS(null);
  const [apiLoading, setApiLoading] = qUS(true);
  const [apiError, setApiError] = qUS(null);
  qUE(() => {
    let cancelled = false;
    setApiQ(null); setApiError(null); setApiLoading(true);
    fetchOpenTdbQuestion(catId, tier)
      .then(q => { if (!cancelled) { setApiQ(q); setApiLoading(false); } })
      .catch(err => { if (!cancelled) { setApiError(err.message || 'fetch failed'); setApiLoading(false); } });
    return () => { cancelled = true; };
  }, [catId, tier]);

  const [revealed, setRevealed] = qUS(false);
  const [time, setTime] = qUS(tweaks.timerSeconds);
  const [paused, setPaused] = qUS(false);
  const [usedLifeline, setUsedLifeline] = qUS(null);
  const [doubled, setDoubled] = qUS(false);

  qUE(() => {
    // Don't tick while we're still waiting on the OpenTDB fetch — users
    // shouldn't lose seconds to network latency.
    if (revealed || paused || apiLoading || time <= 0) return;
    const id = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, revealed, paused, apiLoading]);

  const pts = doubled ? tierData.pts * 2 : tierData.pts;
  const activeColor = game.activeTeam === 'A' ? tweaks.teamAColor : tweaks.teamBColor;
  const activeName = game.activeTeam === 'A' ? game.teamAName : game.teamBName;
  const otherName = game.activeTeam === 'A' ? game.teamBName : game.teamAName;

  const usedSet = game.usedLifelines?.[game.activeTeam] || [];

  const handleLifeline = (kind) => {
    if (usedSet.includes(kind)) return;
    setUsedLifeline(kind);
    if (kind === 'x2') setDoubled(true);
    if (kind === 'skip') { setTimeout(() => onPass(cellKey, kind), 600); }
  };

  const formatNum = (n) => lang === 'ar' ? n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]) : n.toString();

  return (
    <div dir={dir} style={{
      flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
      background: `radial-gradient(ellipse at center top, ${tierData.color}15 0%, var(--bg-canvas) 60%)`,
    }} className="fade-in">
      <div className="zellige-bg" style={{ opacity: tweaks.patternIntensity / 100 * 0.05 }} />

      {/* Top mini-bar */}
      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="chip" style={{
          background: `${tierData.color}26`,
          border: `1px solid ${tierData.color}66`,
          color: tierData.colorLight,
          padding: '6px 14px', fontSize: 11,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: tierData.color }} />
          {lang === 'ar' ? `${cat.ar} · ${tierData.ar}` : `${cat.en} · ${tierData.en}`}
        </div>
        <div style={{ flex: 1 }} />
        <ScorePill team="A" active={game.activeTeam === 'A'} name={game.teamAName} score={game.teamA} streak={game.streakA} color={tweaks.teamAColor} lang={lang} t={t} />
        <ScorePill team="B" active={game.activeTeam === 'B'} name={game.teamBName} score={game.teamB} streak={game.streakB} color={tweaks.teamBColor} lang={lang} t={t} />
      </div>

      {/* Stage */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, padding: '8px 32px 24px', minHeight: 0 }}>
        {/* Question card */}
        <div className="card flip-in" key={cellKey} style={{
          padding: 48,
          background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-raised) 100%)',
          borderRadius: 28,
          border: `1px solid ${tierData.color}33`,
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
          boxShadow: `0 0 60px ${tierData.color}1f`,
        }}>
          {/* Tier ribbon */}
          <div style={{
            position: 'absolute', top: 0, [dir === 'rtl' ? 'left' : 'right']: 0,
            padding: '6px 24px',
            background: tierData.color,
            color: 'var(--midnight-950)',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14,
            letterSpacing: '0.05em',
            borderBottomLeftRadius: dir === 'rtl' ? 0 : 14,
            borderBottomRightRadius: dir === 'rtl' ? 14 : 0,
          }} className="tabular">
            {doubled && <span style={{ marginInlineEnd: 6 }}>×2</span>}+{formatNum(pts)}
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 28, height: 28, color: tierData.colorLight }} dangerouslySetInnerHTML={{ __html: cat.icon }} />
              <div>
                <div className="eyebrow" style={{ color: tierData.colorLight }}>{lang === 'ar' ? cat.ar : cat.en}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{lang === 'ar' ? cat.sub.ar : cat.sub.en}</div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 24 }}>
            {apiLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="eyebrow" style={{ color: tierData.colorLight }}>
                  {lang === 'ar' ? 'جاري تحميل السؤال…' : 'Fetching question…'}
                </div>
                <div style={{ height: 28, width: '70%', background: 'rgba(255,255,255,0.06)', borderRadius: 8 }} />
                <div style={{ height: 28, width: '85%', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }} />
                <div style={{ height: 28, width: '50%', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }} />
              </div>
            ) : apiQ ? (
              <>
                {/* OpenTDB question — English-only */}
                <div dir="ltr" style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 38, lineHeight: 1.2, letterSpacing: '-0.02em',
                  textWrap: 'balance', color: 'var(--fg-1)',
                }}>
                  {apiQ.question}
                </div>
                {apiQ.choices && apiQ.choices.length > 0 && (
                  <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: apiQ.type === 'boolean' ? '1fr 1fr' : '1fr 1fr', gap: 10 }}>
                    {apiQ.choices.map((choice, i) => {
                      const isAnswer = revealed && choice === apiQ.answer;
                      const isWrong  = revealed && choice !== apiQ.answer;
                      return (
                        <div key={i} dir="ltr" style={{
                          padding: '12px 16px',
                          background: isAnswer ? `${tierData.color}26` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isAnswer ? tierData.color : 'var(--border-1)'}`,
                          borderRadius: 12,
                          display: 'flex', alignItems: 'center', gap: 12,
                          color: isWrong ? 'var(--fg-3)' : 'var(--fg-1)',
                          opacity: isWrong ? 0.5 : 1,
                          transition: 'all 220ms var(--ease-out)',
                        }}>
                          <span style={{
                            width: 24, height: 24, borderRadius: 6,
                            background: isAnswer ? tierData.color : 'rgba(255,255,255,0.06)',
                            color: isAnswer ? 'var(--midnight-950)' : 'var(--fg-2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 12, flexShrink: 0,
                          }}>{String.fromCharCode(65 + i)}</span>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 16 }}>
                            {choice}
                          </span>
                          {isAnswer && <span style={{ marginInlineStart: 'auto', fontSize: 18, color: tierData.colorLight }}>✓</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
                {apiError === null && (
                  <div style={{ marginTop: 14, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)', letterSpacing: '0.06em' }}>
                    via opentdb.com · {apiQ.category}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Local fallback — keeps the bilingual display */}
                <div dir={dir} style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: lang === 'ar' ? 44 : 38, lineHeight: 1.2, letterSpacing: '-0.02em',
                  textWrap: 'balance', color: 'var(--fg-1)',
                }}>
                  {lang === 'ar' ? localFallback.q_ar : localFallback.q_en}
                </div>
                <div dir={dir === 'rtl' ? 'ltr' : 'rtl'} style={{
                  fontFamily: 'var(--font-display)', fontWeight: 500,
                  fontSize: lang === 'ar' ? 22 : 24, lineHeight: 1.4,
                  color: 'var(--fg-3)', marginTop: 18,
                }}>
                  {lang === 'ar' ? localFallback.q_en : localFallback.q_ar}
                </div>
                {apiError && (
                  <div style={{ marginTop: 14, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>
                    {lang === 'ar' ? 'تعذّر الاتصال بـ OpenTDB · سؤال احتياطي' : `OpenTDB unavailable (${apiError}) · using fallback`}
                  </div>
                )}
              </>
            )}

            {/* Answer reveal — only shown for the local fallback path; for
                OpenTDB the answer is highlighted inline in the choices grid */}
            {revealed && !apiQ && (
              <div className="wipe-reveal" style={{
                marginTop: 32, padding: '20px 24px',
                background: `${tierData.color}1a`,
                border: `1px solid ${tierData.color}66`,
                borderRadius: 18,
              }}>
                <div className="eyebrow" style={{ color: tierData.colorLight }}>{t.answer}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>
                    {lang === 'ar' ? localFallback.a_ar : localFallback.a_en}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 18, color: 'var(--fg-3)' }}>
                    {lang === 'ar' ? localFallback.a_en : localFallback.a_ar}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action row */}
          <div style={{ marginTop: 32, display: 'flex', gap: 10, alignItems: 'center' }}>
            {!revealed ? (
              <>
                <button className="btn-primary" onClick={() => setRevealed(true)} style={{ flex: 1 }} disabled={apiLoading}>
                  {apiLoading ? (lang === 'ar' ? 'جاري التحميل…' : 'Loading…') : t.reveal}
                </button>
                <button className="btn-ghost" onClick={() => onPass(cellKey, 'pass')}>{t.pass}</button>
              </>
            ) : (
              <>
                <button className="btn-ghost" onClick={() => onAward(cellKey, false, doubled)} style={{
                  flex: 1, borderColor: tweaks.teamBColor + '66', color: tweaks.teamBColor,
                }}>
                  ✕ {t.wrong}
                </button>
                <button className="btn-primary" onClick={() => onAward(cellKey, true, doubled)} style={{
                  flex: 1, background: 'var(--olive-500)', color: 'var(--cream-50)', boxShadow: '0 4px 18px rgba(123,139,61,0.4)',
                }}>
                  ✓ {t.correct} +{formatNum(pts)}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right rail — timer + lifelines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          {/* Timer */}
          <div className="card" style={{ padding: 22, borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
            <div className="eyebrow">{t.timer}</div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span className="tabular" style={{
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 64, lineHeight: 1, letterSpacing: '-0.03em',
                color: time <= 5 ? 'var(--rose-300)' : time <= 10 ? 'var(--saffron-300)' : 'var(--fg-1)',
              }}>{formatNum(Math.max(0, time))}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-3)' }}>{t.seconds}</span>
            </div>
            <div style={{ marginTop: 12, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.max(0, time / tweaks.timerSeconds * 100)}%`,
                background: time <= 5 ? 'var(--rose-500)' : time <= 10 ? 'var(--saffron-500)' : activeColor,
                transition: 'width 1s linear, background 220ms',
              }} />
            </div>
            <button onClick={() => setPaused(p => !p)} style={{
              marginTop: 14, padding: '8px 12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-1)', borderRadius: 10,
              color: 'var(--fg-2)', fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
              width: '100%', cursor: 'pointer',
            }}>{paused ? `▶ ${t.resume}` : `❚❚ ${t.paused}`}</button>
          </div>

          {/* Lifelines */}
          <div className="card" style={{ padding: 22, borderRadius: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="eyebrow" style={{ color: activeColor }}>{t.lifelines} · {activeName}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
                {formatNum(tweaks.lifelineCount - usedSet.length)}/{formatNum(tweaks.lifelineCount)}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Lifeline kind="call" label={t.callFriend} ar="اتصل" used={usedSet.includes('call')} active={usedLifeline === 'call'} onClick={() => handleLifeline('call')} lang={lang} />
              <Lifeline kind="skip" label={t.skipQ}     ar="تخطي" used={usedSet.includes('skip')} active={usedLifeline === 'skip'} onClick={() => handleLifeline('skip')} lang={lang} />
              <Lifeline kind="x2"   label={t.doublePts} ar="مضاعفة" used={usedSet.includes('x2') || doubled} active={doubled} onClick={() => handleLifeline('x2')} lang={lang} />
            </div>
          </div>

          {/* Footer hint */}
          <div style={{ marginTop: 'auto', fontSize: 11, color: 'var(--fg-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
            {lang === 'ar' ? `إذا أخطأ ${activeName}، الدور لـ ${otherName}` : `If ${activeName} miss, ${otherName} steal`}
          </div>
        </div>
      </div>
    </div>
  );
}

function Lifeline({ kind, label, ar, used, active, onClick, lang }) {
  const icons = {
    call: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M222.37 158.46l-47.11-21.11-.13-.06a16 16 0 0 0-15.17 1.4 8.12 8.12 0 0 0-.75.56L134.87 160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16 16 0 0 0 1.32-15.06v-.12L97.54 33.64a16 16 0 0 0-16.62-9.52A56.26 56.26 0 0 0 32 80c0 79.4 64.6 144 144 144a56.26 56.26 0 0 0 55.88-48.92 16 16 0 0 0-9.51-16.62Z"/></svg>',
    skip: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M232 56v144a8 8 0 0 1-16 0v-58.45L51.91 233.83A15.83 15.83 0 0 1 44 236a16.13 16.13 0 0 1-7.9-2.1A15.84 15.84 0 0 1 28 220.07V35.93a16 16 0 0 1 23.91-13.76L216 114.45V56a8 8 0 0 1 16 0Z"/></svg>',
    x2:   '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M239.2 97.29a16 16 0 0 0-13.81-11L166 81.17 142.72 26.14a15.95 15.95 0 0 0-29.44 0L90.07 81.17l-59.46 5.11A16 16 0 0 0 21.51 114l45.1 39.7-13.5 58.1a16 16 0 0 0 23.84 17.34l51-31 51.11 31a16 16 0 0 0 23.84-17.34l-13.5-58.1 45.1-39.7a16 16 0 0 0 4.7-16.71Z"/></svg>',
  };
  return (
    <button disabled={used} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px',
      background: active ? 'rgba(233,162,27,0.14)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${active ? 'rgba(246,196,83,0.5)' : 'var(--border-1)'}`,
      borderRadius: 12,
      color: used ? 'var(--fg-3)' : 'var(--fg-1)',
      opacity: used ? 0.4 : 1,
      cursor: used ? 'default' : 'pointer',
      transition: 'all 140ms',
      width: '100%', textAlign: 'inherit',
    }}>
      <span style={{ width: 18, height: 18, color: used ? 'var(--fg-3)' : 'var(--accent)' }} dangerouslySetInnerHTML={{ __html: icons[kind] }} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, flex: 1 }}>{lang === 'ar' ? ar : label}</span>
      {used && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{lang === 'ar' ? '✓' : 'used'}</span>}
    </button>
  );
}

// === FINAL SCOREBOARD — paper-feel, receipt aesthetic ===
function FinalScreen({ t, dir, lang, game, onRematch, onNewGame, tweaks }) {
  const tied = game.teamA === game.teamB;
  const winnerIsA = game.teamA > game.teamB;
  const winnerName = tied ? null : (winnerIsA ? game.teamAName : game.teamBName);
  const winnerColor = tied ? 'var(--fg-on-paper)' : (winnerIsA ? tweaks.teamAColor : tweaks.teamBColor);
  const formatNum = (n) => lang === 'ar' ? n.toLocaleString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]) : n.toLocaleString();

  return (
    <div dir={dir} style={{
      flex: 1, background: 'var(--bg-paper)', color: 'var(--fg-on-paper)',
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
    }} className="fade-in">
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('assets/pattern-zellige.svg')",
        backgroundSize: 240, opacity: 0.06,
        filter: 'invert(1)',
      }} />
      <div style={{ position: 'relative', flex: 1, padding: '64px 64px 32px', display: 'flex', flexDirection: 'column', maxWidth: 920, margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="assets/logo-mark.svg" width="32" height="32" alt="" style={{ filter: 'hue-rotate(0)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-on-paper-3)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>{t.final}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ marginTop: 36, flex: 1 }}>
          {tied ? (
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 72, lineHeight: 1.0, letterSpacing: '-0.03em' }}>
              {t.tied}
            </h1>
          ) : (
            <>
              <div style={{ fontSize: 18, color: 'var(--fg-on-paper-2)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>🏆</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 88, lineHeight: 0.95, letterSpacing: '-0.03em', marginTop: 8, color: winnerColor }}>
                {winnerName}
              </h1>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--fg-on-paper-2)', marginTop: 8, letterSpacing: '-0.02em' }}>
                {t.takesTheNight}.
              </div>
            </>
          )}

          {/* Score table — receipt style */}
          <div style={{ marginTop: 40, padding: '24px 28px', background: 'var(--cream-100)', borderRadius: 24, border: '1px dashed rgba(17,22,38,0.18)', maxWidth: 560 }}>
            <ScoreLine name={game.teamAName} score={game.teamA} color={tweaks.teamAColor} winner={winnerIsA && !tied} t={t} team="A" lang={lang} format={formatNum} />
            <div style={{ height: 1, background: 'rgba(17,22,38,0.15)', borderTop: '1px dashed rgba(17,22,38,0.15)', borderBottom: 'none', margin: '14px 0' }} />
            <ScoreLine name={game.teamBName} score={game.teamB} color={tweaks.teamBColor} winner={!winnerIsA && !tied} t={t} team="B" lang={lang} format={formatNum} />

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed rgba(17,22,38,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, fontSize: 11 }}>
              <Stat label={lang === 'ar' ? 'الأسئلة' : 'Questions'} value={formatNum(18)} />
              <Stat label={lang === 'ar' ? 'الفارق' : 'Margin'} value={formatNum(Math.abs(game.teamA - game.teamB))} />
              <Stat label={lang === 'ar' ? 'الحزمة' : 'Pack'} value={lang === 'ar' ? PACKS[0].ar : PACKS[0].en} />
            </div>
          </div>

          {/* Quote */}
          <div style={{ marginTop: 32, fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 18, color: 'var(--fg-on-paper-2)', fontStyle: 'italic', maxWidth: 480, lineHeight: 1.4 }}>
            {lang === 'ar'
              ? `"${winnerName || 'المجلس'} حسمها بسؤال واحد صعب. ليلة ساكنة."`
              : `"${winnerName || 'The mejlis'} sealed it on one hard tile. Quiet night."`
            }
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button className="btn-primary" onClick={onRematch}>{t.rematch}</button>
          <button onClick={onNewGame} style={{
            padding: '14px 26px', background: 'transparent', color: 'var(--fg-on-paper)',
            border: '1px solid rgba(17,22,38,0.2)', borderRadius: 999,
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}>{t.newGame}</button>
        </div>
      </div>
    </div>
  );
}

function ScoreLine({ name, score, color, winner, t, team, lang, format }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--fg-on-paper-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{team === 'A' ? t.teamA : t.teamB}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginTop: 2, color: 'var(--fg-on-paper)' }}>
            {name} {winner && <span style={{ marginInlineStart: 8, fontSize: 14, color }}>★</span>}
          </div>
        </div>
      </div>
      <div className="tabular" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 48, color, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {format(score)}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, color: 'var(--fg-on-paper-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginTop: 4, color: 'var(--fg-on-paper)' }}>{value}</div>
    </div>
  );
}

// === END-GAME CONFIRM SHEET ===
function EndConfirm({ t, dir, onCancel, onConfirm, lang }) {
  return (
    <div dir={dir} style={{
      position: 'absolute', inset: 0, zIndex: 60,
      background: 'rgba(11,15,26,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
    }} className="fade-in" onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 460, background: 'var(--bg-surface)', border: '1px solid var(--border-2)',
        borderRadius: 24, padding: 32, boxShadow: 'var(--shadow-xl)',
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em' }}>{t.confirmEnd}</h3>
        <p style={{ color: 'var(--fg-3)', fontSize: 14, marginTop: 8 }}>{t.confirmEndSub}</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onCancel}>{t.keepPlaying}</button>
          <button className="btn-primary" onClick={onConfirm} style={{ background: 'var(--rose-500)', color: 'var(--cream-50)' }}>{t.yes}</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { QuestionStage, FinalScreen, EndConfirm, Lifeline });
