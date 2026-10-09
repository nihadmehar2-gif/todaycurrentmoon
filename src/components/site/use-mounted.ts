"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns true only after the component has mounted on the client.
 * Built on useSyncExternalStore so it is SSR-safe (returns false on the
 * server and during hydration, then true on the client) without calling
 * setState inside an effect. Use to gate rendering of time- or
 * location-based content that would otherwise differ between server and
 * client (hydration mismatch).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
