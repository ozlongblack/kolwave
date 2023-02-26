import {Suspense} from 'react';
import {
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';

import {FeaturedVideos, HeroVideo, LiveVideos} from '~/components';
import {Layout} from '~/components/index.server';
import {useContentfulQuery} from './api/useContentfulQuery';

export default function Homepage() {
  useServerAnalytics({
    shopify: {
      canonicalPath: '/',
      pageType: ShopifyAnalyticsConstants.pageType.home,
    },
  });

  return (
    <Layout>
      <Suspense>
        <SeoForHomepage />
      </Suspense>
      <Suspense>
        <HomepageContent />
      </Suspense>
    </Layout>
  );
}

function HomepageContent() {
  const {
    data: {featuredVideos, liveVideos, heroVideos},
  } = useContentfulQuery({
    query: HOMEPAGE_VIDEO_QUERY,
    variables: {
      featuredTags: ['recommend'],
      liveTags: ['live'],
      heroTags: ['hero'],
    },
    key: 'videos',
  });

  const liveVideosWithDetails =
    liveVideos && liveVideos.items
      ? liveVideos.items.map((liveVideo) => {
          const {data} = useContentfulQuery({
            query: PROFILE_QUERY,
            variables: {
              userId: liveVideo.userId,
            },
            key: liveVideo.userId,
          });

          const {profileCollection} = data;
          const profile = profileCollection.items[0];

          return {...liveVideo, profile};
        })
      : [];

  const heroVideosWithDetails =
    heroVideos && heroVideos.items
      ? heroVideos.items.map((heroVideo) => {
          const relatedProductsWithDetails = heroVideo.relatedProducts.map(
            (relatedProduct) => {
              const product = useShopQuery({
                query: PRODUCT_DETAIL_QUERY,
                variables: {
                  id: relatedProduct,
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
                url: `/products/${product.handle}`,
              };
            },
          );

          const {data} = useContentfulQuery({
            query: PROFILE_QUERY,
            variables: {
              userId: heroVideo.userId,
            },
            key: heroVideo.userId,
          });

          const {profileCollection} = data;
          const profile = profileCollection.items[0];

          return {...heroVideo, profile, relatedProductsWithDetails};
        })
      : [];

  return (
    <>
      {featuredVideos && (
        <FeaturedVideos
          data={featuredVideos.items}
          title="#Recommended New Year Gift"
        />
      )}
      {liveVideos && <LiveVideos data={liveVideosWithDetails} title="NOW" />}
      {heroVideosWithDetails.map(
        ({profile, sys, video, title, tags, relatedProductsWithDetails}) => (
          <HeroVideo
            key={sys.id}
            profile={profile}
            video={video}
            title={title}
            tags={tags}
            relatedProducts={relatedProductsWithDetails}
          />
        ),
      )}
    </>
  );
}

function SeoForHomepage() {
  const {
    data: {
      shop: {name, description},
    },
  } = useShopQuery({
    query: HOMEPAGE_SEO_QUERY,
    cache: CacheLong(),
    preload: true,
  });

  return (
    <Seo
      type="homepage"
      data={{
        title: name,
        description,
        titleTemplate: '%s',
      }}
    />
  );
}

const HOMEPAGE_VIDEO_QUERY = gql`
  query ($featuredTags: [String]!, $liveTags: [String]!, $heroTags: [String]!) {
    featuredVideos: videoCollection(
      where: {contentfulMetadata: {tags: {id_contains_some: $featuredTags}}}
    ) {
      items {
        sys {
          id
        }
        contentfulMetadata {
          tags {
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
        viewCount
        userId
      }
    }
    liveVideos: livestreamCollection(
      where: {contentfulMetadata: {tags: {id_contains_some: $liveTags}}}
    ) {
      items {
        sys {
          id
        }
        contentfulMetadata {
          tags {
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
        viewCount
        userId
      }
    }
    heroVideos: videoCollection(
      where: {contentfulMetadata: {tags: {id_contains_some: $heroTags}}}
    ) {
      items {
        sys {
          id
        }
        contentfulMetadata {
          tags {
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
        viewCount
        userId
      }
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
          height
          width
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
      handle
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

const HOMEPAGE_SEO_QUERY = gql`
  query shopInfo {
    shop {
      name
      description
    }
  }
`;
