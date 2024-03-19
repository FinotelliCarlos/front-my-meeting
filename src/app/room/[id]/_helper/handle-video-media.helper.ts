export async function handleUserMedia() {
  const video = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
    },
  });

  return video;
}
