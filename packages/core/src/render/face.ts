export interface FaceOptions {
  /** Horizontal centre of the face in the 200x200 viewBox. Default 100. */
  cx?: number;
  eyeY: number;
  /** Half the distance between the eyes. */
  eyeDX: number;
  eyeR: number;
  mouthY: number;
  mouthW: number;
  sclera?: string;
  pupil?: string;
  glint?: string;
  /** Stroke colour for mouth, brows and the closed/happy eye arcs. */
  line?: string;
  /** Stroke colour for the happy/closed eye arcs only. Defaults to `line`. */
  eyeLine?: string;
  /** Fill for open mouths. */
  mouthFill?: string;
  tear?: string;
  browY?: number;
}

const n = (v: number): number => Math.round(v * 100) / 100;

/**
 * Standard expressive face. Emits every eye/mouth/brow variant; the shared CSS
 * shows the right ones for the current `data-expression` / `data-action`.
 */
export function face(o: FaceOptions): string {
  const cx = o.cx ?? 100;
  const R = o.eyeR;
  const W = o.mouthW;
  const sclera = o.sclera ?? "#ffffff";
  const pupil = o.pupil ?? "#1b1b2f";
  const glint = o.glint ?? "#ffffff";
  const line = o.line ?? "#1b1b2f";
  const eyeLine = o.eyeLine ?? line;
  const mouthFill = o.mouthFill ?? "#5a2a3a";
  const tear = o.tear ?? "#7dd3fc";
  const browY = o.browY ?? o.eyeY - R * 1.7;
  const range = n(R * 0.38);
  const sw = n(Math.max(2.5, R * 0.28));

  const eye = (x: number, side: "l" | "r") => `
<g class="tp-eye tp-eye-${side}" transform="translate(${n(x)} ${n(o.eyeY)})">
  <g class="tp-eye-open">
    <ellipse class="tp-sclera" rx="${n(R)}" ry="${n(R * 1.1)}" fill="${sclera}"/>
    <g class="tp-pupil" style="--tp-range:${range}px">
      <circle r="${n(R * 0.55)}" fill="${pupil}"/>
      <circle cx="${n(-R * 0.2)}" cy="${n(-R * 0.22)}" r="${n(R * 0.18)}" fill="${glint}"/>
    </g>
  </g>
  <path class="tp-eye-happy" d="M ${n(-R * 0.85)} ${n(R * 0.35)} Q 0 ${n(-R * 0.95)} ${n(R * 0.85)} ${n(R * 0.35)}" fill="none" stroke="${eyeLine}" stroke-width="${sw}" stroke-linecap="round"/>
  <path class="tp-eye-closed" d="M ${n(-R * 0.85)} ${n(-R * 0.1)} Q 0 ${n(R * 0.55)} ${n(R * 0.85)} ${n(-R * 0.1)}" fill="none" stroke="${eyeLine}" stroke-width="${sw}" stroke-linecap="round"/>
</g>`;

  const arch = (dy: number) =>
    `M ${n(-R * 0.8)} ${n(dy)} Q 0 ${n(dy - R * 0.5)} ${n(R * 0.8)} ${n(dy)}`;
  const flat = (dy: number) => `M ${n(-R * 0.8)} ${n(dy)} L ${n(R * 0.8)} ${n(dy)}`;
  /** Slanted brow: `inner` is the y offset of the end nearest the nose. */
  const slant = (side: "l" | "r", outer: number, inner: number) => {
    const o1 = side === "l" ? -R * 0.8 : R * 0.8;
    const i1 = side === "l" ? R * 0.8 : -R * 0.8;
    return `M ${n(o1)} ${n(outer)} L ${n(i1)} ${n(inner)}`;
  };
  const brow = (x: number, d: string) =>
    `<path transform="translate(${n(x)} ${n(browY)})" d="${d}"/>`;
  const lx = cx - o.eyeDX;
  const rx = cx + o.eyeDX;
  const brows = (cls: string, left: string, right: string) =>
    `<g class="tp-brows tp-b-${cls}" fill="none" stroke="${line}" stroke-width="${sw}" stroke-linecap="round">${brow(lx, left)}${brow(rx, right)}</g>`;

  return `
<g class="tp-face">
${eye(lx, "l")}
${eye(rx, "r")}
${brows("curious", arch(0), arch(0))}
${brows("thinking", flat(1), arch(-1))}
${brows("surprised", arch(-R * 0.6), arch(-R * 0.6))}
${brows("confused", arch(-R * 0.2), slant("r", R * 0.1, -R * 0.2))}
${brows("sad", slant("l", R * 0.3, -R * 0.3), slant("r", R * 0.3, -R * 0.3))}
<path class="tp-tear" transform="translate(${n(lx + R * 0.4)} ${n(o.eyeY + R * 1.1)})" d="M 0 0 Q ${n(R * 0.4)} ${n(R * 0.6)} 0 ${n(R * 0.9)} Q ${n(-R * 0.4)} ${n(R * 0.6)} 0 0 Z" fill="${tear}"/>
<g class="tp-mouth" transform="translate(${n(cx)} ${n(o.mouthY)})" fill="none" stroke="${line}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
  <path class="tp-m tp-m-idle" d="M ${n(-W * 0.5)} 0 Q 0 ${n(W * 0.3)} ${n(W * 0.5)} 0"/>
  <path class="tp-m tp-m-happy" d="M ${n(-W)} 0 Q 0 ${n(W * 1.2)} ${n(W)} 0 Z" fill="${mouthFill}"/>
  <ellipse class="tp-m tp-m-curious" cy="${n(W * 0.15)}" rx="${n(W * 0.22)}" ry="${n(W * 0.26)}" fill="${mouthFill}"/>
  <path class="tp-m tp-m-thinking" d="M ${n(-W * 0.45)} ${n(W * 0.1)} L ${n(W * 0.45)} ${n(-W * 0.1)}"/>
  <path class="tp-m tp-m-confused" d="M ${n(-W * 0.7)} 0 q ${n(W * 0.35)} ${n(-W * 0.4)} ${n(W * 0.7)} 0 t ${n(W * 0.7)} 0"/>
  <ellipse class="tp-m tp-m-surprised" cy="${n(W * 0.2)}" rx="${n(W * 0.3)}" ry="${n(W * 0.4)}" fill="${mouthFill}"/>
  <path class="tp-m tp-m-sad" d="M ${n(-W * 0.55)} ${n(W * 0.3)} Q 0 ${n(-W * 0.2)} ${n(W * 0.55)} ${n(W * 0.3)}"/>
  <path class="tp-m tp-m-sleepy" d="M ${n(-W * 0.3)} ${n(W * 0.1)} L ${n(W * 0.3)} ${n(W * 0.1)}"/>
</g>
</g>`;
}

