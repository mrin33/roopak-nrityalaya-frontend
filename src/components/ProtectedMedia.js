import React, { useEffect, useState } from 'react';
import { fetchProtectedMediaUrl } from '../services/axiosConfig';

/**
 * Renders a gallery-request upload that may still be pending or rejected.
 * Such files are only served to their owner or an admin, so they are loaded
 * with the session token and displayed through a temporary object URL.
 */
const ProtectedMedia = ({ requestId, mediaType, className = '', alt = 'Uploaded media', controls = false }) => {
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl;
    let cancelled = false;
    setFailed(false);
    fetchProtectedMediaUrl(`/gallery-requests/${requestId}/file`)
      .then((url) => {
        objectUrl = url;
        if (!cancelled) setSrc(url);
        else URL.revokeObjectURL(url);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [requestId]);

  if (failed) {
    return <div className="text-sm text-gray-500 p-4 text-center">Preview unavailable</div>;
  }
  if (!src) {
    return <div className="w-full h-full animate-pulse bg-gray-200" aria-label="Loading preview" />;
  }
  return mediaType === 'video' ? (
    <video src={src} className={className} controls={controls} />
  ) : (
    <img src={src} alt={alt} className={className} />
  );
};

// Open the full-size file in a new tab (blob URL, token never in the URL).
export const openProtectedMedia = async (requestId) => {
  const win = window.open('', '_blank');
  try {
    const url = await fetchProtectedMediaUrl(`/gallery-requests/${requestId}/file`);
    if (win) win.location.href = url;
    else window.location.href = url;
  } catch {
    if (win) win.close();
  }
};

export default ProtectedMedia;
