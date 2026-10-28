import { schedulesSlotApprovalsChart } from '../../config/schedules';

type PieSlice = { value: number; color: string; label: string };

/** Shared pie panel sizing — between compact and oversized reference targets. */
const PIE_PANEL = 'flex min-h-[320px] w-full flex-col items-center px-5 py-6';
const PIE_SVG =
  'mx-auto w-full max-w-[min(100%,340px)] aspect-square min-h-[210px] max-h-[268px]';

const PIE = {
  vbW: 320,
  vbH: 280,
  cx: 148,
  cy: 132,
  r: 88,
} as const;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function sliceMidAngleDeg(slices: PieSlice[], targetLabel: string, gapDeg: number): number | null {
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
  let angle = 0;
  for (const sl of slices) {
    if (sl.value <= 0) continue;
    const sweep = (sl.value / total) * 360 - gapDeg;
    const start = angle + gapDeg / 2;
    if (sl.label === targetLabel) return start + sweep / 2;
    angle += (sl.value / total) * 360;
  }
  return null;
}

function SolidPie({
  slices,
  cx = 100,
  cy = 100,
  r = 72,
  gapDeg = 1.5,
}: {
  slices: PieSlice[];
  cx?: number;
  cy?: number;
  r?: number;
  gapDeg?: number;
}) {
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
  let angle = 0;
  return (
    <g>
      {slices.map((sl) => {
        if (sl.value <= 0) return null;
        const sweep = (sl.value / total) * 360 - gapDeg;
        const start = angle + gapDeg / 2;
        const end = angle + sweep;
        angle += (sl.value / total) * 360;
        return (
          <path
            key={sl.label}
            d={describeSlice(cx, cy, r, start, end)}
            fill={sl.color}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        );
      })}
    </g>
  );
}

/** Next 30 Days — solid gray pie placeholder (3 wedges). */
export function SchedulesPieEmptyPlaceholder({ title }: { title: string }) {
  const placeholderSlices: PieSlice[] = [
    { value: 1, color: '#e5e7eb', label: 'a' },
    { value: 1, color: '#d1d5db', label: 'b' },
    { value: 1, color: '#eceef1', label: 'c' },
  ];
  return (
    <div className={PIE_PANEL}>
      <p className="w-full text-center text-[15px] font-semibold leading-6 text-[#212121]">{title}</p>
      <svg
        viewBox={`0 0 ${PIE.vbW} ${PIE.vbH}`}
        className={`${PIE_SVG} mt-4`}
        aria-hidden
      >
        <SolidPie
          slices={placeholderSlices}
          cx={PIE.cx}
          cy={PIE.cy}
          r={PIE.r}
          gapDeg={2}
        />
      </svg>
      <p className="mt-4 text-[14px] font-medium text-[#424242]">No data available</p>
      <p className="mt-1 text-[12px] leading-4 text-[#757575]">
        Try selecting a different timeframe
      </p>
    </div>
  );
}

const SCHEDULES_STATUS_SLICES: PieSlice[] = [
  { label: 'Confirmed', value: 0, color: '#22c55e' },
  { label: 'Not Confirmed', value: 0, color: '#eab308' },
  { label: 'To Be Scheduled', value: 5, color: '#64748b' },
  { label: 'Cancelled', value: 2, color: '#ef4444' },
];

