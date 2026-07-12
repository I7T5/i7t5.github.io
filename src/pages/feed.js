import { getRssString } from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getCollection, render } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const container = await AstroContainer.create();
  const feedUrl = new URL('/feed', context.site).href;
  const buildDate = new Date().toUTCString();

  const items = await Promise.all(posts.map(async (post) => {
    const { Content } = await render(post);
    const content = await container.renderToString(Content);

    return {
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      content,
      link: `/posts/${post.id}/`,
    };
  }));

  const rssString = await getRssString({
    title: 'I7T5',
    description: 'hello, friend :)',
    site: context.site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: `
      <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
      <docs>https://www.rssboard.org/rss-specification</docs>
      <lastBuildDate>${buildDate}</lastBuildDate>
      <ttl>60</ttl>
      <language>en-us</language>
    `,
    items,
  });

  return new Response(rssString, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}