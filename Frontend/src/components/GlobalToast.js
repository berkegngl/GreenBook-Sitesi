import React from 'react';

export default function GlobalToast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 32,
      right: 32,
      zIndex: 9999,
      minWidth: 240,
      background: toast.type === 'success' ? '#1a7f37' : '#d32f2f',
      color: '#fff',
      padding: '16px 32px',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      fontWeight: 500,
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      animation: 'fadeIn 0.3s',
      transition: 'opacity 0.3s',
    }}>
      {toast.type === 'success' ? (
        <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4 4-2-2"/></svg>
      ) : (
        <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
      )}
      <span>{toast.message}</span>
      <button onClick={onClose} style={{background: 'none', border: 'none', color: '#fff', marginLeft: 16, fontSize: 18, cursor: 'pointer'}}>×</button>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px);} to { opacity: 1; transform: translateY(0);} }
      `}</style>
    </div>
  );
} 