import {Suspense} from 'react';
import {useLocalization, useShopQuery, CacheLong, gql} from '@shopify/hydrogen';

import {Header} from '~/components';
import {Footer} from '~/components/index.server';
import {parseMenu} from '~/lib/utils';

const HEADER_LINK_HANDLE = 'main-link';
const HEADER_MENU_HANDLE = 'main-menu';
const FOOTER_MENU_HANDLE = 'footer';

const SHOP_NAME_FALLBACK = 'Hydrogen';

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export function Layout({children}) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <Suspense fallback={<Header title={SHOP_NAME_FALLBACK} />}>
          <HeaderWithMenu />
        </Suspense>
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      <Suspense fallback={<Footer />}>
        <FooterWithMenu />
      </Suspense>
    </>
  );
}

function HeaderWithMenu() {
  const {headerLink, headerMenu, shopLogo, shopName} = useLayoutQuery();
  return (
    <Header
      link={headerLink}
      menu={headerMenu}
      logo={shopLogo}
      title={shopName}
    />
  );
}

function FooterWithMenu() {
  const {footerMenu, shopLogo, shopName} = useLayoutQuery();
  return <Footer menu={footerMenu} logo={shopLogo} title={shopName} />;
}

function useLayoutQuery() {
  const {
    language: {isoCode: languageCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: SHOP_QUERY,
    variables: {
      language: languageCode,
      headerLinkHandle: HEADER_LINK_HANDLE,
      headerMenuHandle: HEADER_MENU_HANDLE,
      footerMenuHandle: FOOTER_MENU_HANDLE,
    },
    cache: CacheLong(),
    preload: '*',
  });

  const shopLogo = data ? data.shop.brand.logo.image : null;
  const shopName = data ? data.shop.name : SHOP_NAME_FALLBACK;

  /*
        Modify specific links/routes (optional)
        @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
        e.g here we map:
          - /blogs/news -> /news
          - /blog/news/blog-post -> /news/blog-post
          - /collections/all -> /products
      */
  const customPrefixes = {BLOG: '', CATALOG: 'products'};

  const headerLink = data?.headerLink
    ? parseMenu(data.headerLink, customPrefixes)
    : undefined;

  const headerMenu = data?.headerMenu
    ? parseMenu(data.headerMenu, customPrefixes)
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(data.footerMenu, customPrefixes)
    : undefined;

  return {footerMenu, headerLink, headerMenu, shopLogo, shopName};
}

const SHOP_QUERY = gql`
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  query layoutMenus(
    $language: LanguageCode
    $headerLinkHandle: String!
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext(language: $language) {
    shop {
      name
      brand {
        logo {
          image {
            url
            width
            height
          }
        }
      }
    }
    headerLink: menu(handle: $headerLinkHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
  }
`;
