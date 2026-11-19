import React from 'react';

// Footer for server-paginated lists: "Showing 200 of 640" plus a Load more button.
const LoadMore = ({ loaded, total, loading, onLoadMore, noun = 'records' }) => {
  if (!total || loaded >= total) return null;
  return (
    <div className="mt-4 flex flex-col items-center gap-2 text-sm text-gray-600" role="status">
      <p>
        Showing {loaded} of {total} {noun}. Totals and counts above reflect the loaded {noun} only.
      </p>
      <button type="button" onClick={onLoadMore} disabled={loading} className="btn-secondary btn-sm">
        {loading ? 'Loading…' : 'Load more'}
      </button>
    </div>
  );
};

export default LoadMore;
