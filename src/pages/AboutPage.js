import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import publicService from '../services/publicService';
import Icon from '../components/ui/Icon';
import { Skeleton } from '../components/ui/Skeleton';
import { Ornament, PageHero, SectionHeading, usePageTitle } from '../components/public/Sections';

// Curriculum descriptions (academy copy). Names, codes and fees come from the database.
const LEVEL_NOTES = {
  1: 'Foundation level introducing basic postures, hand movements and simple rhythmic patterns.',
  2: 'Completion of foundational training with stronger footwork and introductory compositions.',
  3: 'Intermediate level focusing on complex rhythms and expressive storytelling techniques.',
  4: 'Advanced intermediate training with intricate choreography and theoretical knowledge.',
  5: 'Advanced level emphasising artistic expression and performance skills.',
  6: 'Completion of advanced training with mastery of traditional compositions.',
  7: 'Expert level requiring exceptional technical proficiency and creative interpretation.',
  8: 'Mastery level, where students become accomplished performers and potential teachers.',
};

const PLAN_ORDER = ['monthly', 'quarterly', 'half_yearly', 'yearly'];
const PLAN_LABEL = { monthly: 'Monthly', quarterly: 'Quarterly', half_yearly: 'Half-yearly', yearly: 'Yearly' };
const inr = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const VALUES = [
  { icon: 'users', title: 'Guru–shishya parampara', text: 'Learning through the time-honoured teacher–student tradition.' },
  { icon: 'book', title: 'Structured 8-level curriculum', text: 'Progressive learning from Praveshika to Alankar.' },
  { icon: 'sparkles', title: 'Performance and expression', text: 'Technique taught together with abhinaya and stage presence.' },
];

const REASONS = [
  { icon: 'teacher', title: 'Dedicated teachers', text: 'Classes are led by trained Kathak teachers committed to the traditional technique.' },
  { icon: 'chart', title: 'Measured progress', text: 'Clear levels and monthly teacher reviews make each student’s progress visible.' },
  { icon: 'clipboardCheck', title: 'Organised learning', text: 'Attendance, schedules, makeup classes and fees are all tracked in the student portal.' },
  { icon: 'book', title: 'Learning resources', text: 'Teachers share notes, audio and practice videos for each level through the portal.' },
  { icon: 'clock', title: 'Practice habits', text: 'Students keep a practice log so regular riyaz becomes part of their routine.' },
  { icon: 'globe', title: 'Culture and community', text: 'A community of dancers and families who value the classical arts.' },
];

