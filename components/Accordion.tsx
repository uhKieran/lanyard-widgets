import { useState } from "react";

export default function Accordion({
  items,
}: {
  items: [string, React.ReactNode][];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="accordion">
      {items.map(([question, answer], index) => (
        <div key={question} className="accordion-item">
          <button
            className="accordion-trigger"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            {question}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`accordion-chevron${openIndex === index ? " accordion-chevron--open" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="accordion-body">{answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
