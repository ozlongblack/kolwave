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

import {Text, PageHeader} from '~/components';
import {Layout} from '~/components/index.server';
import {useContentfulQuery} from '../../api/useContentfulQuery';

import {ProductSummary} from '../../../components/product';

import {VideoDeleteButton} from '~/components/Video';

export default function VideoDetails({response}) {
  const {id} = useRouteParams();

  response.cache(CacheNone());

  // const {
  //   language: {isoCode: languageCode},
  //   country: {isoCode: countryCode},
  // } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');
  if (!id) return response.redirect('/account/');

  // const {data} = useShopQuery({
  //   query: ALL_PRODUCTS_QUERY,
  //   variables: {
  //     country: countryCode,
  //     language: languageCode,
  //     pageBy: PAGINATION_SIZE,
  //   },
  //   preload: true,
  // });

  const relatedProducts =
    useContentfulQuery({
      query: RELATED_PRODUCTS_QUERY,
      variables: {
        id,
      },
    }).data.video.relatedProducts || [];

  const productSummaryList = relatedProducts.map((relatedProduct) => {
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
      title: product.title,
      vendor: product.vendor,
      image: product.featuredImage,
    };
  });

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
      <VideoDeleteButton id={id} />
      {productSummaryList.map((productSummary) => (
        <ProductSummary {...productSummary} />
      ))}
      {/* {products.nodes.map((product) => (
        <div>{product.title}</div>
      ))} */}
    </Layout>
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

const RELATED_PRODUCTS_QUERY = gql`
  query RelatedProducts($id: String!) {
    video(id: $id) {
      relatedProducts
    }
  }
`;

// const ALL_PRODUCTS_QUERY = gql`
//   ${PRODUCT_CARD_FRAGMENT}
//   query AllProducts(
//     $country: CountryCode
//     $language: LanguageCode
//     $pageBy: Int!
//     $cursor: String
//   ) @inContext(country: $country, language: $language) {
//     products(first: $pageBy, after: $cursor) {
//       nodes {
//         ...ProductCard
//       }
//       pageInfo {
//         hasNextPage
//         startCursor
//         endCursor
//       }
//     }
//   }
// `;