const AboutPage = () => {
  usePageTitle('About');
  const [levels, setLevels] = useState({ loading: true, rows: [], error: false });

  useEffect(() => {
    let alive = true;
    publicService
      .getLevels()
      .then((rows) => alive && setLevels({ loading: false, rows, error: false }))
      .catch(() => alive && setLevels({ loading: false, rows: [], error: true }));
    return () => {
      alive = false;
    };
  }, []);

  const hasFees = levels.rows.some((l) => l.fees?.length);

  return (
    <>
      <PageHero
        eyebrow="About the academy"
        title="Preserving Kathak, one generation of dancers at a time"
        description="Roopak Nrityalaya is dedicated to teaching the classical dance form of Kathak through traditional methods supported by a clear, modern structure."
      />

      {/* Story */}
      <section className="section">
        <div className="container-site grid items-start gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="eyebrow">Our story</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-accent sm:text-4xl">A home for the art of storytelling</h2>
            <Ornament className="mt-4" />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
              <p>
                Roopak Nrityalaya was established to create a nurturing environment where students can immerse themselves
                in the rich tradition of Kathak. From the beginning, the aim has been to preserve the authenticity of this
                classical art form while making it accessible to dancers of all ages.
              </p>
              <p>
                Under the guidance of our gurus, training follows a structured curriculum of eight progressive levels. Each
                level builds on the one before, taking students from foundational technique to confident performance.
              </p>
              <p>
                The academy is more than a dance school — it is a place where students learn not only the steps, but also
                the history, philosophy and spirit of Kathak.
              </p>
            </div>
          </div>
          <aside className="space-y-4 lg:col-span-2">
            {VALUES.map((v) => (
              <div key={v.title} className="flex gap-4 rounded-xl border border-sand-200 bg-white p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sand-50">
                  <Icon name={v.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-body text-base font-semibold text-accent">{v.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{v.text}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="section border-y border-sand-200 bg-sand-100">
        <div className="container-site grid gap-6 md:grid-cols-2">
          {[
            [
              'Our vision',
              'eye',
              'To be a centre of excellence for Kathak — preserving its heritage while refining how it is taught — and to nurture dancers who carry the beauty of this classical art form wherever they go.',
            ],
            [
              'Our mission',
              'sparkles',
              'To provide authentic, high-quality Kathak training that develops both technical excellence and artistic expression, and to make classical dance education accessible while fostering discipline, creativity and cultural appreciation.',
            ],
          ].map(([title, icon, text]) => (
            <div key={title} className="rounded-2xl bg-white p-8 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-50 text-secondary-700">
                <Icon name={icon} className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-heading text-2xl font-semibold text-accent">{title}</h2>
              <p className="mt-3 leading-relaxed text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Levels */}
      <section className="section" id="levels">
        <div className="container-site">
          <SectionHeading
            eyebrow="Curriculum"
            title="The eight levels of Kathak"
            description="Students begin at Praveshika Pratham and advance level by level, building a strong foundation before moving to more complex technique."
          />
          {levels.loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : (
            <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(levels.rows.length
                ? levels.rows
                : Object.keys(LEVEL_NOTES).map((n) => ({ level_id: n, level_number: Number(n), level_name: null }))
              ).map((l) => (
                <li key={l.level_id} className="flex flex-col rounded-xl border border-sand-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-4xl font-semibold text-secondary-500/80">
                      {String(l.level_number).padStart(2, '0')}
                    </span>
                    {l.level_code && <span className="badge-neutral font-mono">{l.level_code}</span>}
                  </div>
                  {l.level_name && <h3 className="mt-3 font-body text-lg font-semibold text-accent">{l.level_name}</h3>}
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{LEVEL_NOTES[l.level_number] || l.description}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Fees (live from the fee structure) */}
      {!levels.loading && hasFees && (
        <section className="section border-t border-sand-200 bg-white" id="fees">
          <div className="container-site">
            <SectionHeading
              eyebrow="Fees"
              title="Fee structure"
              description="Fees depend on the level and the payment plan you choose; longer plans include a discount."
            />
            <div className="surface overflow-hidden">
              <div className="table-wrap">
                <table className="data-table">
                  <caption className="sr-only">Fees per level and payment plan</caption>
                  <thead>
                    <tr>
                      <th scope="col">Level</th>
                      {PLAN_ORDER.map((p) => (
                        <th key={p} scope="col" className="text-right">
                          {PLAN_LABEL[p]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {levels.rows.map((l) => {
                      const byPlan = Object.fromEntries((l.fees || []).map((f) => [f.payment_window, f]));
                      return (
                        <tr key={l.level_id}>
                          <th scope="row" className="td text-left font-medium text-accent">
                            {l.level_name}
                          </th>
                          {PLAN_ORDER.map((p) => {
                            const f = byPlan[p];
                            return (
                              <td key={p} className="whitespace-nowrap text-right tabular-nums">
                                {f ? (
                                  <>
                                    {inr(f.discounted_amount ?? f.base_amount)}
                                    {Number(f.discount_percentage) > 0 && (
                                      <span className="ml-1.5 text-xs text-green-700">−{Number(f.discount_percentage)}%</span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">Amounts are per payment period. Fees are paid at the academy office.</p>
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="section border-t border-sand-200 bg-sand-50">
        <div className="container-site">
          <SectionHeading eyebrow="What to expect" title="Learning at Roopak Nrityalaya" />
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((r) => (
              <div key={r.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                  <Icon name={r.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-body text-base font-semibold text-accent">{r.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-sand-50">
        <div className="container-site flex flex-col items-center justify-between gap-6 py-12 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Ready to begin?</h2>
            <p className="mt-2 text-primary-100">Register online, or get in touch to ask about batches and timings.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-gold btn-lg">
              Enrol now
            </Link>
            <Link to="/contact" className="btn btn-lg border border-sand-50/40 text-sand-50 hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
