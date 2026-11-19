import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import Icon from '../components/ui/Icon';
import ErrorState from '../components/ErrorState';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import { TeacherAvatar } from '../components/public/Sections';
import { useToast } from '../context/ToastContext';
import teacherService from '../services/teacherService';

const toForm = (p) => ({
  fullName: p.full_name || '',
  email: p.email || '',
  phone: p.phone || '',
  specialization: p.specialization || '',
  experienceYears: p.experience_years ?? 0,
  qualifications: p.qualifications || '',
  bio: p.bio || '',
});

const TeacherProfile = () => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [batchCount, setBatchCount] = useState(null);
  const [formData, setFormData] = useState(toForm({}));
  const [showPassword, setShowPassword] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [p, batches] = await Promise.all([teacherService.getProfile(), teacherService.getBatches()]);
      setProfile(p);
      setFormData(toForm(p));
      setBatchCount(batches.length);
    } catch (err) {
      setError(err.message || 'Failed to load your profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const cancel = () => {
    setFormData(toForm(profile));
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const update = {
        phone: formData.phone,
        bio: formData.bio,
        specialization: formData.specialization,
        qualifications: formData.qualifications,
        experience_years: parseInt(formData.experienceYears, 10) || 0,
      };
      await teacherService.updateProfile(update);
      setProfile((p) => ({ ...p, ...update }));
      toast.success('Profile updated. Public details appear on the Teachers page.');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update your profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSkeleton label="Loading your profile…" variant="form" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const stats = [
    ['Batches', batchCount ?? '—'],
    ['Students', profile.total_students ?? 0],
    ['Years', formData.experienceYears || 0],
    ['Rating', Number(profile.avg_rating || 0).toFixed(1)],
  ];
  const details = [
    ['Email', formData.email],
    ['Phone', formData.phone],
    ['Specialisation', formData.specialization],
    ['Experience', `${formData.experienceYears || 0} years`],
    ['Qualifications', formData.qualifications],
  ];

  return (
    <div className="page">
      <PageHeader
        title="My profile"
        description="Your specialisation, qualifications and bio are shown on the public Teachers page."
        actions={
          !isEditing && (
            <button type="button" onClick={() => setIsEditing(true)} className="btn-primary">
              <Icon name="pencil" className="h-4 w-4" /> Edit profile
            </button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="space-y-6">
          <section className="card text-center">
            <TeacherAvatar name={formData.fullName} className="mx-auto h-24 w-24 text-3xl" />
            <h2 className="mt-4 font-heading text-xl font-semibold text-accent">{formData.fullName}</h2>
            <p className="text-sm text-secondary-700">{formData.specialization || 'Kathak'}</p>
            <dl className="mt-5 grid grid-cols-4 gap-2 border-t border-sand-200 pt-5">
              {stats.map(([k, v]) => (
                <div key={k} className="flex flex-col-reverse">
                  <dt className="text-[0.7rem] text-gray-500">{k}</dt>
                  <dd className="font-heading text-xl font-semibold tabular-nums text-accent">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-gray-500">Profile photos are not supported yet; your initials are shown instead.</p>
          </section>

          <section className="card">
            <h2 className="section-title">Security</h2>
            <p className="mt-1 text-sm text-gray-600">Changing your password signs you out on other devices.</p>
            <button type="button" onClick={() => setShowPassword(true)} className="btn-secondary mt-4 w-full">
              <Icon name="key" className="h-4 w-4" /> Change password
            </button>
          </section>
        </aside>

        <section className="card sm:p-8 lg:col-span-2" aria-labelledby="details-heading">
          <h2 id="details-heading" className="section-title mb-5">
            {isEditing ? 'Edit details' : 'Details'}
          </h2>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="form-label">
                    Full name
                  </label>
                  <input id="fullName" value={formData.fullName} className="input-field" disabled />
                  <p className="form-hint">Ask the academy office to change your name.</p>
                </div>
                <div>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input id="email" type="email" value={formData.email} className="input-field" disabled />
                  <p className="form-hint">Your login email cannot be changed here.</p>
                </div>
                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label htmlFor="specialization" className="form-label">
                    Specialisation
                  </label>
                  <input id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label htmlFor="experienceYears" className="form-label">
                    Years of experience
                  </label>
                  <input id="experienceYears" type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="input-field" min="0" max="80" required />
                </div>
                <div>
                  <label htmlFor="qualifications" className="form-label">
                    Qualifications
                  </label>
                  <input id="qualifications" name="qualifications" value={formData.qualifications} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div>
                <label htmlFor="bio" className="form-label">
                  Bio
                </label>
                <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={5} className="input-field" />
              </div>
              <div className="flex justify-end gap-2 border-t border-sand-200 pt-5">
                <button type="button" onClick={cancel} className="btn-secondary" disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {details.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{k}</dt>
                    <dd className="mt-1 text-accent">{v || <span className="text-gray-400">Not provided</span>}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 border-t border-sand-200 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Bio</p>
                <p className="mt-1 whitespace-pre-line leading-relaxed text-gray-700">{formData.bio || <span className="text-gray-400">Not provided</span>}</p>
              </div>
            </>
          )}
        </section>
      </div>

      <ChangePasswordDialog open={showPassword} onClose={() => setShowPassword(false)} />
    </div>
  );
};

export default TeacherProfile;
