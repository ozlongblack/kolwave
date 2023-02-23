import {IconShop, Text} from '~/components';
import {Drawer} from './Drawer.client';
import {Link} from '@shopify/hydrogen';
import {startTransition} from 'react';

export function MenuDrawer({isOpen, onClose, link, menu}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left">
      <div className="grid">
        <MenuMobileNav link={link} menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({link, menu, onClose}) {
  return (
    <>
      <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8 border-b border-primary/10">
        {/* Top level menu items */}
        {(link?.items || []).map((item) => (
          <Link
            key={item.id}
            to={item.to}
            target={item.target}
            onClick={() => startTransition(onClose)}
          >
            <Text as="span" size="copy" className="font-proxima">
              {item.title}
            </Text>
          </Link>
        ))}
      </nav>
      <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
        <Text as="h3" className="flex gap-2 font-proxima font-bold">
          <IconShop className="fill-contrast" />
          Shop
        </Text>
        {(menu?.items || []).map((item) => (
          <Link
            key={item.id}
            to={item.to}
            target={item.target}
            onClick={() => startTransition(onClose)}
          >
            <Text as="span" size="copy" className="font-proxima">
              {item.title}
            </Text>
          </Link>
        ))}
      </nav>
    </>
  );
}
