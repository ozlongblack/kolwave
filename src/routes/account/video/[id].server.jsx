import {
  CacheNone,
  gql,
  Link,
  Seo,
  useRouteParams,
  useSession,
  useShopQuery,
} from '@shopify/hydrogen';
import {Suspense} from 'react';

import {Text, PageHeader, ProductSummary, Video} from '~/components';
import {Layout} from '~/components/index.server';
import {useContentfulQuery} from '../../api/useContentfulQuery';

import {VideoDeleteButton} from '~/components/Video';

export default function VideoDetails({response /*, isDeleted = false*/}) {
  const {id} = useRouteParams();

  response.cache(CacheNone());

  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');
  if (!id) return response.redirect('/account/');
  // if (isDeleted) return response.redirect('/account/video');

  const {data} = useContentfulQuery({
    query: VIDEO_QUERY,
    variables: {
      id,
    },
  });

  const {video} = data;

  const productSummaryList = video.relatedProducts
    ? video.relatedProducts.map((relatedProduct) => {
        const product = useShopQuery({
          query: PRODUCT_DETAIL_QUERY,
          variables: {
            id: `gid://shopify/Product/${relatedProduct}`,
          },
          preload: true,
        }).data.product;

        const price =
          product.priceRange.maxVariantPrice.amount !==
          product.priceRange.minVariantPrice.amount
            ? `from $${product.priceRange.minVariantPrice.amount}`
            : `$${product.priceRange.minVariantPrice.amount}`;

        return {
          price,
          id: product.id,
          title: product.title,
          vendor: product.vendor,
          image: product.featuredImage,
        };
      })
    : [];

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Edit Video'}} />
      </Suspense>
      <PageHeader heading={`Edit Video`}>
        <Link to="/account/video">
          <Text color="subtle">Return to Account Video</Text>
        </Link>
      </PageHeader>
      <VideoCard
        id={id}
        title={video.title}
        description={video.description}
        video={video.video}
        productSummaryList={productSummaryList}
        isDeleted={isDeleted}
      />
    </Layout>
  );
}

function VideoCard({
  id,
  title,
  description,
  video,
  productSummaryList,
  isDeleted,
}) {
  return (
    <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
      <Text as="h3" size="lead">
        {title}
      </Text>
      <Text as="p">{description}</Text>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Video video={video} />
        <div className="flex flex-col gap-4">
          {productSummaryList.map((productSummary) => (
            <ProductSummary key={productSummary.id} {...productSummary} />
          ))}
        </div>
      </div>
      <VideoDeleteButton id={id} isDeleted={isDeleted} />
    </div>
  );
}

const PRODUCT_DETAIL_QUERY = gql`
  query ProductDetail($id: ID!) {
    product(id: $id) {
      id
      title
      vendor
      featuredImage {
        url
        height
        width
      }
      priceRange {
        maxVariantPrice {
          amount
        }
        minVariantPrice {
          amount
        }
      }
    }
  }
`;

const VIDEO_QUERY = gql`
  query Video($id: String!) {
    video(id: $id) {
      title
      description
      video {
        url
        contentType
      }
      tags
      relatedProducts
      userId
    }
  }
`;
