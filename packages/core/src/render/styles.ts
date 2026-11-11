/**
 * Shared stylesheet for every character. Expressions are driven purely by
 * `data-expression` / `data-action` attributes on the root <svg>, and eye/head
 * tracking by the `--tp-look-x` / `--tp-look-y` CSS variables (-1..1).
 * Expression poses use the individual `scale`/`translate`/`rotate` properties
 * so idle animations (which use `transform`) never fight them.
 */
export const MASCOT_CSS = `
.tp-root{display:block;overflow:visible;--tp-look-x:0;--tp-look-y:0;--tp-bias-x:0;--tp-bias-y:0;--tp-accent:#f5a623}
.tp-root[data-theme="light"]{filter:drop-shadow(0 4px 8px rgba(20,30,60,.18))}
.tp-root[data-theme="dark"]{filter:drop-shadow(0 4px 12px rgba(0,0,0,.55))}
.tp-root .tp-eye-open,.tp-root .tp-pupil,.tp-root .tp-spin,.tp-root .tp-dot,.tp-root .tp-z,.tp-root .tp-confetti rect{transform-box:fill-box;transform-origin:center}
/* Expression poses ease; cursor-driven movement (pupil translate, head) does
   not, because the tracker already smooths it. Double smoothing feels laggy. */
.tp-root .tp-eye-open,.tp-root .tp-mouth{transition:scale .22s ease,translate .22s ease}
.tp-root .tp-pupil{transition:scale .22s ease}

.tp-root .tp-m,.tp-root .tp-brows,.tp-root .tp-eye-happy,.tp-root .tp-eye-closed,.tp-root .tp-fxi,.tp-root .tp-tear,.tp-root .tp-confetti{display:none}
.tp-root .tp-pupil{translate:calc((var(--tp-look-x) + var(--tp-bias-x)) * var(--tp-range)) calc((var(--tp-look-y) + var(--tp-bias-y)) * var(--tp-range))}
.tp-root[data-head="on"] .tp-head{transform-origin:100px 120px;translate:calc(var(--tp-look-x) * 3px) calc(var(--tp-look-y) * 2px);rotate:calc(var(--tp-look-x) * 3deg)}

/* mouths */
.tp-root[data-expression="idle"] .tp-m-idle,
.tp-root[data-expression="happy"] .tp-m-happy,
.tp-root[data-expression="curious"] .tp-m-curious,
.tp-root[data-expression="thinking"] .tp-m-thinking,
.tp-root[data-expression="confused"] .tp-m-confused,
.tp-root[data-expression="surprised"] .tp-m-surprised,
.tp-root[data-expression="sad"] .tp-m-sad,
.tp-root[data-expression="sleepy"] .tp-m-sleepy{display:inline}

/* brows */
.tp-root[data-expression="curious"] .tp-b-curious,
.tp-root[data-expression="thinking"] .tp-b-thinking,
.tp-root[data-expression="surprised"] .tp-b-surprised,
.tp-root[data-expression="confused"] .tp-b-confused,
.tp-root[data-expression="sad"] .tp-b-sad{display:inline}

/* eye poses */
.tp-root[data-expression="curious"] .tp-eye-open{scale:1.12}
.tp-root[data-expression="surprised"] .tp-eye-open{scale:1.3}
.tp-root[data-expression="surprised"] .tp-pupil{scale:.75}
.tp-root[data-expression="sleepy"] .tp-eye-open{scale:1 .4}
.tp-root[data-expression="confused"] .tp-eye-l .tp-eye-open{scale:1.18}
.tp-root[data-expression="confused"] .tp-eye-r .tp-eye-open{scale:.85}
.tp-root[data-expression="sad"] .tp-eye-open{scale:1 .88;translate:0 2px}
.tp-root[data-expression="thinking"]{--tp-bias-x:.8;--tp-bias-y:-.9}
.tp-root[data-expression="happy"] .tp-eye-open{display:none}
.tp-root[data-expression="happy"] .tp-eye-happy{display:inline}
.tp-root[data-expression="sad"] .tp-tear{display:inline}

/* effects */
.tp-root[data-expression="thinking"] .tp-fx-think,
.tp-root[data-expression="confused"] .tp-fx-confused,
.tp-root[data-expression="surprised"] .tp-fx-surprised,
.tp-root[data-expression="sleepy"] .tp-fx-sleepy{display:inline}

/* actions (override expression visuals) */
.tp-root[data-action="loading"] .tp-fx-think,
.tp-root[data-action="loading"] .tp-fx-sleepy{display:none}
.tp-root[data-action="loading"] .tp-fx-loading{display:inline}
.tp-root[data-action="celebrating"] .tp-eye-open,
.tp-root[data-action="sleeping"] .tp-eye-open{display:none}
.tp-root[data-action="celebrating"] .tp-eye-happy,
.tp-root[data-action="sleeping"] .tp-eye-closed{display:inline}
.tp-root[data-action="celebrating"] .tp-m{display:none}
.tp-root[data-action="celebrating"] .tp-m-happy{display:inline}
.tp-root[data-action="celebrating"] .tp-confetti{display:inline}
.tp-root[data-action="celebrating"] .tp-fxi{display:none}
.tp-root[data-action="sleeping"] .tp-fx-sleepy{display:inline}
.tp-root[data-action="looking-left"]{--tp-bias-x:-1;--tp-bias-y:0}
.tp-root[data-action="looking-right"]{--tp-bias-x:1;--tp-bias-y:0}

/* animation */
.tp-root .tp-float{animation:tp-bob 3.2s ease-in-out infinite}
.tp-root .tp-eye-open{animation:tp-blink 5s infinite}
.tp-root[data-action="blinking"] .tp-eye-open{animation-duration:.9s}
.tp-root[data-action="loading"] .tp-spin{animation:tp-rotate .8s linear infinite}
.tp-root[data-action="celebrating"] .tp-float{animation:tp-jump .55s ease-in-out infinite}
.tp-root[data-action="celebrating"] .tp-confetti rect{animation:tp-pop 1.1s ease-out infinite}
.tp-root[data-action="waving"] .tp-wave-arm{animation:tp-wave .55s ease-in-out infinite alternate}
.tp-root[data-expression="thinking"] .tp-dot{animation:tp-dots 1.2s ease-in-out infinite}
.tp-root[data-expression="thinking"] .tp-dot:nth-child(2){animation-delay:.2s}
.tp-root[data-expression="thinking"] .tp-dot:nth-child(3){animation-delay:.4s}
.tp-root .tp-fx-sleepy .tp-z{animation:tp-z 2.4s ease-in-out infinite}
.tp-root .tp-fx-sleepy .tp-z2{animation-delay:1.2s}
.tp-root[data-expression="sleepy"] .tp-float,.tp-root[data-action="sleeping"] .tp-float{animation-duration:5s}

/* host + speech bubble (HTML, outside the svg) */
.tp-host{pointer-events:none;box-sizing:border-box}
.tp-host .tp-root{pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent}
.tp-bubble{--tp-bubble-bg:#ffffff;--tp-bubble-fg:#1f2433;position:absolute;bottom:calc(100% + 10px);right:0;width:max-content;max-width:220px;padding:8px 12px;border-radius:14px;background:var(--tp-bubble-bg);color:var(--tp-bubble-fg);font:500 13px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 6px 24px rgba(20,30,60,.18);pointer-events:none;animation:tp-bubble-in .18s ease-out}
.tp-bubble::after{content:"";position:absolute;top:100%;right:28px;border:7px solid transparent;border-top-color:var(--tp-bubble-bg)}
.tp-bubble[data-align="left"]{right:auto;left:0}
.tp-bubble[data-align="left"]::after{right:auto;left:28px}
.tp-bubble[data-theme="dark"]{--tp-bubble-bg:#232a3b;--tp-bubble-fg:#eef1f8;box-shadow:0 6px 24px rgba(0,0,0,.45)}
@keyframes tp-bubble-in{from{opacity:0;transform:translateY(4px) scale(.96)}to{opacity:1;transform:none}}

@keyframes tp-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes tp-jump{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes tp-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.08)}}
@keyframes tp-rotate{to{transform:rotate(360deg)}}
@keyframes tp-dots{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes tp-z{0%{opacity:0;transform:translate(0,6px)}30%{opacity:1}100%{opacity:0;transform:translate(6px,-12px)}}
@keyframes tp-pop{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(200deg)}}
@keyframes tp-wave{from{transform:rotate(-12deg)}to{transform:rotate(38deg)}}

@media (prefers-reduced-motion: reduce){
  .tp-root *,.tp-bubble{animation:none !important;transition:none !important}
}
.tp-root[data-motion="off"] *{animation:none !important;transition:none !important}
`;
