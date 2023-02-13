import {IconView} from '~/components';
import {abbreviateNumber} from '~/lib/utils';

export function Video({video, viewCount, click}) {
  return (
    <div className="relative">
      {viewCount > 0 && (
        <div className="absolute flex items-center gap-x-2 rounded-sm mt-2 ml-2 px-1 bg-white text-primary text-sm">
          <IconView className="w-4 h-4 fill-none stroke-primary" />
          {abbreviateNumber(viewCount)}
        </div>
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
        <source src={video.url} type={video.contentType}></source>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
