import {
  CacheNone,
  flattenConnection,
  gql,
  Image,
  Link,
  Money,
  Seo,
  useRouteParams,
  useSession,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';
import {Suspense} from 'react';

import {Text, PageHeader, Heading} from '~/components';
import {Layout} from '~/components/index.server';
import {PAGINATION_SIZE} from '~/lib/const';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {statusMessage} from '~/lib/utils';

export default function VideoDetails({response}) {
  const {id} = useRouteParams();

  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');
  if (!id) return response.redirect('/account/');

  const {data} = useShopQuery({
    query: ALL_PRODUCTS_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      pageBy: PAGINATION_SIZE,
    },
    preload: true,
  });

  const products = data.products;

  console.log(products);

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
      {products.nodes.map((product) => (
        <div>{product.title}</div>
      ))}
    </Layout>
  );
}

const ALL_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $pageBy, after: $cursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
