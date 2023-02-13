import {Suspense} from 'react';
import {
  CacheNone,
  gql,
  Link,
  Seo,
  useSession,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';

import {AccountVideoList, PageHeader, Text} from '~/components';
import {Layout} from '~/components/index.server';
import {useContentfulQuery} from '../api/useContentfulQuery';

export default function Videos({response}) {
  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {data} = useShopQuery({
    query: CUSTOMER_QUERY,
    variables: {
      customerAccessToken,
      language: languageCode,
      country: countryCode,
    },
    cache: CacheNone(),
  });

  const {customer} = data;

  if (!customer) return response.redirect('/account/login');

  const {data: contentfulData} = useContentfulQuery({
    query: CONTENTFUL_QUERY,
    variables: {
      userId: customer.id,
    },
  });

  const {videoCollection} = contentfulData;

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Videos'}} />
      </Suspense>
      <PageHeader heading={`Videos`}>
        <Link to="/account">
          <Text color="subtle">Return to Account Overview</Text>
        </Link>
      </PageHeader>
      <AccountVideoList videos={videoCollection.items} customer={customer} />
    </Layout>
  );
}

const CUSTOMER_QUERY = gql`
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      id
    }
  }
`;

const CONTENTFUL_QUERY = gql`
  query ($userId: String!) {
    videoCollection(where: {userId: $userId}) {
      items {
        sys {
          id
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
  }
`;
