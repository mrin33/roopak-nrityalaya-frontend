import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useLevels from '../hooks/useLevels';
import { dashboardPath } from '../config/navigation';
import { AuthShell, PasswordInput, PasswordRules, passwordValid } from '../components/public/AuthShell';
import { usePageTitle } from '../components/public/Sections';
import { Skeleton } from '../components/ui/Skeleton';

const PLANS = [
  { value: 'monthly', label: 'Monthly', months: 1 },
  { value: 'quarterly', label: 'Quarterly', months: 3 },
  { value: 'half_yearly', label: 'Half-yearly', months: 6 },
  { value: 'yearly', label: 'Yearly', months: 12 },
];

const inr = (n) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;

const Field = ({ id, label, required, hint, children, className = '' }) => (
  <div className={className}>
    <label htmlFor={id} className="form-label">
      {label} {required ? <span className="text-primary">*</span> : <span className="font-normal text-gray-500">(optional)</span>}
    </label>
    {children}
    {hint && <p className="form-hint">{hint}</p>}
  </div>
);

const Fieldset = ({ title, step, children }) => (
  <fieldset className="border-t border-sand-200 pt-6 first:border-0 first:pt-0">
    <legend className="flex items-center gap-3 pb-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">{step}</span>
      <span className="font-heading text-lg font-semibold text-accent">{title}</span>
    </legend>
    {children}
  </fieldset>
);

