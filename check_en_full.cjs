const https = require('https');

https.get('https://kikienchrist.vercel.app/en/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find the section with "Each book stands alone"
    const idx = data.indexOf('Each book stands alone');
    if (idx >= 0) {
      console.log('Context around that text:');
      console.log(data.slice(idx - 200, idx + 500));
    } else {
      console.log('Text not found');
    }
  });
}).on('error', console.error);