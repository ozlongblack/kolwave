import {Image} from '@shopify/hydrogen';

import {Text} from '~/components';

export function Profile({profile, tags}) {
  return (
    <div className="flex gap-4">
      <Image
        data={profile.image}
        className="w-16 h-16"
        alt={profile.nickname}
      />
      <div className="flex-1">
        <Text as="h3" size="h3">
          {profile.nickname}
        </Text>
        <div className="mt-1 flex flex-wrap gap-2">
          {tags &&
            tags.map((tag) => (
              <Text key={tag} size="small" className="text-comment">
                {tag}
              </Text>
            ))}
        </div>
      </div>
    </div>
  );
}
