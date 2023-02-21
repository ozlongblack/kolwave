import {
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
} from '@shopify/hydrogen';
import {Suspense} from 'react';

import {PageHeader} from '~/components';
import {NotFound, Layout} from '~/components/index.server';
import {useContentfulQuery} from '../api/useContentfulQuery';

export default function Video({params}) {
  const {id} = params;

  const {data} = useContentfulQuery({
    query: VIDEO_QUERY,
    variables: {
      videoId: id,
    },
  });

  const {video} = data;

  if (!video) {
    return <NotFound />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.video,
      resourceId: video.sys.id,
    },
  });

  return (
    <Layout>
      <Suspense fallback={<div className="p-2">Loading…</div>}>
        <Seo type="page" data={{title: 'Video Details'}} />
      </Suspense>
      <PageHeader heading={video.title}>Video</PageHeader>
    </Layout>
  );
}

const VIDEO_QUERY = gql`
  query ($videoId: String!) {
    video(id: $videoId) {
      sys {
        id
      }
      contentfulMetadata {
        tags {
          id
          name
        }
      }
      title
      description
      video {
        url
        contentType
      }
      relatedProducts
      userId
    }
  }
`;
