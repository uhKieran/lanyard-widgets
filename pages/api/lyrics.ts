import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { track_name, artist_name, album_name } = req.query;

  const params = new URLSearchParams();
  if (track_name) params.set("track_name", String(track_name));
  if (artist_name) params.set("artist_name", String(artist_name));
  if (album_name) params.set("album_name", String(album_name));

  try {
    const response = await fetch(`https://lrclib.net/api/get?${params.toString()}`, {
      headers: { "User-Agent": "lanyard.kie.ac/1.0 (https://lanyard.kie.ac)" },
    });
    if (!response.ok) {
      res.status(200).json({});
      return;
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch {
    res.status(200).json({});
  }
}
