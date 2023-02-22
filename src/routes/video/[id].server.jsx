import {
  AddToCartButton,
  ProductOptionsProvider,
  Seo,
  useServerAnalytics,
  useShopQuery,
  ShopifyAnalyticsConstants,
  gql,
} from '@shopify/hydrogen';
import {Suspense} from 'react';

import {
  IconAddToCart,
  ProductSummary,
  Profile,
  Section,
  Text,
  Video,
} from '~/components';
import {NotFound, Layout} from '~/components/index.server';
import {useContentfulQuery} from '../api/useContentfulQuery';

export default function VideoDetails({params}) {
  const {id} = params;

  const {data} = useContentfulQuery({
    query: VIDEO_QUERY,
    variables: {
      videoId: id,
    },
    key: id,
  });

  const {video} = data;

  if (!video) {
    return <NotFound />;
  }

  const {data: contentfulData} = useContentfulQuery({
    query: PROFILE_QUERY,
    variables: {
      userId: video.userId,
    },
    key: video.userId,
  });

  const {profileCollection} = contentfulData;
  const profile = profileCollection.items[0];

  const relatedProductsWithDetails =
    video.relatedProducts?.map((relatedProduct) => {
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
        variants: product.variants,
      };
    }) || [];

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
      <Video video={video.video} />
      <Section>
        <Text as="h2" size="h2">
          {video.title}
        </Text>
        <Profile profile={profile} tags={video.tags} />
        <div className="mt-6">
          {relatedProductsWithDetails.map((relatedProduct) => (
            <ProductOptionsProvider
              key={relatedProduct.id}
              data={relatedProduct}
            >
              <ProductSummary {...relatedProduct}>
                <div className="flex items-center justify-center w-12 h-12 bg-signature rounded-full">
                  <AddToCartButton
                    variantId={relatedProduct?.variants.edges[0].node.id}
                    quantity={1}
                    accessibleAddingToCartLabel="Adding item to your cart"
                    disabled={
                      !relatedProduct?.variants.edges[0].node
                        .availableForSale || false
                    }
                    type="button"
                  >
                    <IconAddToCart className="w-7 h-7 fill-contrast" />
                  </AddToCartButton>
                </div>
              </ProductSummary>
            </ProductOptionsProvider>
          ))}
        </div>
      </Section>
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
      tags
      relatedProducts
      userId
    }
  }
`;

const PROFILE_QUERY = gql`
  query ($userId: String!) {
    profileCollection(where: {userId: $userId}) {
      items {
        sys {
          id
        }
        image {
          url
          height
          width
        }
        banner {
          url
        }
        nickname
        hair
        skin
        tone
        lip
      }
    }
  }
`;

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
      variants(first: 1) {
        edges {
          node {
            id
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;
