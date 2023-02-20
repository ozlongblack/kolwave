import {Image} from '@shopify/hydrogen';
import {Text} from '~/components';

export function ProductSummary({children, price, title, vendor, image}) {
  const data = {
    url: image.url,
    height: image.height,
    width: image.width,
    altText: 'featured image',
  };

  return (
    <div className="flex gap-4 items-center first:mt-0 mt-6">
      <Image className="w-16 h-16 rounded-full" data={data}></Image>
      <div className="flex-1">
        <div>
          <Text as="h5" size="lead">
            {price}
          </Text>
        </div>
        <div>
          <Text as="h5" size="lead">
            {vendor}
          </Text>
        </div>
        <div>
          <span className="text-xs text-primary/50">{title}</span>
        </div>
      </div>
      {children}
    </div>
  );
}