function SchedulesOverviewCallouts({
  slices,
  cx,
  cy,
  r,
  gapDeg,
}: {
  slices: PieSlice[];
  cx: number;
  cy: number;
  r: number;
  gapDeg: number;
}) {
  const cancelledAngle = sliceMidAngleDeg(slices, 'Cancelled', gapDeg);
  const tbsAngle = sliceMidAngleDeg(slices, 'To Be Scheduled', gapDeg);
  if (cancelledAngle == null || tbsAngle == null) return null;

  const cancelledEdge = polarToCartesian(cx, cy, r, cancelledAngle);
  const tbsEdge = polarToCartesian(cx, cy, r, tbsAngle);

  /** Label sits fully left of the pie; one horizontal segment to the wedge edge. */
  const cancelledLineEndX = cx - r - 10;
  const cancelledTextY = cancelledEdge.y + 4;
  const tbsElbow = {
    x: tbsEdge.x + (tbsEdge.x >= cx ? 8 : -8),
    y: tbsEdge.y + 10,
  };
  const tbsLabel = {
    x: tbsElbow.x + (tbsEdge.x >= cx ? 2 : -2),
    y: tbsElbow.y + 14,
  };

  return (
    <>
      <line
        x1={cancelledEdge.x}
        y1={cancelledEdge.y}
        x2={cancelledLineEndX}
        y2={cancelledEdge.y}
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      <text
        x={cancelledLineEndX - 4}
        y={cancelledTextY}
        textAnchor="end"
        className="fill-[#ef4444] text-[11px]"
      >
        Cancelled (2)
      </text>
      <polyline
        points={`${tbsEdge.x},${tbsEdge.y} ${tbsElbow.x},${tbsElbow.y} ${tbsElbow.x},${tbsLabel.y - 4}`}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      <text
        x={tbsLabel.x}
        y={tbsLabel.y}
        textAnchor={tbsEdge.x >= cx ? 'start' : 'end'}
        className="fill-[#64748b] text-[11px]"
      >
        To Be Scheduled
      </text>
    </>
  );
}

/** All Upcoming — Schedules Overview with data + legend. */
export function SchedulesPieSchedulesOverview() {
  const pieGap = 1.2;
  return (
    <div className={`${PIE_PANEL} items-stretch`}>
      <div className="w-full text-center">
        <p className="text-[15px] font-semibold leading-6 text-[#212121]">Schedules Overview</p>
        <p className="mt-0.5 text-[12px] leading-4 text-[#757575]">Status of schedules.</p>
      </div>
      <svg
        viewBox={`-22 0 ${PIE.vbW + 38} ${PIE.vbH + 8}`}
        className={`${PIE_SVG} mt-2 overflow-visible`}
        aria-hidden
      >
        <SolidPie
          slices={SCHEDULES_STATUS_SLICES}
          cx={PIE.cx}
          cy={PIE.cy}
          r={PIE.r}
          gapDeg={pieGap}
        />
        <SchedulesOverviewCallouts
          slices={SCHEDULES_STATUS_SLICES}
          cx={PIE.cx}
          cy={PIE.cy}
          r={PIE.r}
          gapDeg={pieGap}
        />
      </svg>
      <ul className="mt-1 flex w-full flex-wrap justify-start gap-x-5 gap-y-1.5 px-1 text-[11px] text-[#424242]">
        {SCHEDULES_STATUS_SLICES.map((sl) => (
          <li key={sl.label} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: sl.color }}
              aria-hidden
            />
            {sl.label} ({sl.value})
          </li>
        ))}
      </ul>
    </div>
  );
}

function SeparatedPlaceholderPie({
  slices,
  cx,
  cy,
  r,
  gapDeg,
  separation,
}: {
  slices: PieSlice[];
  cx: number;
  cy: number;
  r: number;
  gapDeg: number;
  separation: number;
}) {
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
  let angle = 0;
  return (
    <g>
      {slices.map((sl) => {
        const sweep = (sl.value / total) * 360 - gapDeg;
        const start = angle + gapDeg / 2;
        const end = angle + sweep;
        const mid = (start + end) / 2;
        const rad = ((mid - 90) * Math.PI) / 180;
        const ox = separation * Math.cos(rad);
        const oy = separation * Math.sin(rad);
        angle += (sl.value / total) * 360;
        return (
          <path
            key={sl.label}
            d={describeSlice(cx + ox, cy + oy, r, start, end)}
            fill={sl.color}
            stroke="#ffffff"
            strokeWidth="2"
          />
        );
      })}
    </g>
  );
}

