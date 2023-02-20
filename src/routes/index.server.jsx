import {Suspense} from 'react';
import {
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';

import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {getHeroPlaceholder} from '~/lib/placeholders';
import {
  FeaturedCollections,
  FeaturedVideos,
  Hero,
  HeroVideo,
} from '~/components';
import {Layout, ProductSwimlane} from '~/components/index.server';
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
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: HOMEPAGE_CONTENT_QUERY,
    variables: {
      language: languageCode,
      country: countryCode,
    },
    preload: true,
  });

  const {heroBanners, featuredCollections, featuredProducts} = data;

  const {data: contentfulData} = useContentfulQuery({
    query: HOMEPAGE_VIDEO_QUERY,
    variables: {
      featuredTags: ['recommend'],
      heroTags: ['hero'],
    },
    key: 'videos',
  });

  const {featuredVideos, heroVideos} = contentfulData;

  const heroVideosWithDetails =
    heroVideos && heroVideos.items
      ? heroVideos.items.map((heroVideo) => {
          const relatedProductsWithDetails = heroVideo.relatedProducts.map(
            (relatedProduct) => {
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

  // fill in the hero banners with placeholders if they're missing
  const [primaryHero, secondaryHero, tertiaryHero] = getHeroPlaceholder(
    heroBanners.nodes,
  );

  return (
    <>
      {primaryHero && (
        <Hero {...primaryHero} height="full" top loading="eager" />
      )}
      {featuredVideos && (
        <FeaturedVideos data={featuredVideos.items} title="#Recommended" />
      )}
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
      <ProductSwimlane
        data={featuredProducts.nodes}
        title="Featured Products"
        divider="bottom"
      />
      {secondaryHero && <Hero {...secondaryHero} />}
      <FeaturedCollections
        data={featuredCollections.nodes}
        title="Collections"
      />
      {tertiaryHero && <Hero {...tertiaryHero} />}
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
  query ($featuredTags: [String]!, $heroTags: [String]!) {
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

/**
 * The homepage content query includes a request for custom metafields inside the alias
 * `heroBanners`. The template loads placeholder content if these metafields don't
 * exist. Define the following five custom metafields on your Shopify store to override placeholders:
 * - hero.title             Single line text
 * - hero.byline            Single line text
 * - hero.cta               Single line text
 * - hero.spread            File
 * - hero.spread_secondary  File
 *
 * @see https://help.shopify.com/manual/metafields/metafield-definitions/creating-custom-metafield-definitions
 * @see https://github.com/Shopify/hydrogen/discussions/1790
 */

const HOMEPAGE_CONTENT_QUERY = gql`
  ${MEDIA_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  query homepage($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    heroBanners: collections(
      first: 3
      query: "collection_type:custom"
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        handle
        title
        descriptionHtml
        heading: metafield(namespace: "hero", key: "title") {
          value
        }
        byline: metafield(namespace: "hero", key: "byline") {
          value
        }
        cta: metafield(namespace: "hero", key: "cta") {
          value
        }
        spread: metafield(namespace: "hero", key: "spread") {
          reference {
            ...Media
          }
        }
        spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
          reference {
            ...Media
          }
        }
      }
    }
    featuredCollections: collections(
      first: 3
      query: "collection_type:smart"
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
    featuredProducts: products(first: 12) {
      nodes {
        ...ProductCard
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
