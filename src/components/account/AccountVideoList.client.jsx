import {useState} from 'react';

import {Link} from '@shopify/hydrogen';
import {Button, Text, Video} from '~/components';
import {AccountVideoForm, Modal} from '../index';

export function AccountVideoList({videos, customer}) {
  const [editingVideo, setEditingVideo] = useState(null);

  function close() {
    setEditingVideo(null);
  }

  function editVideo(video) {
    setEditingVideo(video);
  }

  return (
    <>
      {editingVideo ? (
        <Modal close={close}>
          <AccountVideoForm customer={customer} close={close} />
        </Modal>
      ) : null}
      <div className="mt-6">
        <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
          <div className="w-48">
            <Button
              className="text-sm w-full"
              onClick={() => {
                editVideo({});
              }}
              variant="secondary"
            >
              Upload
            </Button>
          </div>
          <h2 className="font-bold text-lead">Uploaded Videos</h2>

          {videos?.length ? <Videos videos={videos} /> : <EmptyOrders />}
        </div>
      </div>
    </>
  );
}

function EmptyOrders() {
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
    <ul className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 false  sm:grid-cols-4">
      {videos.map((entry) => (
        <div key={entry.sys.id} className="relative">
          <Video video={entry.video}></Video>
          <Link
            to={`/account/video/${entry.sys.id}`}
            className="absolute inset-0 flex items-center justify-center"
          ></Link>
        </div>
      ))}
    </ul>
  );
}
