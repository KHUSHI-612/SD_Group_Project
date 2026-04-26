export default function ElectrifyLogo({
  className = "h-8 w-8",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ringGradHome" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#8BE28A" />
          <stop offset="100%" stopColor="#22C7FF" />
        </linearGradient>
        <linearGradient id="boltGradHome" x1="20" y1="20" x2="80" y2="90">
          <stop offset="0%" stopColor="#7FE5A0" />
          <stop offset="100%" stopColor="#18C8FF" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="41" stroke="url(#ringGradHome)" strokeWidth="6" />

      <path
        d="M55 16L25 55H46L39 83L73 42H56L55 16Z"
        fill="url(#boltGradHome)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}