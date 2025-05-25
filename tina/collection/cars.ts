import type { Collection } from 'tinacms';

const CarsCollection: Collection = {
  name: 'cars',
  label: 'Diecast Cars',
  path: 'src/content/cars', // Matches your Astro content collection path
  format: 'md', // Files are Markdown
  ui: {
    // How items are displayed in the CMS list
    router: ({ document }) => {
      // This generates a link to the live page if your routing is set up
      // Assuming your diecast car pages are at /diecasts/[slug]
      // and the filename is the slug (without .md)
      return `/diecasts/${document._sys.filename}`;
    },
    filename: {
      // How filenames are generated
      slugify: values => {
        // Example: "Porsche 911 GT3 RS - Hot Wheels" -> "porsche-911-gt3-rs-hot-wheels"
        const name = values.name?.toLowerCase().replace(/\s+/g, '-') || 'untitled';
        const brand = values.brand?.toLowerCase().replace(/\s+/g, '-') || 'unknown-brand';
        return `${name}-${brand}`;
      },
      readonly: false, // Allow slug to be edited before creation if needed
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Name',
      name: 'name',
      isTitle: true, // This field will be used as the title in the CMS UI
      required: true,
    },
    {
      type: 'string',
      label: 'Brand',
      name: 'brand',
      required: true,
    },
    {
      type: 'string',
      label: 'Series',
      name: 'series',
    },
    {
      type: 'number',
      label: 'Model Year (Real Car)',
      name: 'model_year',
    },
    {
      type: 'object',
      label: 'Photo Gallery',
      name: 'photo_gallery',
      list: true, // This makes it a list of objects
      required: true,
      ui: {
        itemProps: (item) => {
          // Customize how each gallery item is displayed in the list
          return { label: item.image_url ? item.image_url.split('/').pop() : "New Image" };
        },
      },
      fields: [
        {
          type: 'image',
          label: 'Image',
          name: 'image_url',
          required: true,
        },
        {
          type: 'boolean',
          label: 'Is Main Photo?',
          name: 'is_main',
          required: false,
        },
      ],
    },
    {
      type: 'string',
      label: 'Scale',
      name: 'scale',
      required: true,
      options: ['1:64', '1:43', '1:24', '1:18', 'Other'], // Add common options
    },
    {
      type: 'number',
      label: 'Purchase Price (Hidden on site)',
      name: 'purchase_price',
    },
    {
      type: 'string',
      label: 'Tags',
      name: 'tags',
      list: true, // Makes it an array of strings
      ui: {
        // component: 'tags' // This can make it a tag-style input if available or custom
      }
    },
    {
      type: 'string',
      label: 'Status',
      name: 'status',
      options: [
        { label: 'For Trade', value: 'for_trade' },
        { label: 'In Collection', value: 'in_collection' },
        { label: 'Wishlist', value: 'wishlist' },
      ],
    },
    {
      type: 'rich-text', // Use rich-text for Markdown content
      label: 'Notes',
      name: 'notes', // This will be stored in the frontmatter.
                      // If you want it as the main body of the MD file, name it 'body' and ensure it's the last field or configure `isBody: true`
    },
    // If you prefer 'notes' to be the main content of the Markdown file (after the frontmatter)
    // you would typically name this field 'body' and make sure it's the last one, or use:
    // {
    //   type: 'rich-text',
    //   label: 'Notes (Body)',
    //   name: 'body', // Special name for main content
    //   isBody: true,
    // }
  ],
};

export default CarsCollection; 