const https = require('https');
const fs = require('fs');
const path = require('path');

const postersDir = path.join(__dirname, '..', 'public', 'posters');

if (!fs.existsSync(postersDir)) {
  fs.mkdirSync(postersDir, { recursive: true });
}

const posters = [
  {
    filename: 'lion-king.jpg',
    url: 'https://image.tmdb.org/t/p/w500/2bXbqYdUdNVa8VIWXVfclP2ICtT.jpg'
  },
  {
    filename: 'frozen.jpg',
    url: 'https://image.tmdb.org/t/p/w500/kgwjIb2JDHRhNk13lmSxiClFjVk.jpg'
  },
  {
    filename: 'moana.jpg',
    url: 'https://image.tmdb.org/t/p/w500/z4x0Bp48ar3wdaTjkk3W72EwKqz.jpg'
  },
  {
    filename: 'mandalorian.jpg',
    url: 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg'
  },
  {
    filename: 'encanto.jpg',
    url: 'https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcP0U9oz.jpg'
  },
  {
    filename: 'wandavision.jpg',
    url: 'https://image.tmdb.org/t/p/w500/glKDfE6btircFfXcWyqVXhJxHtm.jpg'
  },
  {
    filename: 'toy-story.jpg',
    url: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg'
  },
  {
    filename: 'little-mermaid.jpg',
    url: 'https://image.tmdb.org/t/p/w500/ym1dxyOk4jFcSl4x2f37UVH6b73.jpg'
  },
  {
    filename: 'free-solo.jpg',
    url: 'https://image.tmdb.org/t/p/w500/1QpO9wo7JWecUh4bLTd2Aq2n7bL.jpg'
  },
  {
    filename: 'clone-wars.jpg',
    url: 'https://image.tmdb.org/t/p/w500/2sbvYx6q1h6jL3d8K2qoXf3t3WZ.jpg'
  },
  {
    filename: 'zootopia.jpg',
    url: 'https://image.tmdb.org/t/p/w500/hsrWMMnRmIEYcCU8OIQnb5dt3WV.jpg'
  },
  {
    filename: 'loki.jpg',
    url: 'https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg'
  }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

async function downloadAllPosters() {
  console.log('Downloading poster images...');
  
  for (const poster of posters) {
    const filepath = path.join(postersDir, poster.filename);
    
    if (fs.existsSync(filepath)) {
      console.log(`Skipping ${poster.filename} (already exists)`);
      continue;
    }
    
    try {
      console.log(`Downloading ${poster.filename}...`);
      await downloadImage(poster.url, filepath);
      console.log(`✓ Downloaded ${poster.filename}`);
    } catch (error) {
      console.error(`✗ Failed to download ${poster.filename}:`, error.message);
    }
  }
  
  console.log('Done!');
}

downloadAllPosters().catch(console.error);

