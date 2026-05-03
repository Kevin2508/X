export function timeAgo(dateStr: string): string {
  const createdAt = new Date(dateStr);
  const createdTime = createdAt.getTime();

  if (Number.isNaN(createdTime)) {
    return "now";
  }

  const seconds = Math.max(0, Math.floor((Date.now() - createdTime) / 1000));

  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

  return createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
