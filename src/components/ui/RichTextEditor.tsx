"use client";

import React, { useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Enter description...',
  className = '',
}) => {
  const modules = {
    toolbar: [
      ['bold', 'italic'],
    ],
  };

  const formats = ['bold', 'italic'];

  useEffect(() => {
    // Apply dark theme styles to Quill editor
    const style = document.createElement('style');
    style.textContent = `
      .ql-toolbar.ql-snow {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.75rem 0.75rem 0 0;
        background: rgba(255, 255, 255, 0.05);
      }
      .ql-toolbar.ql-snow .ql-stroke {
        stroke: rgba(255, 255, 255, 0.6);
      }
      .ql-toolbar.ql-snow .ql-fill {
        fill: rgba(255, 255, 255, 0.6);
      }
      .ql-toolbar.ql-snow .ql-picker {
        color: rgba(255, 255, 255, 0.6);
      }
      .ql-toolbar.ql-snow button:hover .ql-stroke {
        stroke: rgba(255, 255, 255, 0.9);
      }
      .ql-toolbar.ql-snow button.ql-active .ql-stroke {
        stroke: hsl(var(--primary));
      }
      .ql-container.ql-snow {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-top: none;
        border-radius: 0 0 0.75rem 0.75rem;
        background: rgba(255, 255, 255, 0.03);
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.875rem;
      }
      .ql-editor.ql-blank::before {
        color: rgba(255, 255, 255, 0.3);
        font-style: normal;
      }
      .ql-editor p {
        margin-bottom: 0.5em;
      }
      .ql-editor p:last-child {
        margin-bottom: 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        theme="snow"
        style={{ height: '120px' }}
      />
    </div>
  );
};
