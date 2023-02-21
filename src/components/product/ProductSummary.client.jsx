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
          <Text as="h5" size="copy" className="font-proxima">
            {price}
          </Text>
        </div>
        <div>
          <Text as="h5" size="copy" className="font-proxima">
            {vendor}
          </Text>
        </div>
        <div>
          <Text size="body" className="font-proxima text-comment">
            {title}
          </Text>
        </div>
      </div>
      {children}
    </div>
  );
}
