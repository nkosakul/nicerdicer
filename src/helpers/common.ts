export function shareLink(link: string) {
  navigator.clipboard.writeText(link);
  alert('link is copied!');
}

export function shortenLink(link: string): string {
  return link.split('-')[0];
}
