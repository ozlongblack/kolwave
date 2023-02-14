import * as contentful from 'contentful-management';

// TODO use envs:
// e.g.
// const ACCESS_TOKEN = Oxygen.env.CONTENTFUL_ACCESS_TOKEN;
const SPACE_ID = '4hyb8lwcjzfs';
const CMA_ACCESS_TOKEN = 'CFPAT-EQOY1J114cOdW6n5vhX107WT0_pQkVF5HhfmQN-XheE';
const ENVIRONMENT_ID = 'master';

const CONTENT_TYPE_ID_VIDEO = 'video';

export function deleteVideoAsset(assetId) {
  createClient()
    .then((environment) => environment.getAsset(assetId))
    .then((asset) => asset.unpublish())
    .then((asset) => asset.delete())
    .catch(console.error);
}

export async function postVideoEntry({
  file,
  title,
  description,
  tags,
  relatedProducts,
  userId,
}) {
  const asset = await postVideoAsset({
    file,
    title: `${userId}: ${file.name}`,
    description: `Video asset for VideoPost:${title}`,
  });

  await createVideoPostEntry({
    title,
    description,
    tags,
    relatedProducts,
    userId,
    videoId: asset.sys.id,
  });
}

function postVideoAsset({file, title, description}) {
  return createClient()
    .then((environtment) =>
      environtment.createAssetFromFiles({
        fields: {
          title: {
            'en-US': title,
          },
          description: {
            'en-US': description,
          },
          file: {
            'en-US': {
              contentType: file.type,
              fileName: file.name,
              file,
            },
          },
        },
      }),
    )
    .then((asset) => asset.processForLocale('en-US'))
    .then((asset) => asset.publish())
    .catch(console.error);
}

function createVideoPostEntry({
  title,
  description,
  tags,
  relatedProducts,
  userId,
  videoId,
}) {
  createClient()
    .then((environment) =>
      environment.createEntry(CONTENT_TYPE_ID_VIDEO, {
        fields: {
          title: {
            'en-US': title,
          },
          description: {
            'en-US': description,
          },
          tags: {
            'en-US': tags,
          },
          relatedProducts: {
            'en-US': relatedProducts,
          },
          userId: {
            'en-US': userId,
          },
          viewCount: {
            'en-US': 0,
          },
          video: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: videoId,
              },
            },
          },
        },
      }),
    )
    .then((entry) => entry.publish())
    .catch(console.error);
}

function createClient() {
  const client = contentful.createClient({
    accessToken: CMA_ACCESS_TOKEN,
  });

  return client
    .getSpace(SPACE_ID)
    .then((space) => space.getEnvironment(ENVIRONMENT_ID));
}
