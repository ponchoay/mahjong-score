type LogoIconProps = {
  className?: string;
  showBackground?: boolean;
};

export function LogoIcon({
  className = "",
  showBackground = true,
}: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      {showBackground && <circle cx="32" cy="32" r="30" fill="#0d9488" />}

      <g transform="translate(32, 32) scale(1.15) translate(-32, -32) translate(1, 3)">
        <g transform="rotate(-12, 28, 32)">
          <rect x="17" y="14" width="26" height="36" rx="3" ry="3" fill="#0a7068" />
          <rect x="15" y="12" width="26" height="36" rx="3" ry="3" fill="#d4d0c8" />
          <rect x="15" y="11" width="26" height="35" rx="3" ry="3" fill="#f5f2eb" />
          <circle cx="22.5" cy="20.5" r="3.2" fill="#0d9488" />
          <circle cx="33.5" cy="20.5" r="3.2" fill="#0d9488" />
          <circle cx="28" cy="28.5" r="3.2" fill="#0d9488" />
          <circle cx="22.5" cy="36.5" r="3.2" fill="#0d9488" />
          <circle cx="33.5" cy="36.5" r="3.2" fill="#0d9488" />
        </g>

        <g transform="rotate(30, 36, 32)">
          <rect x="35.5" y="11" width="7" height="38" rx="2.5" ry="2.5" fill="#0a7068" />
          <rect x="34" y="9.5" width="7" height="38" rx="2.5" ry="2.5" fill="#f5f2eb" />
          <rect x="34" y="9.5" width="7" height="38" rx="2.5" ry="2.5" fill="none" stroke="#c8c4b8" strokeWidth="0.5" />
          <circle cx="37.5" cy="28.5" r="2.0" fill="#e63b2e" />
        </g>
      </g>
    </svg>
  );
}
