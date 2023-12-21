const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons")

module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
    iconsPlugin({collections: getIconCollections(["gravity-ui", "tabler", "mdi"])}),
    require('@tailwindcss/forms'),
    require('daisyui')
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-12': 'repeat(auto-fit, 3rem)',
        'auto-14': 'repeat(auto-fit, 3.5rem)',
        'auto-16': 'repeat(auto-fit, 4rem)',
        'auto-18': 'repeat(auto-fit, 4.5rem)',
        'auto-20': 'repeat(auto-fit, 5rem)',
        '6-24': 'repeat(6, 6rem)',
        '3-24': 'repeat(3, 6rem)',
        '6-22': 'repeat(6, 5.5rem)',
        '3-22': 'repeat(3, 5.5rem)',
        '6-20': 'repeat(6, 5rem)',
        '3-20': 'repeat(3, 5rem)',
        '6-16': 'repeat(6, 4rem)',
        '4-16': 'repeat(4, 4rem)',
        '6-12': 'repeat(6, 3rem)',
        '4-12': 'repeat(4, 3rem)'

      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    }
  },
  daisyui: {
    themes: [
      {
        mytheme: {

        }
      }
    ]
  }
};
