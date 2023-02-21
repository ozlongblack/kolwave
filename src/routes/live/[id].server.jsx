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

export default function Livestream({params}) {
  const {id} = params;

  const {data} = useContentfulQuery({
    query: VIDEO_QUERY,
    variables: {
      videoId: id,
    },
  });

  const {livestream} = data;

  if (!livestream) {
    return <NotFound />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.live,
      resourceId: livestream.sys.id,
    },
  });

  return (
    <Layout>
      <Suspense fallback={<div className="p-2">Loading…</div>}>
        <Seo type="page" data={{title: 'Video Details'}} />
      </Suspense>
      <PageHeader heading={livestream.title}>Live</PageHeader>
    </Layout>
  );
}

const VIDEO_QUERY = gql`
  query ($videoId: String!) {
    livestream(id: $videoId) {
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
