import {
  gql,
  Image,
  Seo,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';

import {Heading, PageHeader} from '~/components';
import {Layout, ProductSwimlane} from '~/components/index.server';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {abbreviateNumber} from '~/lib/utils';
import {useContentfulQuery} from '../api/useContentfulQuery';

export default function Trending() {
  return (
    <Layout>
      <Seo
        type="page"
        data={{title: 'Discover Trending Beauty and Skincare'}}
      />
      <PageHeader
        heading="Discover Trending Beauty and Skincare"
        variant="allCollections"
      />
      <Profiles />
      <FeaturedSection />
    </Layout>
  );
}

function Profiles() {
  const {
    data: {profileCollection},
  } = useContentfulQuery({
    query: PROFILE_QUERY,
  });

  const profiles = profileCollection?.items || [];

  return (
    <>
      <Heading as="h2" size="lead" className="px-6 md:px-8 lg:px-12">
        Top 3 KOLs
      </Heading>
      <div className="swimlane hiddenScroll mt-6 pb-6 md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12 border-b border-primary/10">
        {profiles.map((profile) => (
          <div key={profile.sys.id} className="grid gap-2 snap-start w-40">
            <Image
              data={profile.banner}
              className="w-full rounded-md"
              alt={profile.nickname}
            />
            {profile.nickname}
            <div>
              <div className="mb-2 font-proxima text-small">
                {abbreviateNumber(profile.followerCount)} followers
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge text={`${profile.hair} Hair`} />
                <Badge text={`${profile.skin} Skin`} />
                <Badge text={`${profile.tone} Tone`} />
                <Badge text={`${profile.lip} Lip`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Badge({text}) {
  return (
    <div className="inline-block p-1 bg-signature rounded-sm font-proxima text-contrast text-small capitalize">
      {text}
    </div>
  );
}

function FeaturedSection() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: TRENDING_CONTENT_QUERY,
    variables: {
      language: languageCode,
      country: countryCode,
    },
    preload: true,
  });

  const {skinCareProducts, makeupProducts} = data;

  console.log(skinCareProducts, makeupProducts);

  return (
    <>
      <ProductSwimlane
        data={skinCareProducts.nodes}
        title="#Top 10 Skincare Products"
      />
      <ProductSwimlane
        data={makeupProducts.nodes}
        title="#Top 20 Makeup Products"
      />
    </>
  );
}

const PROFILE_QUERY = gql`
  query profileCollectionQuery {
    profileCollection(limit: 3, order: followerCount_DESC) {
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
        followerCount
      }
    }
  }
`;

const TRENDING_CONTENT_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query homepage($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
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
    skinCareProducts: products(
      first: 10
      sortKey: BEST_SELLING
      query: "(title:Toner) OR (title:Essence)"
    ) {
      nodes {
        ...ProductCard
      }
    }
    makeupProducts: products(
      first: 20
      sortKey: BEST_SELLING
      query: "(product_type:Brow Definer) OR (product_type:Eye Shadow) OR (product_type:Concealer)"
    ) {
      nodes {
        ...ProductCard
      }
    }
  }
`;
