import { useEffect, useMemo, useRef, useState } from "react";

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

function rgbToHex(red: number, green: number, blue: number): string {
  return [red, green, blue]
    .map((channel) =>
      Math.round(Math.max(0, Math.min(255, channel)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
}

function rgbToHsv(
  red: number,
  green: number,
  blue: number,
): [number, number, number] {
  const normalR = red / 255;
  const normalG = green / 255;
  const normalB = blue / 255;
  const maxChannel = Math.max(normalR, normalG, normalB);
  const minChannel = Math.min(normalR, normalG, normalB);
  const delta = maxChannel - minChannel;

  let hue = 0;
  if (delta) {
    if (maxChannel === normalR) {
      hue = ((normalG - normalB) / delta + (normalG < normalB ? 6 : 0)) / 6;
    } else if (maxChannel === normalG) {
      hue = ((normalB - normalR) / delta + 2) / 6;
    } else {
      hue = ((normalR - normalG) / delta + 4) / 6;
    }
  }

  const saturation = maxChannel ? (delta / maxChannel) * 100 : 0;
  const value = maxChannel * 100;

  return [hue * 360, saturation, value];
}

function hsvToRgb(
  hue: number,
  saturation: number,
  value: number,
): [number, number, number] {
  const normalH = hue / 360;
  const normalS = saturation / 100;
  const normalV = value / 100;
  const segment = Math.floor(normalH * 6);
  const fractional = normalH * 6 - segment;
  const p = normalV * (1 - normalS);
  const q = normalV * (1 - fractional * normalS);
  const t = normalV * (1 - (1 - fractional) * normalS);

  const colorMap: [number, number, number][] = [
    [normalV, t, p],
    [q, normalV, p],
    [p, normalV, t],
    [p, q, normalV],
    [t, p, normalV],
    [normalV, p, q],
  ];

  const [red, green, blue] = colorMap[segment % 6];
  return [red * 255, green * 255, blue * 255];
}

function createDragHandler(
  targetRef: React.RefObject<HTMLDivElement | null>,
  onMove: (normalX: number, normalY: number) => void,
) {
  return (event: React.MouseEvent) => {
    function update(dragEvent: MouseEvent | React.MouseEvent) {
      if (!targetRef.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      const normalX = Math.max(
        0,
        Math.min(1, (dragEvent.clientX - rect.left) / rect.width),
      );
      const normalY = Math.max(
        0,
        Math.min(1, (dragEvent.clientY - rect.top) / rect.height),
      );
      onMove(normalX, normalY);
    }

    update(event);

    const handleMouseMove = (moveEvent: MouseEvent) => update(moveEvent);
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
}

function ColorPickerPopover({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  const initialHsv =
    value.length === 6
      ? (() => {
          const [r, g, b] = hexToRgb(value);
          return rgbToHsv(r, g, b);
        })()
      : ([0, 0, 100] as [number, number, number]);

  const [hue, setHue] = useState(initialHsv[0]);
  const [saturation, setSaturation] = useState(initialHsv[1] / 100);
  const [brightness, setBrightness] = useState(initialHsv[2] / 100);
  const [hexInput, setHexInput] = useState(value || "000000");
  const isTypingHex = useRef(false);
  const gradientRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);

  const derivedHex = useMemo(() => {
    const [r, g, b] = hsvToRgb(hue, saturation * 100, brightness * 100);
    return rgbToHex(r, g, b);
  }, [hue, saturation, brightness]);

  useEffect(() => {
    if (!isTypingHex.current) {
      setHexInput(derivedHex);
    }
    onChange(derivedHex);
  }, [derivedHex]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="color-picker">
      <div
        ref={gradientRef}
        onMouseDown={createDragHandler(gradientRef, (x, y) => {
          setSaturation(x);
          setBrightness(1 - y);
        })}
        className="color-gradient"
        style={{
          background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl(${hue},100%,50%))`,
        }}
      >
        <div
          className="color-gradient-cursor"
          style={{
            left: `${saturation * 100}%`,
            top: `${(1 - brightness) * 100}%`,
          }}
        />
      </div>

      <div
        ref={hueSliderRef}
        onMouseDown={createDragHandler(hueSliderRef, (x) => setHue(x * 360))}
        className="color-hue-slider"
      >
        <div
          className="color-hue-thumb"
          style={{ left: `${(hue / 360) * 100}%` }}
        />
      </div>

      <div className="color-hex-row">
        <div
          className="color-hex-preview"
          style={{ background: `#${derivedHex}` }}
        />
        <span className="color-hex-hash">#</span>
        <input
          className="color-hex-input"
          value={hexInput}
          onFocus={() => {
            isTypingHex.current = true;
          }}
          onBlur={() => {
            isTypingHex.current = false;
            if (hexInput.length === 6) {
              const [r, g, b] = hexToRgb(hexInput);
              const [h, s, v] = rgbToHsv(r, g, b);
              setHue(h);
              setSaturation(s / 100);
              setBrightness(v / 100);
            }
          }}
          onChange={(e) => {
            const cleaned = e.target.value
              .replace(/[^0-9a-fA-F]/g, "")
              .slice(0, 6);
            setHexInput(cleaned);
            if (cleaned.length === 6) {
              const [r, g, b] = hexToRgb(cleaned);
              const [h, s, v] = rgbToHsv(r, g, b);
              setHue(h);
              setSaturation(s / 100);
              setBrightness(v / 100);
            }
          }}
        />
      </div>
    </div>
  );
}

export default function ColorInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (hex: string) => void;
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftColor, setDraftColor] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef(draftColor);
  draftRef.current = draftColor;

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onChange(draftRef.current);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onChange]);

  useEffect(() => {
    if (!isOpen) setDraftColor(value);
  }, [value, isOpen]);

  return (
    <div ref={wrapperRef} className="color-input-wrapper">
      <div className="settings-label">{label}</div>
      <div className="color-input-row">
        <button
          className="color-input-trigger"
          onClick={() => {
            setDraftColor(value);
            setIsOpen((prev) => !prev);
          }}
        >
          <div
            className="color-swatch"
            style={{
              background: draftColor
                ? `#${draftColor}`
                : "rgba(255,255,255,0.2)",
            }}
          />
          <span className="color-hash">#</span>
          {draftColor || <span className="color-auto">auto</span>}
        </button>
        {draftColor && (
          <button
            className="color-reset-btn"
            onClick={() => {
              setDraftColor("");
              setIsOpen(false);
              onChange("");
            }}
            title="Reset to auto"
          >
            ×
          </button>
        )}
      </div>
      {isOpen && (
        <div className="color-popover-anchor">
          <ColorPickerPopover
            value={draftColor}
            onChange={setDraftColor}
          />
        </div>
      )}
    </div>
  );
}
