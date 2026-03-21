export interface StyleOption {
  key: string;
  label: string;
}

export const styleOptions: StyleOption[] = [
  { key: "default", label: "Default" },
  { key: "blurred", label: "Blurred" },
  { key: "minimal", label: "Minimal" },
  { key: "compact", label: "Compact" },
];
