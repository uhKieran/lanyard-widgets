import { useCallback, useEffect, useRef } from "react";

const lanyardWebSocketUrl = "wss://api.lanyard.rest/socket";
const reconnectDelayMs = 3000;

/**
* Custom React hook to connect to the Lanyard WebSocket for real-time Discord presence updates
* Don't usually use comments but adding some here and there to make it more readable for contributors
*/

export function useLanyardSocket(
  userId: string | undefined,
  onPresenceUpdate: (data: Record<string, unknown> | null, isOffline: boolean) => void,
) {
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbackRef = useRef(onPresenceUpdate);
  callbackRef.current = onPresenceUpdate;

  const connect = useCallback(() => {
    if (!userId) return;

    const ws = new WebSocket(lanyardWebSocketUrl);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.op === 1) {
        heartbeatTimerRef.current = setInterval(
          () =>
            ws.readyState === WebSocket.OPEN &&
            ws.send(JSON.stringify({ op: 3 })),
          message.d.heartbeat_interval,
        );
        ws.send(
          JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }),
        );
      }

      if (message.op === 0) {
        callbackRef.current(message.d, false);
      }
    };

    ws.onclose = () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
      callbackRef.current(null, true);
      setTimeout(connect, reconnectDelayMs);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    connect();
    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
      socketRef.current?.close();
    };
  }, [userId, connect]);
}