const RegisterPage = () => {
  usePageTitle('Register');
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const { levels, loading: levelsLoading, error: levelsError } = useLevels();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContactName: '',
    emergencyContact: '',
    currentLevel: '',
    paymentWindow: 'monthly',
    enrollmentReason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already logged in (including right after registering) → own dashboard.
  useEffect(() => {
    if (user) navigate(dashboardPath(user.role), { replace: true });
  }, [user, navigate]);

  // Default to the first level once levels load.
  useEffect(() => {
    if (!form.currentLevel && levels.length) setForm((f) => ({ ...f, currentLevel: String(levels[0].level_id) }));
  }, [levels, form.currentLevel]);

  const level = levels.find((l) => String(l.level_id) === form.currentLevel);
  const feeFor = (plan) => {
    const configured = level?.fees?.find((f) => f.payment_window === plan.value);
    if (configured) {
      return {
        base: configured.base_amount,
        amount: configured.discounted_amount ?? configured.base_amount,
        discount: Number(configured.discount_percentage) || 0,
      };
    }
    return null;
  };
  const selectedPlan = PLANS.find((p) => p.value === form.paymentWindow);
  const selectedFee = selectedPlan && feeFor(selectedPlan);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!passwordValid(form.password)) {
      setError('Password must be at least 8 characters and contain a letter and a number.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        address: form.address,
        emergencyContactName: form.emergencyContactName,
        emergencyContact: form.emergencyContact,
        currentLevelId: parseInt(form.currentLevel, 10),
        paymentWindow: form.paymentWindow,
        enrollmentReason: form.enrollmentReason,
      });
      // The effect above redirects once the session is set.
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      wide
      title="Student registration"
      subtitle="Create your account to join Roopak Nrityalaya. It takes about five minutes."
      aside={
        <>
          <p className="mt-5 font-heading text-2xl font-semibold leading-snug text-sand-50">After you register</p>
          <ol className="mt-4 space-y-3 text-sm text-sand-300">
            <li>1. You receive a roll number for your level.</li>
            <li>2. The academy places you in a batch.</li>
            <li>3. Your schedule, attendance and fees appear in your student portal.</li>
          </ol>
        </>
      }
    >
      {error && (
        <div className="callout-danger mb-6" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Fieldset step={1} title="Your details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="fullName" label="Full name" required className="sm:col-span-2">
              <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className="input-field" autoComplete="name" required />
            </Field>
            <Field id="email" label="Email" required>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} className="input-field" autoComplete="email" required />
            </Field>
            <Field id="phone" label="Mobile number" required>
              <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field" autoComplete="tel" inputMode="tel" required />
            </Field>
            <Field id="dateOfBirth" label="Date of birth" required>
              <input id="dateOfBirth" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="input-field" autoComplete="bday" required />
            </Field>
            <Field id="gender" label="Gender" required>
              <select id="gender" name="gender" value={form.gender} onChange={handleChange} className="input-field" required>
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field id="address" label="Address" className="sm:col-span-2">
              <input id="address" name="address" value={form.address} onChange={handleChange} className="input-field" autoComplete="street-address" />
            </Field>
          </div>
        </Fieldset>

        <Fieldset step={2} title="Emergency contact">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="emergencyContactName" label="Parent / guardian name" required>
              <input id="emergencyContactName" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} className="input-field" required />
            </Field>
            <Field id="emergencyContact" label="Contact number" required>
              <input id="emergencyContact" type="tel" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className="input-field" inputMode="tel" required />
            </Field>
          </div>
        </Fieldset>

        <Fieldset step={3} title="Level and fee plan">
          {levelsError ? (
            <div className="callout-danger">Levels could not be loaded: {levelsError}. Please refresh the page.</div>
          ) : levelsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <>
              <Field id="currentLevel" label="Level" required hint={level ? `Your roll number will start with ${level.level_code}.` : undefined}>
                <select id="currentLevel" name="currentLevel" value={form.currentLevel} onChange={handleChange} className="input-field" required>
                  {levels.map((l) => (
                    <option key={l.level_id} value={l.level_id}>
                      {l.level_number}. {l.level_name}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="mt-5" role="radiogroup" aria-label="Payment plan">
                <p className="form-label">
                  Payment plan <span className="text-primary">*</span>
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PLANS.map((plan) => {
                    const fee = feeFor(plan);
                    const checked = form.paymentWindow === plan.value;
                    return (
                      <label
                        key={plan.value}
                        className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-secondary-500 ${
                          checked ? 'border-primary bg-primary-50/60 ring-1 ring-primary' : 'border-sand-300 hover:border-sand-400'
                        }`}
                      >
                        <input type="radio" name="paymentWindow" value={plan.value} checked={checked} onChange={handleChange} className="sr-only" />
                        <span className="flex items-center justify-between">
                          <span className="font-semibold text-accent">{plan.label}</span>
                          {fee?.discount > 0 && <span className="badge-success">Save {fee.discount}%</span>}
                        </span>
                        <span className="text-xs text-gray-500">
                          Billed every {plan.months === 1 ? 'month' : `${plan.months} months`}
                        </span>
                        <span className="mt-2 flex items-baseline gap-2">
                          {fee ? (
                            <>
                              <span className="text-xl font-semibold tabular-nums text-primary">{inr(fee.amount)}</span>
                              {fee.discount > 0 && <span className="text-sm tabular-nums text-gray-400 line-through">{inr(fee.base)}</span>}
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Fee confirmed by the office</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {selectedFee && (
                  <p className="mt-3 text-sm text-gray-600">
                    You will pay <strong className="text-accent">{inr(selectedFee.amount)}</strong> per {selectedPlan.label.toLowerCase()} period
                    at the academy office.
                  </p>
                )}
              </div>
            </>
          )}
        </Fieldset>

        <Fieldset step={4} title="Account">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="password" label="Password" required>
              <PasswordInput id="password" name="password" autoComplete="new-password" value={form.password} onChange={handleChange} required />
              <PasswordRules password={form.password} />
            </Field>
            <Field id="confirmPassword" label="Confirm password" required>
              <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} required />
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <p className="mt-2 text-xs text-red-700">Passwords do not match.</p>
              )}
            </Field>
            <Field id="enrollmentReason" label="Why would you like to join?" className="sm:col-span-2">
              <textarea id="enrollmentReason" name="enrollmentReason" value={form.enrollmentReason} onChange={handleChange} rows={3} className="input-field" maxLength={2000} />
            </Field>
          </div>
        </Fieldset>

        <div className="flex flex-col-reverse items-center gap-4 border-t border-sand-200 pt-6 sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-700">
              Log in
            </Link>
          </p>
          <button type="submit" disabled={loading || levelsLoading || !!levelsError} className="btn-primary btn-lg w-full sm:w-auto">
            {loading ? 'Creating your account…' : 'Complete registration'}
          </button>
        </div>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
