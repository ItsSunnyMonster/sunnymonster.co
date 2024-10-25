import { Context } from "@netlify/functions";

import SpotifyWebApi from "spotify-web-api-node";

function createResponse(value: any, status: number) {
  return new Response(JSON.stringify(value), {
    status: status,
    headers: { "Content-Type": "application/json" },
  });
}

interface Artist {
  name: string;
  link: string;
}

interface ResponseData {
  isPlayingNow: boolean;
  isPaused: boolean;
  progressMs: number;
  durationMs: number;
  albumCoverImg: string;
  artists: Artist[];
  trackName: string;
  trackLink: string;
}

const api = new SpotifyWebApi({
  clientId: Netlify.env.get("CLIENT_ID"),
  clientSecret: Netlify.env.get("CLIENT_SECRET"),
  refreshToken: Netlify.env.get("REFRESH_TOKEN"),
});
let expirationTime = 0;

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return createResponse({ error: "Method not allowed." }, 500);
  }

  try {
    if (Date.now() > expirationTime) {
      const response = await api.refreshAccessToken();
      api.setAccessToken(response.body.access_token);

      expirationTime = Date.now() + response.body.expires_in * 1000;
    }

    let response: ResponseData = {
      isPlayingNow: false,
      isPaused: false,
      progressMs: 0,
      durationMs: 0,
      albumCoverImg: "",
      artists: [],
      trackName: "",
      trackLink: "",
    };
    const playing = await api.getMyCurrentPlayingTrack();

    let track: SpotifyApi.TrackObjectFull | null = null;
    if (playing.body?.item && "album" in playing.body.item) {
      track = playing.body.item;

      response.isPlayingNow = true;
      response.isPaused = !playing.body.is_playing;
      response.progressMs = playing.body.progress_ms ?? 0;
      response.durationMs = track.duration_ms;
    } else {
      const lastPlayed = await api.getMyRecentlyPlayedTracks({
        limit: 1,
      });

      if (lastPlayed.body?.items[0]?.track) {
        track = lastPlayed.body.items[0].track as SpotifyApi.TrackObjectFull;
      }
    }

    if (track) {
      response.albumCoverImg = track.album.images[0].url;
      response.artists = track.artists.map((artist) => {
        return { name: artist.name, link: artist.external_urls.spotify };
      });
      response.trackName = track.name;
      response.trackLink = track.external_urls.spotify;
    }

    console.log(response);

    return createResponse(response, 200);
  } catch (err) {
    return createResponse({ error: (err as any)?.message }, 500);
  }
};
