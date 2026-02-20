import React from 'react';

/**
 * EmptyState Component
 * 
 * Beautiful empty state placeholder with icon and message
 * 
 * Props:
 * - icon (string): "document", "image", "user", "calendar", "star", "upload" - Default: "document"
 * - title (string, required): Main message
 * - description (string): Additional description
 * - actionText (string): Button text
 * - onAction (function): Button click handler
 * - size (string): "sm", "md", "lg" - Default: "md"
 */

const EmptyState = ({ 
  icon = 'document',
  title,
  description,
  actionText,
  onAction,
  size = 'md'
}) => {
  const icons = {
    document: (
      <svg className="mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    image: (
      <svg className="mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    user: (
      <svg className="mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    calendar: (
      <svg className="mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    star: (
      <svg className="mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    upload: (
      <svg className="mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    )
  };

  const sizes = {
    sm: {
      icon: 'w-16 h-16',
      padding: 'py-8',
      title: 'text-base',
      description: 'text-sm'
    },
    md: {
      icon: 'w-24 h-24',
      padding: 'py-12',
      title: 'text-lg',
      description: 'text-sm'
    },
    lg: {
      icon: 'w-32 h-32',
      padding: 'py-16',
      title: 'text-xl',
      description: 'text-base'
    }
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <div className={`text-center ${sizeConfig.padding}`}>
      <div className={sizeConfig.icon}>
        {icons[icon] || icons.document}
      </div>
      <h3 className={`${sizeConfig.title} font-medium text-gray-700 mt-4 mb-2`}>
        {title}
      </h3>
      {description && (
        <p className={`${sizeConfig.description} text-gray-500 max-w-md mx-auto`}>
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 btn-primary"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
