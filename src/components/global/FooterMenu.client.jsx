// @ts-expect-error @headlessui/react incompatibility with node16 resolution

/**
 * A server component that specifies the content of the footer on the website
 */
export function FooterMenu({menu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <a href="/policies/terms-of-service" target="_self">
            {item.title}
          </a>
        </section>
      ))}{' '}
    </>
  );
}
