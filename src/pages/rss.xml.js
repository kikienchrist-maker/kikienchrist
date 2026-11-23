import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.lang === 'fr');
  
  // Trier par date décroissante
  posts.sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());
  
  const siteUrl = 'https://kikienchrist.vercel.app';
  
  return rss({
    title: 'Kiki en Christ — Blog',
    description: 'Articles, enseignements et témoignages pour grandir dans votre vie de prière et votre foi.',
    site: siteUrl,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      link: `/fr/blog/${post.slug}/`,
      pubDate: new Date(post.data.pubDate),
      categories: post.data.tags,
      author: post.data.author,
      guid: `/fr/blog/${post.slug}/`,
    })),
    customData: `<language>fr</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>Kiki en Christ</title>
      <link>${siteUrl}</link>
    </image>`,
  });
}