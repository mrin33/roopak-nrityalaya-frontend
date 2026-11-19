/** Navigation for the public site and each portal (single source of truth). */

export const PUBLIC_NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Teachers', to: '/teachers' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Notices', to: '/notices' },
  { label: 'Contact', to: '/contact' },
];

export const PORTAL_NAV = {
  student: {
    label: 'Student Portal',
    sections: [
      {
        items: [
          { label: 'Dashboard', to: '/student/dashboard', icon: 'home' },
          { label: 'Schedule', to: '/student/schedule', icon: 'calendar' },
          { label: 'Attendance', to: '/student/attendance', icon: 'clipboardCheck' },
          { label: 'Fees', to: '/student/fees', icon: 'cash' },
        ],
      },
      {
        title: 'Learning',
        items: [
          { label: 'Practice Log', to: '/student/activity-log', icon: 'clipboardList' },
          { label: 'Reviews', to: '/student/reviews', icon: 'star' },
          { label: 'Makeup Classes', to: '/student/makeup-classes', icon: 'refresh' },
          { label: 'Resources', to: '/student/resources', icon: 'book' },
          { label: 'Share Photos', to: '/student/gallery-upload', icon: 'upload' },
        ],
      },
    ],
  },
  teacher: {
    label: 'Teacher Portal',
    sections: [
      {
        items: [
          { label: 'Dashboard', to: '/teacher/dashboard', icon: 'home' },
          { label: 'Attendance', to: '/teacher/attendance', icon: 'clipboardCheck' },
          { label: 'My Batches', to: '/teacher/batches', icon: 'collection' },
          { label: 'My Students', to: '/teacher/students', icon: 'users' },
        ],
      },
      {
        title: 'Teaching',
        items: [
          { label: 'Monthly Reviews', to: '/teacher/review-students', icon: 'star' },
          { label: 'Batch Transfers', to: '/teacher/batch-transfer', icon: 'switch' },
          { label: 'Makeup Requests', to: '/teacher/makeup-requests', icon: 'refresh' },
          { label: 'Resources', to: '/teacher/resources', icon: 'book' },
        ],
      },
      {
        title: 'Account',
        items: [{ label: 'Profile', to: '/teacher/profile', icon: 'userCircle' }],
      },
    ],
  },
  admin: {
    label: 'Admin',
    sections: [
      {
        items: [
          { label: 'Dashboard', to: '/admin/dashboard', icon: 'home' },
          { label: 'Analytics', to: '/admin/analytics', icon: 'chart' },
        ],
      },
      {
        title: 'People',
        items: [
          { label: 'Students', to: '/admin/students', icon: 'users' },
          { label: 'Teachers', to: '/admin/teachers', icon: 'teacher' },
          { label: 'Batches', to: '/admin/batches', icon: 'collection' },
          { label: 'Status History', to: '/admin/status-changes', icon: 'document' },
        ],
      },
      {
        title: 'Operations',
        items: [
          { label: 'Fees', to: '/admin/fees', icon: 'cash' },
          { label: 'Notices', to: '/admin/notices', icon: 'megaphone' },
          { label: 'Messages', to: '/admin/messages', icon: 'mail' },
        ],
      },
      {
        title: 'Gallery',
        items: [
          { label: 'Gallery', to: '/admin/gallery', icon: 'photo' },
          { label: 'Upload Requests', to: '/admin/gallery-requests', icon: 'inbox' },
        ],
      },
    ],
  },
};

export const dashboardPath = (role) =>
  ({ admin: '/admin/dashboard', teacher: '/teacher/dashboard', student: '/student/dashboard' }[role] || '/');

/** Title of the current portal page (for the top bar and document title). */
export const portalPageTitle = (role, pathname) => {
  const nav = PORTAL_NAV[role];
  if (!nav) return '';
  for (const section of nav.sections) {
    const hit = section.items.find((i) => pathname === i.to || pathname.startsWith(`${i.to}/`));
    if (hit) return hit.label;
  }
  return '';
};
