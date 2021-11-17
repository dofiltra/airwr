/* eslint-disable @typescript-eslint/no-explicit-any */

export default function FooterSmall(props: any) {
  return (
    <>
      <footer
        className={(props.absolute ? ' bottom-0' : 'relative') + ' pb-6 py-5'}
      >
        <div className="container mx-auto px-4">
          <hr className="mb-6 border-b-1 border-gray-700" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-white font-semibold py-1">
                Copyright © {new Date().getFullYear()}{' '}
                <a
                  href="https://dofiltra.com"
                  className="text-white hover:text-gray-400 text-sm font-semibold py-1"
                >
                  Dofiltra
                </a>
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3"
                  ></a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/contacts"
                    className="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3"
                  >
                    Contacts
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
