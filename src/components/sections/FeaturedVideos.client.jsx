import {Link} from '@shopify/hydrogen';

import {Section, Text, Video} from '~/components';
import {abbreviateNumber} from '~/lib/utils';

export function FeaturedVideos({data, title = 'Videos', ...props}) {
  const haveCollections = data.length > 0;

  if (!haveCollections) return null;

  return (
    <Section {...props} padding="y" heading={title}>
      <div className="swimlane hiddenScroll md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12 pb-0">
        {data.map((entry) => {
          if (!entry?.video) {
            return null;
          }
          return (
            <div key={entry.sys.id}>
              <div className="grid gap-2 snap-start w-40 md:w-60 lg:w-80">
                {entry?.video && (
                  <Video video={entry.video} className="rounded-md" />
                )}
                <Link className="block" to={`/video/${entry.sys.id}`}>
                  <Text size="copy" className="font-proxima leading-4">
                    {entry.title}
                  </Text>
                </Link>
                {entry.viewCount > 0 && (
                  <div>
                    <Text
                      size="small"
                      className="px-2 py-1 bg-comment font-proxima text-white rounded-md"
                    >
                      {abbreviateNumber(entry.viewCount)} views
                    </Text>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
