const https = require('https');

https.get('https://kikienchrist.vercel.app/en/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all paper buttons
    const matches = data.matchAll(/<a class="btn btn-small btn-primary"[^>]*href="[^"]*lulu[^"]*"[^>]*>([^<]+)<\/a>/g);
    for (const m of matches) {
      console.log('Button:', JSON.stringify(m[1]));
    }
  });
}).on('error', console.error);