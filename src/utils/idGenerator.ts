let currentId = 0;

export function generateIncrementalId(): string {
  currentId += 1;
  return `video-${currentId}`;
}