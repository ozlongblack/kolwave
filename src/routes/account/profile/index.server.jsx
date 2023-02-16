import {gql} from '@shopify/hydrogen';

import {getApiErrorMessage} from '~/lib/utils';

export async function api(request, {session}) {
  if (request.method !== 'PATCH' && request.method !== 'DELETE') {
    return new Response(null, {
      status: 405,
      headers: {
        Allow: 'PATCH,DELETE',
      },
    });
  }

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

  // TODO: call profile update api
  // const {data, errors} = await contentfulApiRequest({
  //   query: CONTENTFUL_UPDATE_MUTATION,
  //   variables: {
  //     id: profileId,
  //     profile,
  //   },
  // });

  const error = getApiErrorMessage('customerUpdate', data, errors);

  if (error) return new Response(JSON.stringify({error}), {status: 400});

  return new Response(null);
}
