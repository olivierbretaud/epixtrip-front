type CookieOptions = {
  path?: string;
  sameSite?: "Strict" | "Lax" | "None";
  secure?: boolean;
  maxAge?: number;
};

export function getCookie(name: string): string | undefined {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
}

export function deleteCookie(name: string): void {
  // biome-ignore lint/suspicious/noDocumentCookie: cookie utility wrapper
  document.cookie = `${encodeURIComponent(name)}=; path=/; Max-Age=0`;
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  const { path = "/", sameSite = "Strict", secure = false, maxAge } = options;

  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `path=${path}`,
    `SameSite=${sameSite}`,
    ...(secure ? ["Secure"] : []),
    ...(maxAge !== undefined ? [`Max-Age=${maxAge}`] : []),
  ];

  // biome-ignore lint/suspicious/noDocumentCookie: cookie utility wrapper
  document.cookie = parts.join("; ");
}
