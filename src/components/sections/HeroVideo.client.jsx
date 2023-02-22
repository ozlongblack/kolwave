import {AddToCartButton, ProductOptionsProvider} from '@shopify/hydrogen';
import {
  IconAddToCart,
  ProductSummary,
  Profile,
  Section,
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
      <Profile profile={profile} tags={tags} />
      <Video video={video} viewCount={viewCount} className="rounded-md" />
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
