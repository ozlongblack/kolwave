import {Image} from '@shopify/hydrogen';

export function ProductSummary({price, title, vendor, image}) {
  const data = {
    url: image.url,
    height: image.height,
    width: image.width,
    altText: 'featured image',
  };
  return (
    <div className="flex items-center">
      <Image className="h-16 w-16 rounded-full" data={data}></Image>
      <div className="grid-rows-3">
        <div>{price}</div>
        <div>{vendor}</div>
        <div>{title}</div>
      </div>
    </div>
  );
}
