import React from 'react';

export default function ModalNotification({
  isOpen,
  onClose,
  title,
  message,
  type = 'info', // 'success' | 'warning' | 'error' | 'info'
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
  icon,
}) {
  if (!isOpen) return null;

  const typeConfig = {
    success: { bg: '#D4F0E3', color: '#166534', btnBg: '#2AA168', icon: '✅' },
    warning: { bg: '#FEF9E0', color: '#854D0E', btnBg: '#F5C03A', btnColor: '#1a2e22', icon: '⚠️' },
    error:   { bg: '#FEE2E2', color: '#9A3412', btnBg: '#EF4444', icon: '❌' },
    info:    { bg: '#DBF0FF', color: '#1E40AF', btnBg: '#3B8FD4', icon: '💡' },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(26, 46, 34, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 24,
          padding: '28px 24px',
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          fontFamily: 'Nunito, sans-serif',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: config.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 16px',
          }}
        >
          {icon || config.icon}
        </div>

        {title && (
          <h3
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              fontSize: 18,
              color: '#1a2e22',
              margin: '0 0 8px',
            }}
          >
            {title}
          </h3>
        )}

        {message && (
          <p
            style={{
              fontSize: 14,
              color: '#4A7060',
              lineHeight: 1.5,
              margin: '0 0 24px',
              fontWeight: 600,
            }}
          >
            {message}
          </p>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {cancelText && (
            <button
              type="button"
              onClick={() => {
                if (onCancel) onCancel();
                onClose();
              }}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: 30,
                border: '2px solid #E6F5EC',
                background: 'white',
                color: '#6B9E80',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 30,
              border: 'none',
              background: config.btnBg,
              color: config.btnColor || 'white',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: `0 4px 14px ${config.btnBg}44`,
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
