import {Image} from '@shopify/hydrogen';
import {Text} from '~/components';

export function ProductSummary({price, title, vendor, image}) {
  const data = {
    url: image.url,
    height: image.height,
    width: image.width,
    altText: 'featured image',
  };

  return (
    <div className="flex gap-4 items-center">
      <Image className="w-16 h-16 rounded-full" data={data}></Image>
      <div>
        <div>
          <Text as="h3" size="lead">
            {price}
          </Text>
        </div>
        <div>
          <Text as="h3" size="lead">
            {vendor}
          </Text>
        </div>
        <div>
          <Text as="span" className="text-sm text-primary/50">
            {title}
          </Text>
        </div>
      </div>
    </div>
  );
}
