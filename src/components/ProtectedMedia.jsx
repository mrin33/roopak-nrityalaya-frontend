import React, { useEffect, useState } from 'react';
import { fetchProtectedMediaUrl } from '../services/axiosConfig';

/**
 * Renders a gallery-request upload that may still be pending or rejected.
 * Such files are only served to their owner or an admin, so they are loaded
 * with the session token and displayed through a temporary object URL.
 */
const ProtectedMedia = ({ requestId, path, mediaType, className = '', alt = 'Uploaded media', controls = false }) => {
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState(false);
  const filePath = path || `/gallery-requests/${requestId}/file`;

  useEffect(() => {
    let objectUrl;
    let cancelled = false;
    setFailed(false);
    fetchProtectedMediaUrl(filePath)
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
  }, [filePath]);

  if (failed) {
    return <div className="flex h-full w-full items-center justify-center bg-sand-100 p-4 text-center text-sm text-gray-500">Preview unavailable</div>;
  }
  if (!src) {
    return <div className="skeleton h-full w-full rounded-none" role="status" aria-label="Loading preview" />;
  }
  return mediaType === 'video' ? (
    <video src={src} className={className} controls={controls} />
  ) : (
    <img src={src} alt={alt} className={className} />
  );
};

// Open the full-size file in a new tab (blob URL, token never in the URL).
// Accepts a gallery-request id or an explicit API path.
export const openProtectedMedia = async (requestIdOrPath) => {
  const win = window.open('', '_blank');
  try {
    const path =
      typeof requestIdOrPath === 'string' && requestIdOrPath.startsWith('/')
        ? requestIdOrPath
        : `/gallery-requests/${requestIdOrPath}/file`;
    const url = await fetchProtectedMediaUrl(path);
    if (win) win.location.href = url;
    else window.location.href = url;
  } catch {
    if (win) win.close();
  }
};

export default ProtectedMedia;
