import {Button, Text, OrderCard} from '~/components';

export function AccountVideos({videos}) {
  return (
    <div className="mt-6">
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h2 className="font-bold text-lead">Videos</h2>
        <div>
          {videos?.length ? <Videos videos={videos} /> : <EmptyVideos />}
          <div className="w-48">
            <Button
              className="text-sm mt-2 w-full"
              variant="secondary"
              to={'/account/video'}
            >
              Manage Videos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyVideos() {
  return (
    <div>
      <Text className="mb-1" size="fine" width="narrow" as="p">
        You haven&apos;t uploaded any videos yet.
      </Text>
    </div>
  );
}

function Videos({videos}) {
  return (
    <ul className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 false  sm:grid-cols-3">
      {videos.map((video) => (
        <OrderCard order={video} key={video.id} />
      ))}
    </ul>
  );
}
