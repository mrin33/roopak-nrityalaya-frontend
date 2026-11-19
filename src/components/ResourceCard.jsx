import React from 'react';
import Icon from './ui/Icon';
import { formatDate } from '../utils/date';

export const RESOURCE_TYPES = [
  ['video', 'Videos', 'video'],
  ['audio', 'Audio', 'music'],
  ['document', 'Documents', 'document'],
  ['image', 'Images', 'photo'],
];
const ICON = Object.fromEntries(RESOURCE_TYPES.map(([v, , i]) => [v, i]));

/** Learning resource tile (shared by the student and teacher portals). */
const ResourceCard = ({ resource: r, onOpen, actions }) => (
  <article className="card flex flex-col">
    <div className="flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
        <Icon name={r.is_external ? 'link' : ICON[r.resource_type] || 'document'} className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-body text-base font-semibold leading-snug text-accent">{r.title}</h3>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
          <span className="badge-neutral capitalize">{r.resource_type || 'document'}</span>
          {r.is_external && <span className="badge-info">Link</span>}
          {r.file_size && <span>{r.file_size}</span>}
        </p>
      </div>
    </div>
    {r.description && <p className="mt-3 line-clamp-3 text-sm text-gray-600">{r.description}</p>}
    <p className="mt-3 text-xs text-gray-500">
      {r.uploaded_by_name ? `${r.uploaded_by_name} · ` : ''}
      {r.level_name || 'All levels'} · {formatDate(r.created_at, { day: 'numeric', month: 'short', year: 'numeric' })}
    </p>
    <div className="mt-auto flex gap-2 pt-4">
      <button type="button" onClick={() => onOpen(r)} className="btn-primary flex-1">
        <Icon name={r.is_external ? 'external' : 'eye'} className="h-4 w-4" />
        {r.is_external ? 'Open link' : 'Open'}
      </button>
      {actions}
    </div>
  </article>
);

export default ResourceCard;
