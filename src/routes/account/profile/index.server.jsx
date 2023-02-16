import {CacheNone, gql} from '@shopify/hydrogen';

import {getApiErrorMessage} from '~/lib/utils';
import {useContentfulQuery} from '../../api/useContentfulQuery';

export async function api(request, {session, queryShop}) {
  if (request.method !== 'PATCH' && request.method !== 'DELETE') {
    return new Response(null, {
      status: 405,
      headers: {
        Allow: 'PATCH,DELETE',
      },
    });
  }

  console.log(queryShop);

  if (!session) {
    return new Response('Session storage not available.', {
      status: 400,
    });
  }

  const {customerAccessToken} = await session.get();

  if (!customerAccessToken) return new Response(null, {status: 401});

  const {profileId, hair, skin, tone, lip, image, banner} =
    await request.json();

  const profile = {};

  if (hair) profile.hair = hair;
  if (skin) profile.skin = skin;
  if (tone) profile.tone = tone;
  if (lip) profile.lip = lip;
  if (image) profile.image = image;
  if (banner) profile.banner = banner;

  const {data, errors} = await useContentfulQuery({
    query: CONTENTFUL_UPDATE_MUTATION,
    variables: {
      id: profileId,
      profile,
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  const error = getApiErrorMessage('customerUpdate', data, errors);

  if (error) return new Response(JSON.stringify({error}), {status: 400});

  return new Response(null);
}

const CONTENTFUL_UPDATE_MUTATION = gql`
  mutation profileUpdate($id: ID!, $profile: Profile!) {
    profileUpdate(id: $id, profile: $profile) {
      profileErrors {
        code
        field
        message
      }
    }
  }
`;
