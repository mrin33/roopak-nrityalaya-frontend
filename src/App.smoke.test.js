/**
 * Smoke test: every route renders inside its layout and degrades to an
 * error state (no crash) when the API is unreachable.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import App from './App';

jest.mock('./services/axiosConfig', () => {
  const fail = () => Promise.reject(new Error('Network unavailable (test)'));
  const api = { get: jest.fn(fail), post: jest.fn(fail), put: jest.fn(fail), delete: jest.fn(fail) };
  return { __esModule: true, default: api, API_ORIGIN: '', fetchProtectedMediaUrl: jest.fn(fail) };
});

const PUBLIC = ['/', '/about', '/teachers', '/gallery', '/notices', '/contact', '/login', '/register', '/set-password?token=x', '/no-such-page'];
const PORTALS = {
  student: ['dashboard', 'attendance', 'fees', 'activity-log', 'reviews', 'gallery-upload', 'makeup-classes', 'resources', 'schedule'],
  teacher: ['dashboard', 'attendance', 'students', 'batches', 'review-students', 'batch-transfer', 'resources', 'profile', 'makeup-requests'],
  admin: ['dashboard', 'students', 'teachers', 'batches', 'fees', 'gallery-requests', 'analytics', 'status-changes', 'notices', 'gallery', 'messages'],
};

let container;
let root;
let consoleError;

beforeAll(() => {
  window.scrollTo = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  consoleError.mockRestore();
  localStorage.clear();
});

const renderAt = async (path) => {
  window.history.pushState({}, '', path);
  root = createRoot(container);
  await act(async () => {
    root.render(<App />);
  });
  // let rejected requests settle into error states
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
};

const crashErrors = () =>
  consoleError.mock.calls.map((c) => String(c[0])).filter((m) => /The above error occurred|Uncaught|is not a function|Cannot read prop/.test(m));

describe('public site', () => {
  test.each(PUBLIC)('%s renders with navbar and footer', async (path) => {
    await renderAt(path);
    expect(container.querySelector('header')).not.toBeNull();
    expect(container.querySelector('footer')).not.toBeNull();
    expect(container.querySelector('#portal-main')).toBeNull(); // no portal layout/sidebar on public pages
    expect(crashErrors()).toEqual([]);
  });
});

describe.each(Object.entries(PORTALS))('%s portal', (role, pages) => {
  test.each(pages)('/%s renders inside the portal layout', async (page) => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ userId: 1, email: `${role}@test.com`, role, profile: { full_name: 'Test User' } }));
    await renderAt(`/${role}/${page}`);
    expect(container.querySelector('#portal-main')).not.toBeNull();
    expect(container.querySelector('footer')).toBeNull(); // public footer not in portals
    expect(container.textContent).toMatch(/Network unavailable|Could not|Failed|couldn’t|Try again|Select a batch|Loading/i);
    expect(crashErrors()).toEqual([]);
  });
});

test('a signed-in user sees the public layout (not the portal sidebar) on public pages', async () => {
  localStorage.setItem('token', 't');
  localStorage.setItem('user', JSON.stringify({ userId: 1, email: 'a@test.com', role: 'admin', profile: {} }));
  await renderAt('/about');
  expect(container.querySelector('#portal-main')).toBeNull();
  expect(container.querySelector('footer')).not.toBeNull();
  expect(container.textContent).toMatch(/My portal/);
});

test('portal routes redirect to login when signed out', async () => {
  await renderAt('/admin/dashboard');
  expect(window.location.pathname).toBe('/login');
});

test('wrong role is sent to its own dashboard', async () => {
  localStorage.setItem('token', 't');
  localStorage.setItem('user', JSON.stringify({ userId: 1, email: 's@test.com', role: 'student', profile: {} }));
  await renderAt('/admin/students');
  expect(window.location.pathname).toBe('/student/dashboard');
});
