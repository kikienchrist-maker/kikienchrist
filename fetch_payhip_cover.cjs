const https = require('https');

function fetchPayhipPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function getCoverFromPayhip() {
  try {
    // Fetch the Payhip product page
    const html = await fetchPayhipPage('https://payhip.com/b/gps0X');
    
    // Look for cover image in the HTML
    // Common patterns: og:image, twitter:image, or product cover img
    const ogMatch = html.match(/property="og:image" content="([^"]+)"/i);
    const twitterMatch = html.match(/name="twitter:image" content="([^"]+)"/i);
    const imgMatch = html.match(/<img[^>]+class="[^"]*cover[^"]*"[^>]+src="([^"]+)"/i);
    const jsonLdMatch = html.match(/"image"\s*:\s*"([^"]+)"/i);
    
    console.log('og:image:', ogMatch ? ogMatch[1] : 'not found');
    console.log('twitter:image:', twitterMatch ? twitterMatch[1] : 'not found');
    console.log('cover img:', imgMatch ? imgMatch[1] : 'not found');
    console.log('json-ld image:', jsonLdMatch ? jsonLdMatch[1] : 'not found');
    
    // Also look for pe56d.s3.amazonaws.com pattern
    const s3Matches = html.match(/https:\/\/pe56d\.s3\.amazonaws\.com\/[^"'\s>]+/gi);
    if (s3Matches) {
      console.log('S3 URLs found:', s3Matches);
    }
    
    // Look for cdn-cgi pattern
    const cdnMatches = html.match(/https:\/\/payhip\.com\/cdn-cgi\/image\/[^"'\s>]+/gi);
    if (cdnMatches) {
      console.log('CDN URLs found:', cdnMatches);
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
}

getCoverFromPayhip();