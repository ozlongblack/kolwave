import {Suspense} from 'react';
import {
  gql,
  Image,
  Seo,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';

import {Heading, PageHeader, Section} from '~/components';
import {Layout} from '~/components/index.server';
import {abbreviateNumber} from '~/lib/utils';
import {useContentfulQuery} from '../api/useContentfulQuery';

export default function Trending() {
  const {data: contentfulData} = useContentfulQuery({
    query: PROFILE_QUERY,
  });

  const {profileCollection} = contentfulData;
  const profiles = profileCollection?.items || [];

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
      {profiles.length && <Profiles data={profiles} />}

      <Section></Section>
      <Section></Section>
    </Layout>
  );
}

function Profiles({data}) {
  return (
    <>
      <Heading as="h2" size="lead" className="px-6 md:px-8 lg:px-12">
        Top 3 KOLs
      </Heading>
      <div className="swimlane hiddenScroll mt-6 pb-6 md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12 border-b border-primary/10">
        {data.map((profile) => (
          <div key={profile.sys.id} className="grid gap-2 snap-start w-40">
            <Image data={profile.banner} className="rounded-md" />
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
