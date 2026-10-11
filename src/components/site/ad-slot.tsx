import { cn } from "@/lib/utils";

interface AdSlotProps {
  /** The ad key from highrevenueformat.com (e.g. "b0f955d2..."). */
  adKey: string;
  /** Banner width in pixels. */
  width: number;
  /** Banner height in pixels. */
  height: number;
  /** Accessibility/visible label for the ad area. */
  label?: string;
  /** Extra className for the outer wrapper. */
  className?: string;
}

/**
 * Ad slot for highrevenueformat.com banner ads.
 *
 * Each ad is isolated inside its own <iframe> via srcDoc. This gives every
 * ad its own `window` (and therefore its own `atOptions` global), so
 * multiple ads on the same page never conflict. It also prevents
 * duplicate script execution during React re-renders or client-side
 * navigation: React treats the iframe as a static element and only
 * recreates it when the component unmounts (route change), which is the
 * desired behaviour.
 *
 * The exact ad script (atOptions + invoke.js) is injected verbatim into
 * the iframe document — URLs, keys, and parameters are not modified.
 */
export function AdSlot({
  adKey,
  width,
  height,
  label = "Advertisement",
  className,
}: AdSlotProps) {
  // Build the iframe document with the exact ad code, unchanged.
  const srcDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}body{display:flex;align-items:center;justify-content:center;width:${width}px;height:${height}px;max-width:100%;}</style></head><body><script>atOptions={'key':'${adKey}','format':'iframe','height':${height},'width':${width},'params':{}};</script><script src="https://www.highrevenueformat.com/${adKey}/invoke.js"></script></body></html>`;

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        className,
      )}
      role="complementary"
      aria-label={label}
    >
      <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400/60">
        {label}
      </span>
      <div
        style={{ maxWidth: width, width: "100%" }}
        className="overflow-hidden"
      >
        <iframe
          srcDoc={srcDoc}
          width={width}
          height={height}
          title={label}
          loading="lazy"
          style={{
            border: "none",
            display: "block",
            margin: "0 auto",
            maxWidth: "100%",
            height: `${height}px`,
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-top-navigation-by-user-activation"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
