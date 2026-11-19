import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import publicService from '../services/publicService';
import noticeService from '../services/noticeService';
import academy from '../config/academy';
import Icon from '../components/ui/Icon';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import { Skeleton } from '../components/ui/Skeleton';
import { Ornament, SectionHeading, TeacherAvatar, usePageTitle } from '../components/public/Sections';
import { formatDate } from '../utils/date';

const PILLARS = [
  {
    icon: 'book',
    title: 'Structured curriculum',
    text: 'Eight progressive levels, from Praveshika to Alankar, so every student knows where they are and what comes next.',
  },
  {
    icon: 'users',
    title: 'Guru–shishya tradition',
    text: 'Learning under a guru’s guidance, with teachers who correct, encourage and review each student’s progress every month.',
  },
  {
    icon: 'sparkles',
    title: 'Technique and expression',
    text: 'Footwork, rhythm and hand gestures are taught alongside abhinaya — the storytelling at the heart of Kathak.',
  },
];

const absolutePhoto = (url) => (url && /^https?:\/\//.test(url) ? url : null);

/** Fetch helper: keeps each home-page section independent of the others. */
const useLoad = (loader) => {
  const [state, setState] = useState({ loading: true, data: [], error: false });
  useEffect(() => {
    let alive = true;
    loader()
      .then((data) => alive && setState({ loading: false, data: Array.isArray(data) ? data : [], error: false }))
      .catch(() => alive && setState({ loading: false, data: [], error: true }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return state;
};

const HomePage = () => {
  usePageTitle(null);
  const levels = useLoad(publicService.getLevels);
  const teachers = useLoad(publicService.getTeachers);
  const gallery = useLoad(publicService.getGallery);
  const notices = useLoad(() => noticeService.getNotices());

  const photos = gallery.data.filter((g) => g.media_type === 'photo');
  const heroPhoto = photos[0];
  const featuredTeachers = teachers.data.slice(0, 4);
  const latestNotices = notices.data.slice(0, 3);

  return (
    <>
      {/* Hero ----------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-sand-100 lg:block" aria-hidden="true" />
        <div className="container-site relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="animate-rise-in">
            <p className="eyebrow">Kathak · {academy.city.split(',')[0]}</p>
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.1] text-accent sm:text-5xl lg:text-6xl">
              The classical art of Kathak, <span className="italic text-primary">taught with devotion</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              {academy.name} trains students in Kathak through a structured eight-level curriculum — building rhythm,
              grace and expression, one step at a time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary btn-lg">
                Enrol now
                <Icon name="arrowRight" className="h-5 w-5" />
              </Link>
              <Link to="/about" className="btn-secondary btn-lg">
                Explore the curriculum
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-sand-200 pt-6">
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500">Levels</dt>
                <dd className="mt-1 font-heading text-2xl font-semibold text-accent">
                  {levels.loading ? <Skeleton className="h-7 w-8" /> : levels.data.length || 8}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500">Teachers</dt>
                <dd className="mt-1 font-heading text-2xl font-semibold text-accent">
                  {teachers.loading ? <Skeleton className="h-7 w-8" /> : teachers.error ? '—' : teachers.data.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500">Style</dt>
                <dd className="mt-1 font-heading text-2xl font-semibold text-accent">Kathak</dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-secondary-400/60" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
              {gallery.loading ? (
                <Skeleton className="h-full w-full rounded-none" />
              ) : heroPhoto ? (
                <img
                  src={publicService.mediaUrl(heroPhoto.media_url)}
                  alt={heroPhoto.title || 'Students of Roopak Nrityalaya'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlaceholder className="h-full w-full" label="Academy performance photograph" />
              )}
            </div>
            {heroPhoto?.title && (
              <p className="relative mt-3 text-right text-xs italic text-gray-500">{heroPhoto.title}</p>
            )}
          </div>
        </div>
      </section>

      {/* Pillars -------------------------------------------------------- */}
      <section className="section border-y border-sand-200 bg-white">
        <div className="container-site">
          <SectionHeading
            eyebrow="Why study with us"
            title="Rooted in tradition, taught with care"
            description="Kathak — from katha, “story” — joins precise rhythm and footwork with expressive storytelling. Our teaching keeps both in balance."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-sand-200 bg-sand-50 p-6 sm:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sand-50">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-accent">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum path ------------------------------------------------ */}
      <section className="section">
        <div className="container-site">
          <SectionHeading
            eyebrow="The path"
            title="Eight levels of training"
            description="Each level builds on the last, from first steps to performance mastery."
          />
          {levels.loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : levels.error || !levels.data.length ? (
            <p className="text-center text-gray-500">The curriculum could not be loaded right now.</p>
          ) : (
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {levels.data.map((l) => (
                <li key={l.level_id} className="group relative rounded-xl border border-sand-200 bg-white p-5 transition-shadow hover:shadow-lift">
                  <span className="font-heading text-3xl font-semibold text-secondary-500/70">
                    {String(l.level_number).padStart(2, '0')}
                  </span>
                  <p className="mt-2 font-semibold text-accent">{l.level_name}</p>
                  {l.description && <p className="mt-1 text-sm text-gray-500">{l.description}</p>}
                </li>
              ))}
            </ol>
          )}
          <div className="mt-8 text-center">
            <Link to="/about" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-700">
              Learn about each level and fees <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Teachers ------------------------------------------------------- */}
      {(teachers.loading || featuredTeachers.length > 0) && (
        <section className="section border-y border-sand-200 bg-white">
          <div className="container-site">
            <SectionHeading eyebrow="Faculty" title="Learn from our teachers" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teachers.loading
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-56" />)
                : featuredTeachers.map((t) => (
                    <article key={t.id} className="rounded-2xl border border-sand-200 bg-sand-50 p-6 text-center">
                      <TeacherAvatar name={t.full_name} photoUrl={absolutePhoto(t.photo_url)} className="mx-auto h-24 w-24 text-2xl" />
                      <h3 className="mt-4 text-lg font-semibold text-accent">{t.full_name}</h3>
                      <p className="text-sm text-secondary-700">{t.specialization || 'Kathak'}</p>
                      {t.experience_years > 0 && (
                        <p className="mt-2 text-xs text-gray-500">
                          {t.experience_years} year{t.experience_years === 1 ? '' : 's'} of teaching
                        </p>
                      )}
                    </article>
                  ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/teachers" className="btn-secondary">
                Meet all teachers
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gallery strip -------------------------------------------------- */}
      {photos.length > 0 && (
        <section className="section">
          <div className="container-site">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Gallery" title="Moments from the studio and stage" align="left" className="" />
              <Link to="/gallery" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-700">
                View gallery <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.slice(0, 6).map((p, i) => (
                <li key={p.id} className={`overflow-hidden rounded-xl bg-sand-100 ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}>
                  <img
                    src={publicService.mediaUrl(p.media_url)}
                    alt={p.title || 'Gallery photo'}
                    loading="lazy"
                    className="aspect-square h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Notices -------------------------------------------------------- */}
      {latestNotices.length > 0 && (
        <section className={`section ${photos.length ? 'border-t border-sand-200 bg-white' : ''}`}>
          <div className="container-site">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Notice board" title="Latest announcements" align="left" className="" />
              <Link to="/notices" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-700">
                All notices <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {latestNotices.map((n) => (
                <article key={n.id} className="flex flex-col rounded-xl border border-sand-200 bg-sand-50 p-6">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="badge-gold capitalize">{n.category || 'general'}</span>
                    {n.is_important && <span className="badge-danger">Important</span>}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-accent">{n.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">{n.content}</p>
                  <p className="mt-4 text-xs text-gray-500">{formatDate(n.created_at)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to action ------------------------------------------------- */}
      <section className="relative overflow-hidden bg-accent text-sand-100">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[40px] border-secondary-500/10"
          aria-hidden="true"
        />
        <div className="container-site relative py-16 text-center sm:py-20">
          <Ornament className="justify-center" />
          <h2 className="mx-auto mt-5 max-w-2xl font-heading text-3xl font-semibold text-sand-50 sm:text-4xl">
            Begin your Kathak journey
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sand-300">
            Register online in a few minutes, or write to us with any questions about batches, levels and fees.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-gold btn-lg">
              Register now
            </Link>
            <Link to="/contact" className="btn btn-lg border border-sand-300/40 text-sand-50 hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
