'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@/context/ThemeContext';
import {
  Brain, Lightbulb, Briefcase, Tag, Calendar,
  ChevronRight, ChevronDown,
} from 'lucide-react';

export interface InsightItem {
  _id?: string;
  createdAt?: string;
  date?: string;
  userInput: string;
  aiInsight: string;
}

export interface AssessmentItem {
  _id?: string;
  createdAt?: string;
  date?: string;
  skills?: string[];
  interests?: string[];
  recommendedCareers?: string[];
}

interface HistoryData {
  insight?: InsightItem[];
  assessments?: AssessmentItem[];
}

interface HistoryProps {
  historyData: HistoryData | null;
}

function fmt(d?: string) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(d));
}

function parseCareerPaths(raw: string[]): { title: string; body: string }[] {
  const full = raw.join(' ').trim();
  const regex = /\d+\.\s+\*{0,2}([^*:]+)\*{0,2}\s*:\s*/g;
  const matches: { title: string; index: number }[] = [];
  let m: RegExpExecArray | null;

  while ((m = regex.exec(full)) !== null) {
    matches.push({ title: m[1].trim(), index: m.index + m[0].length });
  }

  if (matches.length === 0) return [{ title: 'Career Recommendation', body: full }];

  return matches.map((match, i) => {
    const end = i + 1 < matches.length
      ? full.lastIndexOf((i + 2) + '.', matches[i + 1].index)
      : full.length;
    return { title: match.title, body: full.slice(match.index, end).trim() };
  });
}

