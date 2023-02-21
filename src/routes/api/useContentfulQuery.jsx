import {useQuery} from '@shopify/hydrogen';

export const useContentfulQuery = ({query, variables, key = []}) => {
  const {data} = useQuery(key, async () => {
    const response = await fetch(import.meta.env.VITE_PRIVATE_CONTENTFUL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          import.meta.env.VITE_PRIVATE_CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    return response.json();
  });

  return data;
};
