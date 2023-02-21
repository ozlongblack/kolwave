import {IconView} from '~/components';
import {abbreviateNumber} from '~/lib/utils';

export function Video({video, live, viewCount, click}) {
  return (
    <div className="relative">
      {live ? (
        <div className="absolute flex items-center gap-x-2 rounded-sm mt-2 ml-2 p-1 bg-white font-helvetica text-primary text-small">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-notice opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-notice"></span>
          </span>
          LIVE
        </div>
      ) : (
        viewCount > 0 && (
          <div className="absolute flex items-center gap-x-2 rounded-sm mt-2 ml-2 px-1 bg-white font-helvetica text-primary text-small">
            <IconView className="w-4 h-4 fill-none stroke-primary" />
            {abbreviateNumber(viewCount)}
          </div>
        )
      )}
      <video
        width="100%"
        height="auto"
        className="rounded-lg"
        controls
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
