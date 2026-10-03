// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'مقالات',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: {
            label: 'عنوان مقاله',
            validation: { isRequired: true },
          },
        }),
        description: fields.text({ label: 'توضیح کوتاه' }),
        coverImage: fields.image({
          label: 'تصویر شاخص مقاله',
          directory: 'public/images/posts/',
          publicPath: '/images/posts/',
        }),
        date: fields.date({
          label: 'تاریخ انتشار',
        }),
        content: fields.mdx({
          label: 'محتوا',
        }),
      },
    }),
  },
});
