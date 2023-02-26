import {Suspense} from 'react';
import {
  gql,
  ProductOptionsProvider,
  Seo,
  ShopifyAnalyticsConstants,
  useLocalization,
  useRouteParams,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';

import {MEDIA_FRAGMENT} from '~/lib/fragments';
import {getExcerpt} from '~/lib/utils';
import {NotFound, Layout, ProductSwimlane} from '~/components/index.server';
import {
  FeaturedVideos,
  Heading,
  ProductDetail,
  ProductForm,
  ProductGallery,
  Section,
  Text,
} from '~/components';
import {useContentfulQuery} from '../api/useContentfulQuery';

export default function Product() {
  const {handle} = useRouteParams();
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {
    data: {product, shop},
  } = useShopQuery({
    query: PRODUCT_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      handle,
    },
    preload: true,
  });

  if (!product) {
    return <NotFound type="product" />;
  }

  const {media, title, vendor, descriptionHtml, id, productType} = product;
  const {shippingPolicy, refundPolicy} = shop;
  const {
    priceV2,
    id: variantId,
    sku,
    title: variantTitle,
    hairType,
    skinType,
    toneType,
    lipType,
  } = product.variants.nodes[0];

  const recommedations = {hairType, skinType, toneType, lipType};

  const {
    data: {videoCollection},
  } = useContentfulQuery({
    query: VIDEO_QUERY,
    variables: {
      productId: id,
    },
  });

  const videosWithDetails =
    videoCollection && videoCollection.items
      ? videoCollection.items.map((video) => {
          const {
            data: {profileCollection},
          } = useContentfulQuery({
            query: PROFILE_QUERY,
            variables: {
              userId: video.userId,
            },
            key: video.sys.id,
          });

          const profile = profileCollection.items[0];

          return {...video, profile};
        })
      : [];

  useServerAnalytics({
    shopify: {
      canonicalPath: `/products/${handle}`,
      pageType: ShopifyAnalyticsConstants.pageType.product,
      resourceId: id,
      products: [
        {
          product_gid: id,
          variant_gid: variantId,
          variant: variantTitle,
          name: title,
          brand: vendor,
          category: productType,
          price: priceV2.amount,
          sku,
        },
      ],
    },
  });

  return (
    <Layout>
      <Suspense>
        <Seo type="product" data={product} />
      </Suspense>
      <ProductOptionsProvider data={product}>
        <Section padding="x" className="px-0">
          <div className="grid items-start md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3 pt-6 md:pt-8 lg:pt-12">
            <ProductGallery
              media={media.nodes}
              className="w-screen md:w-full lg:col-span-2"
            />
            <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
              <section className="flex flex-col w-full max-w-xl gap-8 p-6 md:mx-auto md:max-w-sm md:px-0">
                <div className="grid gap-2">
                  <Heading as="h1" format className="whitespace-normal">
                    {title}
                  </Heading>
                  {vendor && (
                    <Text className={'opacity-50 font-medium'}>{vendor}</Text>
                  )}
                </div>
                <ProductForm />
                <ProductRecommends data={recommedations} />
                <div className="grid gap-4 py-4">
                  {descriptionHtml && (
                    <ProductDetail
                      title="Product Details"
                      content={descriptionHtml}
                    />
                  )}
                  {shippingPolicy?.body && (
                    <ProductDetail
                      title="Shipping"
                      content={getExcerpt(shippingPolicy.body)}
                      learnMore={`/policies/${shippingPolicy.handle}`}
                    />
                  )}
                  {refundPolicy?.body && (
                    <ProductDetail
                      title="Returns"
                      content={getExcerpt(refundPolicy.body)}
                      learnMore={`/policies/${refundPolicy.handle}`}
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </Section>
        {videosWithDetails && (
          <FeaturedVideos
            data={videosWithDetails}
            title={'Videos Reviews'}
          ></FeaturedVideos>
        )}
        <Suspense>
          <ProductSwimlane title="You may also like" data={id} />
        </Suspense>
      </ProductOptionsProvider>
    </Layout>
  );
}

function ProductRecommends({data}) {
  const {hairType, skinType, toneType, lipType} = data;

  return (
    <div className="grid gap-4">
      {hairType && (
        <div>
          <Text as="h3" size="h3">
            #Hair Type
          </Text>
          <span className="px-2 rounded-full bg-signature font-proxima text-contrast">
            {hairType.value}
          </span>
        </div>
      )}
      {skinType && (
        <div>
          <Text as="h3" size="h3">
            #Skin Type
          </Text>

          <span className="px-2 rounded-full bg-signature font-proxima text-contrast">
            {skinType.value}
          </span>
        </div>
      )}
      {toneType && (
        <div>
          <Text as="h3" size="h3">
            #Tone Type
          </Text>

          <span className="px-2 rounded-full bg-signature font-proxima text-contrast">
            {toneType.value}
          </span>
        </div>
      )}
      {lipType && (
        <div>
          <Text as="h3" size="h3">
            #Lip Type
          </Text>

          <span className="px-2 rounded-full bg-signature font-proxima text-contrast">
            {lipType.value}
          </span>
        </div>
      )}
    </div>
  );
}

const PRODUCT_QUERY = gql`
  ${MEDIA_FRAGMENT}
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      descriptionHtml
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      productType
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
          priceV2 {
            amount
            currencyCode
          }
          compareAtPriceV2 {
            amount
            currencyCode
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
          hairType: metafield(namespace: "recommend", key: "hair") {
            value
          }
          skinType: metafield(namespace: "recommend", key: "skin") {
            value
          }
          toneType: metafield(namespace: "recommend", key: "tone") {
            value
          }
          lipType: metafield(namespace: "recommend", key: "lip") {
            value
          }
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;

const VIDEO_QUERY = gql`
  query ($productId: [String!]) {
    videoCollection(where: {relatedProducts_contains_some: $productId}) {
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
