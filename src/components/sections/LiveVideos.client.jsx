import {Image, Link} from '@shopify/hydrogen';

import {Heading, Section, Text, Video} from '~/components';
import {abbreviateNumber} from '~/lib/utils';

export function LiveVideos({data, title = 'Videos', ...props}) {
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
            <div key={entry.sys.id} className="grid gap-2 snap-start w-40">
              <div className="">
                {entry?.video && (
                  <Video
                    video={entry.video}
                    live={true}
                    className="rounded-md"
                  />
                )}
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8">
                  <Image
                    data={entry.profile.image}
                    alt={entry.profile.nickname}
                  />
                </div>
                <Text>{entry.profile.nickname}</Text>
              </div>
              <Link to={`/live/${entry.sys.id}`}>
                <Text size="copy" className="font-proxima leading-4">
                  {entry.title}
                </Text>
              </Link>
              <div>
                <Text
                  size="small"
                  className="px-2 py-1 bg-comment font-proxima text-white rounded-md"
                >
                  {abbreviateNumber(entry.viewCount)} watching
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
