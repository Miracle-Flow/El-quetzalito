// Decorative huipil-inspired textile pattern — traditional Guatemalan diamond motif.
// Render as aria-hidden behind content sections at low opacity.
// Pass a unique `patternId` when using more than one instance on the same page.
export default function GuatemalanPattern({
  className,
  patternId = "gt-huipil",
}: {
  className?: string;
  patternId?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="48" height="48">
          {/* outer diamond */}
          <polygon
            points="24,2 46,24 24,46 2,24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* inner diamond */}
          <polygon
            points="24,11 37,24 24,37 11,24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* center cross — common huipil weave motif */}
          <line x1="24" y1="18" x2="24" y2="30" stroke="currentColor" strokeWidth="1" />
          <line x1="18" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="1" />
          {/* corner diamond tips */}
          <circle cx="24" cy="2" r="1.5" fill="currentColor" />
          <circle cx="46" cy="24" r="1.5" fill="currentColor" />
          <circle cx="24" cy="46" r="1.5" fill="currentColor" />
          <circle cx="2" cy="24" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
