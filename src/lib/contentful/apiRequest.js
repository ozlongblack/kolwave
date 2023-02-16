export const contentfulApiRequest = async ({query, variables}) => {
  const response = await fetch(process.env.PRIVATE_CONTENTFUL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PRIVATE_CONTENTFUL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return response.json();
};
