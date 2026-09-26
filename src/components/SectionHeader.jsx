export default function SectionHeader({ emoji, title, subtitle, color }) {
  return (
    <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          width: 56, height: 56, borderRadius: 18,
          background: color + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <div>
        <h2
          style={{
            fontFamily: 'Nunito', fontWeight: 900,
            fontSize: 'clamp(18px,3vw,26px)',
            margin: 0, color: '#1a2e22',
          }}
        >
          {title}
        </h2>
        <div
          style={{
            background: color + '20', color,
            display: 'inline-block', padding: '2px 12px',
            borderRadius: 10, fontSize: 12, fontWeight: 700,
            fontFamily: 'Nunito', marginTop: 4,
          }}
        >
          🎯 {subtitle}
        </div>
      </div>
    </div>
  );
}