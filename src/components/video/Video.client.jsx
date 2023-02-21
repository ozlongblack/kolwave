export function Video({video, live, click}) {
  return (
    <div className="relative">
      {live && (
        <div className="absolute flex items-center gap-x-2 rounded-sm mt-4 left-1/2 p-1 -translate-x-1/2 bg-white font-helvetica text-primary text-small opacity-75">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-notice opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-notice"></span>
          </span>
          LIVE
        </div>
      )}
      <video
        width="100%"
        height="auto"
        className="rounded-lg"
        controls
        playsInline
        onClick={(event) => {
          if (click) {
            click(event);
          }
        }}
        onMouseEnter={(event) => {
          event.target.play();
        }}
        onMouseLeave={(event) => {
          event.target.pause();
        }}
      >
        <source src={`${video.url}#t=0.001`} type={video.contentType}></source>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
