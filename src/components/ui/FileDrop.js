import React, { useId, useRef, useState } from 'react';
import Icon from './Icon';

const sizeLabel = (bytes) =>
  bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * Accessible file picker with drag-and-drop. The underlying <input type=file>
 * stays in the tab order (visually hidden) so it works with the keyboard.
 */
const FileDrop = ({ file, onChange, accept, hint, label = 'Choose a file', required = false, maxBytes }) => {
  const id = useId();
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState('');

  const pick = (f) => {
    setError('');
    if (!f) return onChange(null);
    if (maxBytes && f.size > maxBytes) {
      setError(`This file is ${sizeLabel(f.size)}; the limit is ${sizeLabel(maxBytes)}.`);
      return onChange(null);
    }
    return onChange(f);
  };

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-within:border-secondary-500 ${
          over ? 'border-primary bg-primary-50/60' : 'border-sand-300 bg-sand-50 hover:bg-sand-100'
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          required={required && !file}
          onChange={(e) => pick(e.target.files?.[0])}
          className="sr-only"
        />
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-card">
          <Icon name="upload" />
        </span>
        {file ? (
          <span className="mt-3 max-w-full truncate text-sm font-semibold text-accent">{file.name}</span>
        ) : (
          <span className="mt-3 text-sm font-medium text-accent">
            {label} <span className="font-normal text-gray-500">or drag it here</span>
          </span>
        )}
        <span className="mt-1 text-xs text-gray-500">{file ? sizeLabel(file.size) : hint}</span>
      </label>
      {file && (
        <button
          type="button"
          className="mt-2 text-xs font-medium text-gray-600 hover:text-red-700"
          onClick={() => {
            if (inputRef.current) inputRef.current.value = '';
            pick(null);
          }}
        >
          Remove file
        </button>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileDrop;