export interface FxOptions {
  /** Where the status indicator (?, !, zzz, spinner) sits. */
  x: number;
  y: number;
}

/** Status indicators and celebration confetti shared by all characters. */
export function fx(o: FxOptions): string {
  const piece = (x: number, y: number, dx: number, dy: number, color: string, i: number) =>
    `<rect x="${x}" y="${y}" width="6" height="6" rx="1.5" fill="${color}" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${i * 0.08}s"/>`;
  const colors = ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#c77dff", "#ff9f45"];
  const pieces = [
    [60, 40, -22, -26],
    [140, 38, 24, -28],
    [100, 20, 0, -34],
    [40, 90, -30, -8],
    [158, 88, 30, -10],
    [84, 30, -12, -30],
    [120, 28, 14, -30],
    [50, 60, -28, -18],
  ]
    .map(([x, y, dx, dy], i) => piece(x!, y!, dx!, dy!, colors[i % colors.length]!, i))
    .join("");

  return `
<g class="tp-fx" transform="translate(${n(o.x)} ${n(o.y)})">
  <g class="tp-fxi tp-fx-think" fill="var(--tp-accent)">
    <circle class="tp-dot" cx="0" cy="0" r="3.2"/><circle class="tp-dot" cx="10" cy="0" r="3.2"/><circle class="tp-dot" cx="20" cy="0" r="3.2"/>
  </g>
  <text class="tp-fxi tp-fx-confused" y="8" font-size="26" font-weight="800" font-family="system-ui,sans-serif" fill="var(--tp-accent)">?</text>
  <text class="tp-fxi tp-fx-surprised" y="8" font-size="28" font-weight="800" font-family="system-ui,sans-serif" fill="var(--tp-accent)">!</text>
  <g class="tp-fxi tp-fx-sleepy" font-family="system-ui,sans-serif" font-weight="800" fill="var(--tp-accent)">
    <text class="tp-z tp-z1" x="0" y="10" font-size="14">z</text>
    <text class="tp-z tp-z2" x="10" y="-2" font-size="18">Z</text>
  </g>
  <g class="tp-fxi tp-fx-loading">
    <circle class="tp-spin" cx="8" cy="0" r="8" fill="none" stroke="var(--tp-accent)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="26 40"/>
  </g>
</g>
<g class="tp-confetti">${pieces}</g>`;
}
