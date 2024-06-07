    const initializePlayer = () => {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,            // Enable web workers for better performance
          liveSyncDuration: 3,           // Maximum difference between live edge and current playback position (in seconds)
          maxBufferLength: 30,           // Maximum buffer length (in seconds)
          maxBufferSize: 60 * 1000 * 1000, // Maximum buffer size in bytes (e.g., 60 MB)
          maxMaxBufferLength: 600,       // Maximum buffer length that can be set by the player (in seconds)
          maxMaxBufferSize: 600 * 1000 * 1000, // Maximum buffer size that can be set by the player (e.g., 600 MB)
          lowLatencyMode: true,          // Enable low-latency mode
          liveDurationInfinity: true,    // Treat live streams as having infinite duration
          fragLoadingTimeOut: 20000,     // Fragment loading timeout (in milliseconds)
          fragLoadingMaxRetry: 5,        // Maximum number of fragment loading retries
          fragLoadingRetryDelay: 500,    // Delay between fragment loading retries (in milliseconds)
          levelLoadingTimeOut: 10000,    // Level loading timeout (in milliseconds)
          levelLoadingMaxRetry: 5,       // Maximum number of level loading retries
          levelLoadingRetryDelay: 500,   // Delay between level loading retries (in milliseconds)
          manifestLoadingTimeOut: 10000, // Manifest loading timeout (in milliseconds)
          manifestLoadingMaxRetry: 5,    // Maximum number of manifest loading retries
          manifestLoadingRetryDelay: 500, // Delay between manifest loading retries (in milliseconds)
          backBufferLength:3,           // Number of segments to keep in the back buffer before removing older ones
          liveDurationInfinity: !showTimeline,
        });
        hls.loadSource(selectedDate || live);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(error => {
            console.error('Error playing video:', error);
          });
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = selectedDate || live;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(error => {
            console.error('Error playing video:', error);
          });
        });
      } else {
        console.error(
          "HLS.js is not supported, and native HLS playback is not available."
        );
        onVideoLoadError(true);
      }
      
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    };

    if (video) {
      initializePlayer();
    }