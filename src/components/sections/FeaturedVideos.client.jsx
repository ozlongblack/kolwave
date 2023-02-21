import {Link} from '@shopify/hydrogen';

import {Section, Video} from '~/components';

export function FeaturedVideos({data, title = 'Videos', ...props}) {
  const haveCollections = data.length > 0;

  if (!haveCollections) return null;

  return (
    <Section {...props} padding="y" heading={title}>
      <div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12">
        {data.map((entry) => {
          if (!entry?.video) {
            return null;
          }
          return (
            <Link key={entry.sys.id} to={`/video/${entry.sys.id}`}>
              <div className="grid gap-4 snap-start w-80">
                {entry?.video && (
                  <Video video={entry.video} viewCount={entry.viewCount} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