/** A single accordion item — header always visible, body collapses */
function AccordionItem({
  isOpen,
  onToggle,
  header,
  body,
  accentColor,
  cardBg,
  cardBorder,
}: {
  isOpen: boolean;
  onToggle: () => void;
  header: React.ReactNode;
  body: React.ReactNode;
  accentColor: string;
  cardBg: string;
  cardBorder: string;
}) {
  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${isOpen ? accentColor + '55' : cardBorder}`,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: isOpen ? `0 4px 16px ${accentColor}18` : '0 1px 3px rgba(0,0,0,0.06)',
      transition: 'border-color 200ms, box-shadow 200ms',
    }}>
      {/* Clickable accordion trigger */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', background: 'none', border: 'none',
          cursor: 'pointer', padding: 0, textAlign: 'left',
        }}
        aria-expanded={isOpen}
      >
        <div style={{
          padding: '13px 16px',
          borderBottom: isOpen ? `1px solid ${cardBorder}` : 'none',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '8px',
          transition: 'border-color 200ms',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>{header}</div>
          <ChevronDown
            size={15}
            style={{
              color: accentColor, flexShrink: 0,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 260ms cubic-bezier(0.34,1.56,0.64,1)',
            }}
          />
        </div>
      </button>

      {/* Collapsible body */}
      <div style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 280ms ease',
      }}>
        <div style={{ overflow: 'hidden' }}>
          {body}
        </div>
      </div>
    </div>
  );
}

export default function History({ historyData }: HistoryProps) {
  const { isDark } = useTheme();

  // Track which accordion items are open — default: first of each section open
  const [openInsights,     setOpenInsights]     = useState<Record<number, boolean>>({ 0: true });
  const [openAssessments,  setOpenAssessments]  = useState<Record<number, boolean>>({ 0: true });

  const toggleInsight    = (i: number) => setOpenInsights(p    => ({ ...p, [i]: !p[i] }));
  const toggleAssessment = (i: number) => setOpenAssessments(p => ({ ...p, [i]: !p[i] }));

  // ── colour tokens ──────────────────────────────────────────
  const cardBg       = isDark ? '#1a1f2e' : '#ffffff';
  const cardBorder   = isDark ? '#272d3d' : '#e5e7eb';
  const innerBg      = isDark ? '#0f1117' : '#f9fafb';
  const titleColor   = isDark ? '#f1f5f9' : '#0f1729';
  const bodyColor    = isDark ? '#cbd5e1' : '#374151';
  const mutedColor   = isDark ? '#64748b' : '#9ca3af';
  const labelColor   = isDark ? '#94a3b8' : '#6b7280';
  const skillPillBg  = isDark ? '#1e2844' : '#eef2ff';
  const skillPillTx  = '#2255ec';
  const intPillBg    = isDark ? '#1e2f1e' : '#f0fdf4';
  const intPillTx    = '#059669';
  const insightAccent = '#2255ec';
  const careerAccent  = '#7c3aed';
  const careerBg     = isDark ? '#1e1a2e' : '#faf5ff';
  const careerBdr    = isDark ? '#3b2a6e' : '#e9d5ff';

  const isEmpty =
    !historyData ||
    (!historyData.insight?.length && !historyData.assessments?.length);

  if (isEmpty) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: titleColor, marginBottom: '6px' }}>No history yet</p>
        <p style={{ fontSize: '13px', color: mutedColor, lineHeight: 1.6 }}>
          Complete a career assessment or generate an insight<br />to see your history here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Insight History ───────────────────────────────────── */}
      {historyData?.insight && historyData.insight.length > 0 && (
        <section>
          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: insightAccent, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '16px', height: '2px', background: insightAccent, display: 'inline-block', borderRadius: '2px' }} />
              Insight History ({historyData.insight.length})
            </p>
            <button
              onClick={() => {
                const allOpen = historyData.insight!.every((_, i) => openInsights[i]);
                const next: Record<number, boolean> = {};
                historyData.insight!.forEach((_, i) => { next[i] = !allOpen; });
                setOpenInsights(next);
              }}
              style={{ fontSize: '11px', color: insightAccent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              {historyData.insight.every((_, i) => openInsights[i]) ? 'Collapse all' : 'Expand all'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historyData.insight.map((item, index) => (
              <AccordionItem
                key={item._id || index}
                isOpen={!!openInsights[index]}
                onToggle={() => toggleInsight(index)}
                accentColor={insightAccent}
                cardBg={cardBg}
                cardBorder={cardBorder}
                header={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: isDark ? '#1a2844' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Lightbulb size={13} style={{ color: insightAccent }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: titleColor, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.userInput.length > 60 ? item.userInput.slice(0, 60) + '…' : item.userInput}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: mutedColor }}>
                        <Calendar size={10} />
                        <span style={{ fontSize: '11px' }}>{fmt(item.createdAt ?? item.date)}</span>
                      </div>
                    </div>
                  </div>
                }
                body={
                  <div>
                    {/* User input */}
                    <div style={{ padding: '13px 16px', borderBottom: `1px solid ${cardBorder}`, background: innerBg }}>
                      <p style={{ fontSize: '10px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Your Input</p>
                      <p style={{ fontSize: '13px', color: bodyColor, lineHeight: 1.6, fontStyle: 'italic' }}>
                        &ldquo;{item.userInput}&rdquo;
                      </p>
                    </div>
                    {/* AI result */}
                    <div style={{ padding: '13px 16px' }}>
                      <p style={{ fontSize: '10px', fontWeight: 600, color: insightAccent, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>AI Analysis</p>
                      <div style={{ fontSize: '13px', color: bodyColor, lineHeight: 1.75 }} className="insight-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.aiInsight}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Assessment History ────────────────────────────────── */}
      {historyData?.assessments && historyData.assessments.length > 0 && (
        <section>
          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: careerAccent, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '16px', height: '2px', background: careerAccent, display: 'inline-block', borderRadius: '2px' }} />
              Assessment History ({historyData.assessments.length})
            </p>
            <button
              onClick={() => {
                const allOpen = historyData.assessments!.every((_, i) => openAssessments[i]);
                const next: Record<number, boolean> = {};
                historyData.assessments!.forEach((_, i) => { next[i] = !allOpen; });
                setOpenAssessments(next);
              }}
              style={{ fontSize: '11px', color: careerAccent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              {historyData.assessments.every((_, i) => openAssessments[i]) ? 'Collapse all' : 'Expand all'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historyData.assessments.map((item, index) => {
              const careers = item.recommendedCareers?.length
                ? parseCareerPaths(item.recommendedCareers)
                : [];

              // Build a short preview line for the collapsed header
              const skillPreview = item.skills?.slice(0, 3).join(', ') || '—';
              const extra = (item.skills?.length ?? 0) > 3 ? ` +${(item.skills?.length ?? 0) - 3} more` : '';

              return (
                <AccordionItem
                  key={item._id || index}
                  isOpen={!!openAssessments[index]}
                  onToggle={() => toggleAssessment(index)}
                  accentColor={careerAccent}
                  cardBg={cardBg}
                  cardBorder={cardBorder}
                  header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: isDark ? '#1e1a2e' : '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Brain size={13} style={{ color: careerAccent }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: titleColor, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {skillPreview}{extra}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: mutedColor, flexShrink: 0 }}>
                            <Calendar size={10} />
                            <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{fmt(item.createdAt ?? item.date)}</span>
                          </div>
                          {careers.length > 0 && (
                            <span style={{
                              fontSize: '10px', fontWeight: 600, color: careerAccent,
                              background: isDark ? '#1e1a2e' : '#faf5ff',
                              padding: '2px 8px', borderRadius: '9999px',
                              border: `1px solid ${isDark ? '#3b2a6e' : '#e9d5ff'}`,
                              whiteSpace: 'nowrap', flexShrink: 0,
                            }}>
                              {careers.length} career path{careers.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  }
                  body={
                    <div>
                      {/* Skills + Interests */}
                      <div style={{ padding: '13px 16px', borderBottom: `1px solid ${cardBorder}`, background: innerBg, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {item.skills && item.skills.length > 0 && (
                          <div style={{ flex: 1, minWidth: '130px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '7px' }}>
                              <Tag size={10} style={{ color: skillPillTx }} />
                              <p style={{ fontSize: '10px', fontWeight: 600, color: skillPillTx, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Skills</p>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                              {item.skills.map((s, i) => (
                                <span key={i} style={{ fontSize: '11px', fontWeight: 500, padding: '3px 9px', borderRadius: '9999px', background: skillPillBg, color: skillPillTx, border: '1px solid rgba(34,85,236,0.2)' }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {item.interests && item.interests.length > 0 && (
                          <div style={{ flex: 1, minWidth: '130px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '7px' }}>
                              <Tag size={10} style={{ color: intPillTx }} />
                              <p style={{ fontSize: '10px', fontWeight: 600, color: intPillTx, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Interests</p>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                              {item.interests.map((s, i) => (
                                <span key={i} style={{ fontSize: '11px', fontWeight: 500, padding: '3px 9px', borderRadius: '9999px', background: intPillBg, color: intPillTx, border: '1px solid rgba(5,150,105,0.2)' }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Career paths */}
                      {careers.length > 0 && (
                        <div style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '11px' }}>
                            <Briefcase size={11} style={{ color: careerAccent }} />
                            <p style={{ fontSize: '10px', fontWeight: 600, color: careerAccent, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                              Recommended Career Paths
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {careers.map((career, ci) => (
                              <div
                                key={ci}
                                style={{ background: careerBg, border: `1px solid ${careerBdr}`, borderRadius: '10px', padding: '11px 14px', display: 'flex', gap: '11px', alignItems: 'flex-start' }}
                              >
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: careerAccent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>
                                  {ci + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#c4b5fd' : careerAccent, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {career.title}
                                    <ChevronRight size={12} style={{ opacity: 0.5 }} />
                                  </p>
                                  <p style={{ fontSize: '12px', color: labelColor, lineHeight: 1.65 }}>{career.body}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  }
                />
              );
            })}
          </div>
        </section>
      )}

      <style>{`
        .insight-markdown p        { margin-bottom: 10px; }
        .insight-markdown ul,
        .insight-markdown ol       { padding-left: 18px; margin-bottom: 10px; }
        .insight-markdown li       { margin-bottom: 4px; line-height: 1.65; }
        .insight-markdown strong   { font-weight: 600; }
        .insight-markdown p:last-child { margin-bottom: 0; }
      `}</style>
    </div>
  );
}
