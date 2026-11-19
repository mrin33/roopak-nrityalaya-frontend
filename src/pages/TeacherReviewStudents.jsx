import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import StarRating from '../components/StarRating';
import RollNumberBadge from '../components/RollNumberBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import teacherService from '../services/teacherService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/date';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CRITERIA = [
  ['techniqueRating', 'Technique', 'Footwork, hand gestures, posture'],
  ['rhythmRating', 'Rhythm', 'Taal, layakari, tempo control'],
  ['creativityRating', 'Expression', 'Abhinaya, facial expression, interpretation'],
  ['disciplineRating', 'Discipline', 'Regular practice, punctuality, dedication'],
];

const freshForm = () => ({
  reviewMonth: new Date().getMonth() + 1,
  reviewYear: new Date().getFullYear(),
  techniqueRating: 3,
  rhythmRating: 3,
  creativityRating: 3,
  disciplineRating: 3,
  reviewText: '',
});

const periodIndex = (y, m) => y * 12 + (m - 1);

const TeacherReviewStudents = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState(freshForm());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentRows, reviewRows] = await Promise.all([teacherService.getStudents(), teacherService.getReviews()]);
      const reviews = reviewRows.map((r) => ({ ...r, id: r.review_id }));
      const latest = {};
      reviews.forEach((r) => {
        const key = periodIndex(r.review_year, r.review_month);
        if (latest[r.student_id] === undefined || key > latest[r.student_id]) latest[r.student_id] = key;
      });
      setStudents(studentRows.map((st) => ({ ...st, id: st.student_id, lastReview: latest[st.student_id] ?? null })));
      setMyReviews(reviews);
    } catch (err) {
      setError(err.message || 'Could not load your students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const now = new Date();
  const thisPeriod = periodIndex(now.getFullYear(), now.getMonth() + 1);
  const needsReview = (s) => s.lastReview === null || s.lastReview < thisPeriod;
  const pending = students.filter(needsReview);

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  const overall = CRITERIA.reduce((sum, [k]) => sum + Number(formData[k]), 0) / CRITERIA.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await teacherService.createReview({
        student_id: selectedStudent.id,
        review_month: parseInt(formData.reviewMonth, 10),
        review_year: parseInt(formData.reviewYear, 10),
        technique_rating: parseInt(formData.techniqueRating, 10),
        rhythm_rating: parseInt(formData.rhythmRating, 10),
        creativity_rating: parseInt(formData.creativityRating, 10),
        discipline_rating: parseInt(formData.disciplineRating, 10),
        review_text: formData.reviewText,
      });
      setSelectedStudent(null);
      toast.success(`Review saved for ${selectedStudent.full_name}. It is now visible on their Reviews page.`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Could not save the review.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSkeleton label="Loading your students…" />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const fromIndex = (i) => `${MONTHS[i % 12].slice(0, 3)} ${Math.floor(i / 12)}`;

  return (
    <div className="page">
      <PageHeader title="Monthly reviews" description="Rate each student’s progress once a month. Students see your review on their portal." />

      {pending.length > 0 && (
        <div className="callout-warning mb-6 flex gap-3">
          <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            <strong>{pending.length}</strong> student{pending.length > 1 ? 's have' : ' has'} not been reviewed for {MONTHS[now.getMonth()]} yet.
          </p>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Students" value={students.length} icon="users" tone="brand" />
        <StatCard label="Due this month" value={pending.length} icon="clock" tone={pending.length ? 'warning' : 'success'} />
        <StatCard
          label="Reviewed this month"
          value={myReviews.filter((r) => periodIndex(r.review_year, r.review_month) === thisPeriod).length}
          icon="checkCircle"
          tone="success"
        />
        <StatCard label="Total reviews" value={myReviews.length} icon="star" tone="gold" />
      </div>

      <section className="surface mb-6 overflow-hidden" aria-labelledby="students-heading">
        <h2 id="students-heading" className="section-title border-b border-sand-200 px-5 py-4">
          Students
        </h2>
        {students.length === 0 ? (
          <EmptyState icon="users" title="No students yet" description="Students enrolled in your batches appear here." size="sm" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col" className="hidden md:table-cell">
                    Batch
                  </th>
                  <th scope="col">Last review</th>
                  <th scope="col">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <p className="font-medium text-accent">{s.full_name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <RollNumberBadge rollNumber={s.roll_number} size="sm" />
                        <span className="text-xs text-gray-500">{s.level_name}</span>
                      </div>
                    </td>
                    <td className="hidden text-gray-600 md:table-cell">{s.batch_name || '—'}</td>
                    <td>{s.lastReview === null ? <span className="badge-warning">Never</span> : <span className="text-gray-600">{fromIndex(s.lastReview)}</span>}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(s);
                          setFormData(freshForm());
                        }}
                        className={needsReview(s) ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
                      >
                        {needsReview(s) ? 'Write review' : 'Add review'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card" aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="section-title mb-4">
          Reviews you have written
        </h2>
        {myReviews.length === 0 ? (
          <EmptyState icon="star" title="No reviews submitted yet" size="sm" />
        ) : (
          <ul className="divide-y divide-sand-100">
            {myReviews.map((r) => (
              <li key={r.id} className="flex items-center gap-4 py-3">
                <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-secondary-50 text-secondary-800">
                  <span className="font-heading text-lg font-semibold leading-none">{Number(r.overall_rating).toFixed(1)}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-accent">{r.student_name}</p>
                  <p className="text-sm text-gray-600">
                    {MONTHS[r.review_month - 1]} {r.review_year}
                  </p>
                </div>
                <p className="hidden text-xs text-gray-500 sm:block">Submitted {formatDate(r.created_at, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Monthly review"
        description={selectedStudent && `${selectedStudent.full_name}${selectedStudent.roll_number ? ` · ${selectedStudent.roll_number}` : ''}`}
        size="lg"
        dismissible={!saving}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="reviewMonth" className="form-label">
                Month
              </label>
              <select id="reviewMonth" name="reviewMonth" value={formData.reviewMonth} onChange={handleChange} className="input-field">
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="reviewYear" className="form-label">
                Year
              </label>
              <select id="reviewYear" name="reviewYear" value={formData.reviewYear} onChange={handleChange} className="input-field">
                {[0, 1].map((back) => {
                  const y = now.getFullYear() - back;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <fieldset className="mt-5 rounded-xl border border-sand-200 bg-sand-50 p-4">
            <legend className="px-1 text-sm font-semibold text-accent">Ratings (1–5)</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {CRITERIA.map(([key, label, hint]) => (
                <div key={key}>
                  <p className="text-sm font-medium text-accent">{label}</p>
                  <p className="mb-1.5 text-xs text-gray-500">{hint}</p>
                  <StarRating rating={Number(formData[key])} interactive onChange={(v) => setFormData((f) => ({ ...f, [key]: v }))} size="lg" showNumber label={label} />
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-sand-200 pt-3 text-sm text-gray-600">
              Overall: <strong className="font-heading text-lg text-accent">{overall.toFixed(2)}</strong> / 5
            </p>
          </fieldset>

          <div className="mt-5">
            <label htmlFor="reviewText" className="form-label">
              Written feedback
            </label>
            <textarea
              id="reviewText"
              name="reviewText"
              value={formData.reviewText}
              onChange={handleChange}
              rows={5}
              className="input-field"
              placeholder="Strengths, areas to improve, and what to practise next…"
              required
            />
            <p className="form-hint">The student will see this feedback.</p>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={() => setSelectedStudent(null)} className="btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Submit review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherReviewStudents;
