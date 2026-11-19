/**
 * Academy information shown on the public website.
 *
 * Only verified details belong here. Anything left `null` is simply not
 * rendered (no "XXXX" placeholders are shown to visitors). Fill these in
 * once the academy confirms them.
 */
const academy = {
  name: 'Roopak Nrityalaya',
  tagline: 'Kathak Dance Academy',
  city: 'Pune, Maharashtra, India',

  // TODO(academy): full street address, e.g. 'Building, Road, Area, Pune 411001'
  address: null,
  // TODO(academy): public phone numbers, e.g. ['+91 98xxx xxxxx']
  phones: [],
  // Present on the previous site; confirm this mailbox is monitored.
  emails: ['info@roopaknrityalaya.com'],
  // TODO(academy): office / class hours, e.g. 'Mon–Sat, 9:00 AM – 8:00 PM'
  hours: null,
  // TODO(academy): Google Maps "share → embed" URL for the studio location
  mapEmbedUrl: null,

  // TODO(academy): official profile URLs. Empty entries are hidden.
  social: {
    instagram: null,
    facebook: null,
    youtube: null,
  },

  // TODO(academy): founder details and portrait for the home page.
  founder: {
    name: null,
    title: 'Founder & Artistic Director',
    photoUrl: null,
  },
};

export default academy;
