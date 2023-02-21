import {Image, Link} from '@shopify/hydrogen';

import {Heading, Section, Text, Video} from '~/components';

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
            <Link key={entry.sys.id} to={`/video/${entry.sys.id}`}>
              <div className="grid gap-2 snap-start w-80">
                <div className="">
                  {entry?.video && (
                    <Video
                      video={entry.video}
                      live={true}
                      viewCount={entry.viewCount}
                    />
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-8 h-8">
                    <Image data={entry.profile.image} />
                  </div>
                  <Text>{entry.profile.nickname}</Text>
                </div>
                <Heading size="copy" className="font-proxima">
                  {entry.title}
                </Heading>
                <div>
                  <Text
                    size="small"
                    className="px-2 py-1 bg-comment font-proxima text-white rounded-md"
                  >
                    {entry.viewCount} watching
                  </Text>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
