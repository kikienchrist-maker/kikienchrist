const https = require('https');
const fs = require('fs');

function fetchPayhipPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      maxRedirects: 5
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        resolve(data);
      });
    }).on('error', reject);
  });
}

async function getCoverFromPayhip() {
  try {
    const html = await fetchPayhipPage('https://payhip.com/b/gps0X');
    
    // Save HTML for inspection
    fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/payhip_page.html', html);
    console.log('HTML saved, length:', html.length);
    
    // Search for any image URLs
    const patterns = [
      /https:\/\/pe56d\.s3\.amazonaws\.com\/[^"'\s>]+/gi,
      /https:\/\/payhip\.com\/cdn-cgi\/image\/[^"'\s>]+/gi,
      /"image"\s*:\s*"([^"]+)"/gi,
      /og:image["'\s]+content=["']([^"']+)["']/gi,
      /twitter:image["'\s]+content=["']([^"']+)["']/gi,
      /<img[^>]+src=["']([^"']+)["']/gi,
    ];
    
    patterns.forEach((pattern, i) => {
      const matches = html.match(pattern);
      if (matches) {
        console.log(`Pattern ${i}:`, [...new Set(matches)].slice(0, 10));
      }
    });
    
  } catch (e) {
    console.error('Error:', e.message);
  }
}

getCoverFromPayhip();