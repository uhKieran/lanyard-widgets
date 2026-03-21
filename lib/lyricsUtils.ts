export interface LrcLine {
  time: number;
  text: string;
}

export function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function parseLrc(rawLrc: string): LrcLine[] {
  return rawLrc.split("\n").reduce<LrcLine[]>((lines, raw) => {
    const match = raw.match(/\[(\d+):(\d+\.\d+)\](.*)/);
    if (match && match[3].trim()) {
      lines.push({
        time: (parseInt(match[1]) * 60 + parseFloat(match[2])) * 1000,
        text: match[3].trim(),
      });
    }
    return lines;
  }, []);
}
