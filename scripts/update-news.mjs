import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const feeds=[
  ['物流','物流 OR 運送 OR 配送 when:7d'],
  ['安全・事故','トラック 事故 OR 交通安全 OR 運転者教育 when:7d'],
  ['法令・行政','国土交通省 物流 OR トラック 法改正 when:14d'],
  ['冷凍・冷蔵','コールドチェーン OR 冷凍物流 OR 冷蔵配送 when:14d'],
  ['道路・交通','高速道路 通行止め OR 道路規制 トラック when:7d']
];
const decode=s=>s.replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const clean=s=>decode(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const tag=(xml,name)=>{const m=xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'));return m?m[1]:''};
const sourceOf=item=>clean(tag(item,'source'))||'ニュース提供元';
const titleOf=item=>clean(tag(item,'title')).replace(/\s+-\s+[^-]+$/,'');
const idFor=url=>createHash('sha1').update(url).digest('hex').slice(0,16);

const articles=[];
for(const [category,query] of feeds){
  const url=`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ja&gl=JP&ceid=JP:ja`;
  try{
    const response=await fetch(url,{headers:{'user-agent':'DeliveryNewsBoard/1.0'}});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const xml=await response.text();
    for(const item of xml.match(/<item>[\s\S]*?<\/item>/gi)||[]){
      const link=clean(tag(item,'link')),title=titleOf(item);if(!link||!title)continue;
      articles.push({id:idFor(link),title,description:`${sourceOf(item)}が配信した最新記事です。詳しい内容は記事元でご確認ください。`,url:link,source:sourceOf(item),category,publishedAt:new Date(clean(tag(item,'pubDate'))).toISOString()});
    }
  }catch(error){console.error(`${category}: ${error.message}`)}
}
const unique=[...new Map(articles.map(a=>[a.title,a])).values()].sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt)).slice(0,80);
if(unique.length<5)throw new Error(`取得記事が少なすぎます: ${unique.length}件`);
await writeFile(new URL('../dist/data/news.json',import.meta.url),JSON.stringify({updatedAt:new Date().toISOString(),articles:unique},null,2)+'\n');
console.log(`${unique.length}件のニュースを保存しました`);
