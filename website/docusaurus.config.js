// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/dracula');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'State Pool',
  tagline: 'React state management library based on global variables and react hooks',
  url: 'https://yezyilomo.github.io',
  baseUrl: '/state-pool/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'yezyilomo', // Usually your GitHub org/user name.
  projectName: 'state-pool', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'State Pool',
        logo: {
          alt: 'State Pool Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction/motivation',
            position: 'left',
            label: 'Docs',
          },
          /*{to: '/blog', label: 'Blog', position: 'left'},*/
          {
            position: 'left',
            label: 'Concepts',
            to: '/docs/basic_concepts/store',
          },
          {
            href: 'https://github.com/yezyilomo/state-pool',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/basic_tutorial/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/yezyilomo',
              },
            ],
          },
          {
            title: 'More',
            items: [
              /*
              {
                label: 'Blog',
                to: '/blog',
              },
              */
              {
                label: 'GitHub',
                href: 'https://github.com/yezyilomo/state-pool/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} State Pool, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
