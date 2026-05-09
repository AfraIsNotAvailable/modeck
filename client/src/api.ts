import type { Button } from "./types";

export const getServerUrl = () =>
  localStorage.getItem("serverUrl") ?? window.location.origin;

export async function fetchButtons(): Promise<Button[]> {
  const res = await fetch(`${getServerUrl()}/buttons`);
  if (!res.ok) {
    throw new Error(`Failed to fetch buttons: ${res.statusText}`);
  }
  return res.json();
}

export async function executeButton(id: string, longPress = false): Promise<void> {
  const url = `${getServerUrl()}/execute/${id}${longPress ? "?longPress=true" : ""}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Failed to execute button: ${res.statusText}`);
  }
}

export async function createButton(
  button: Omit<Button, "id">,
): Promise<Button> {
  const res = await fetch(`${getServerUrl()}/buttons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(button),
  });
  if (!res.ok) {
    throw new Error(`Failed to create button: ${res.statusText}`);
  }
  return res.json();
}

export async function updateButton(
  id: string,
  button: Partial<Button>,
): Promise<Button> {
  const res = await fetch(`${getServerUrl()}/buttons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(button),
  });
  if (!res.ok) {
    throw new Error(`Failed to update button: ${res.statusText}`);
  }
  return res.json();
}

export async function deleteButton(id: string): Promise<void> {
  const res = await fetch(`${getServerUrl()}/buttons/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete button");
}

export function createWebSocket(
  onOpen: () => void,
  onClose: () => void,
): WebSocket {
  const url = getServerUrl().replace(/^http/, "ws");
  const ws = new WebSocket(`${url}/ws`);
  ws.onopen = onOpen;
  ws.onclose = onClose;
  return ws;
}

export async function getColorFromUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(`${getServerUrl()}/color-from-url?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.color ?? null;
  } catch {
    return null;
  }
}