/** All Upcoming — onboarding empty exploded solid pie. */
export function SchedulesPieOnboardingEmptyExploded() {
  const slices: PieSlice[] = [
    { value: 1, color: '#e5e7eb', label: 'a' },
    { value: 1, color: '#d1d5db', label: 'b' },
    { value: 1, color: '#cbd5e1', label: 'c' },
    { value: 1, color: '#f1f5f9', label: 'd' },
  ];
  return (
    <div className={PIE_PANEL}>
      <p className="w-full text-center text-[15px] font-semibold leading-6 text-[#212121]">
        Student Onboarding Overview
      </p>
      <svg viewBox={`0 0 ${PIE.vbW} ${PIE.vbH}`} className={`${PIE_SVG} mt-4`} aria-hidden>
        <SeparatedPlaceholderPie
          slices={slices}
          cx={PIE.cx}
          cy={PIE.cy}
          r={PIE.r - 8}
          gapDeg={3}
          separation={8}
        />
      </svg>
      <p className="mt-4 text-[14px] font-medium text-[#424242]">No data available</p>
      <p className="mt-1 text-[12px] leading-4 text-[#757575]">
        Try selecting a different timeframe
      </p>
    </div>
  );
}

const BAR_COLORS = {
  approved: '#f59e0b',
  confirmed: '#3f51b5',
  compliant: '#22c55e',
} as const;

export function SchedulesSlotApprovalsChart() {
  const { months, series } = schedulesSlotApprovalsChart;
  const chartH = 236;
  const maxVal = 6;

  return (
    <div className="px-5 pb-5 pt-2">
      <svg
        viewBox="0 0 902 400"
        className="h-auto w-full max-w-full"
        role="img"
        aria-label="Slot approvals and confirmation bar chart by start month"
      >
        <text x="12" y="196" className="fill-[#757575] text-[11px]">
          Count
        </text>
        {[0, 1, 2, 3, 4, 5, 6].map((tick) => {
          const y = 57 + ((6 - tick) / 6) * chartH;
          return (
            <g key={tick}>
              <line x1="59" y1={y} x2="892" y2={y} stroke="#eceef1" strokeWidth="1" />
              <text x="48" y={y + 4} textAnchor="end" className="fill-[#757575] text-[10px]">
                {tick}
              </text>
            </g>
          );
        })}
        {months.map((label, i) => {
          const groupW = 772 / months.length;
          const x = 74 + i * groupW + groupW * 0.15;
          const barW = groupW * 0.22;
          const [approved, confirmed, compliant] = series[i];
          const bars = [
            { val: approved, color: BAR_COLORS.approved, offset: 0 },
            { val: confirmed, color: BAR_COLORS.confirmed, offset: 1 },
            { val: compliant, color: BAR_COLORS.compliant, offset: 2 },
          ];
          return (
            <g key={label}>
              {bars.map(({ val, color, offset }) => {
                if (val <= 0) return null;
                const h = (val / maxVal) * chartH;
                const bx = x + offset * (barW + 2);
                return (
                  <rect
                    key={offset}
                    x={bx}
                    y={57 + chartH - h}
                    width={barW}
                    height={h}
                    fill={color}
                    rx="1"
                  />
                );
              })}
              <text
                x={74 + i * groupW + groupW / 2}
                y={320}
                textAnchor="middle"
                className="fill-[#424242] text-[9px]"
              >
                {label.replace(' ', '\u00a0')}
              </text>
            </g>
          );
        })}
        <line x1="59" y1="293" x2="892" y2="293" stroke="#d1d5db" strokeWidth="1" />
        <g transform="translate(212, 348)">
          <circle cx="0" cy="0" r="4" fill={BAR_COLORS.approved} />
          <text x="10" y="4" className="fill-[#424242] text-[11px]">
            Schedules Approved
          </text>
          <circle cx="160" cy="0" r="4" fill={BAR_COLORS.confirmed} />
          <text x="170" y="4" className="fill-[#424242] text-[11px]">
            Schedules Confirmed
          </text>
          <circle cx="320" cy="0" r="4" fill={BAR_COLORS.compliant} />
          <text x="330" y="4" className="fill-[#424242] text-[11px]">
            Students Fully Compliant
          </text>
        </g>
      </svg>
    </div>
  );
}
