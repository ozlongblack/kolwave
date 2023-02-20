import {
  AddToCartButton,
  Image,
  ProductOptionsProvider,
} from '@shopify/hydrogen';
import {
  IconAddToCart,
  ProductSummary,
  Section,
  Text,
  Video,
} from '~/components';

export function HeroVideo({
  profile,
  title = 'Hero Video',
  video,
  viewCount,
  tags,
  relatedProducts,
  ...props
}) {
  return (
    <Section {...props} heading={title}>
      <div className="flex gap-4 mb-4">
        <Image data={profile.image} className="w-16 h-16" />
        <div className="flex-1">
          <Text as="h3">{profile.nickname}</Text>
          <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-primary/50">
            {tags && tags.map((tag) => <span key="tag">{tag}</span>)}
          </div>
        </div>
      </div>
      <Video video={video} viewCount={viewCount} />
      <div className="mt-6">
        {relatedProducts.map((relatedProduct) => (
          <ProductOptionsProvider key={relatedProduct.id} data={relatedProduct}>
            <ProductSummary {...relatedProduct}>
              <div className="flex items-center justify-center w-12 h-12 bg-signature rounded-full">
                <AddToCartButton
                  variantId={relatedProduct?.variants.edges[0].node.id}
                  quantity={1}
                  accessibleAddingToCartLabel="Adding item to your cart"
                  disabled={
                    !relatedProduct?.variants.edges[0].node.availableForSale ||
                    false
                  }
                  type="button"
                >
                  <IconAddToCart className="w-7 h-7 fill-contrast" />
                </AddToCartButton>
              </div>
            </ProductSummary>
          </ProductOptionsProvider>
        ))}
      </div>
    </Section>
  );
}
