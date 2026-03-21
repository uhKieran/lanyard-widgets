import { useEffect, useRef, useState } from "react";
import { fontshareFonts } from "@/lib/fonts";

function FontOption({
  label,
  isSelected,
  fontFamily,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  fontFamily: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-option${isSelected ? " font-option--selected" : ""}`}
      style={{ fontFamily }}
    >
      {label}
      {isSelected && (
        <svg
          className="font-option-check"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}

export default function FontPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (fontSlug: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen || fontsLoaded) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://api.fontshare.com/v2/css?" +
      fontshareFonts.map((f) => `f[]=${f.slug}@400`).join("&") +
      "&display=swap";
    document.head.appendChild(link);
    setFontsLoaded(true);
  }, [isOpen, fontsLoaded]);

  const filteredFonts = fontshareFonts.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedName = value
    ? fontshareFonts.find((f) => f.slug === value)?.name
    : undefined;

  return (
    <div ref={wrapperRef} className="font-picker">
      <button
        className="font-picker-trigger"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setSearchQuery("");
        }}
        style={{
          fontFamily: selectedName ? `"${selectedName}", sans-serif` : "inherit",
        }}
      >
        <span className="font-picker-selected">
          {selectedName ?? "PP Neue Montreal"}
        </span>
        <svg
          className={`font-picker-chevron${isOpen ? " font-picker-chevron--open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="font-picker-dropdown">
          <div className="font-picker-search-wrap">
            <div className="font-picker-search-inner">
              <svg
                className="font-picker-search-icon"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#52525b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className="font-picker-search"
                autoFocus
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="font-picker-options">
            <FontOption
              label="PP Neue Montreal"
              isSelected={!value}
              fontFamily="inherit"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            />
            {filteredFonts.length === 0 ? (
              <div className="font-picker-empty">No results</div>
            ) : (
              filteredFonts.map((f) => (
                <FontOption
                  key={f.slug}
                  label={f.name}
                  isSelected={value === f.slug}
                  fontFamily={`"${f.name}", sans-serif`}
                  onClick={() => {
                    onChange(f.slug);
                    setIsOpen(false);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
