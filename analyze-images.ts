import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function analyzeImages() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const heroDir = path.join(__dirname, 'public', 'hero');
  const files = fs.readdirSync(heroDir).filter(f => 
    /\.(jpg|jpeg|png|webp|avif)$/i.test(f)
  );
  
  console.log(`Analyzing ${files.length} images...`);
  
  for (const file of files) {
    const filePath = `file://${path.join(heroDir, file)}`;
    
    await page.setContent(`
      <html><body style="margin:0;background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh">
        <img id="img" src="${filePath}" style="max-width:100%;max-height:100vh">
      </body></html>
    `);
    
    await page.waitForSelector('#img');
    await page.waitForTimeout(500);
    
    const analysis = await page.evaluate(() => {
      const img = document.getElementById('img') as HTMLImageElement;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Downscale for performance
      const maxDim = 400;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      
      // Analyze in horizontal bands (top to bottom)
      const bands = 20;
      const bandHeight = h / bands;
      const bandScores: number[] = [];
      
      for (let b = 0; b < bands; b++) {
        const yStart = Math.floor(b * bandHeight);
        const yEnd = Math.floor((b + 1) * bandHeight);
        let variance = 0;
        let brightness = 0;
        let count = 0;
        
        for (let y = yStart; y < yEnd; y++) {
          for (let x = 0; x < w; x += 2) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b_val = data[idx + 2];
            const avg = (r + g + b_val) / 3;
            brightness += avg;
            count++;
          }
        }
        
        const avgBrightness = brightness / count;
        
        // Calculate variance within this band
        let sumSqDiff = 0;
        for (let y = yStart; y < yEnd; y++) {
          for (let x = 0; x < w; x += 2) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b_val = data[idx + 2];
            const avg = (r + g + b_val) / 3;
            sumSqDiff += (avg - avgBrightness) ** 2;
          }
        }
        variance = Math.sqrt(sumSqDiff / count);
        
        // Score = high variance + moderate brightness = likely subject
        bandScores.push({
          band: b,
          yPercent: ((b + 0.5) / bands * 100).toFixed(1),
          variance: variance.toFixed(2),
          brightness: avgBrightness.toFixed(1),
        });
      }
      
      // Find band with highest variance (most detail = likely subject)
      let maxVarBand = 0;
      let maxVar = 0;
      bandScores.forEach((s, i) => {
        const score = parseFloat(s.variance);
        if (score > maxVar) {
          maxVar = score;
          maxVarBand = i;
        }
      });
      
      // Find top 3 bands with highest variance
      const topBands = [...bandScores]
        .sort((a, b) => parseFloat(b.variance) - parseFloat(a.variance))
        .slice(0, 3)
        .map(s => ({...s, variance: parseFloat(s.variance)}));
      
      return {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(3),
        maxVarBand: bandScores[maxVarBand].yPercent,
        maxVariance: bandScores[maxVarBand].variance,
        topBands: topBands.map(b => ({
          yPercent: b.yPercent,
          variance: b.variance,
          brightness: b.brightness,
        })),
        bandScores: bandScores.map(s => ({
          y: s.yPercent,
          v: parseFloat(s.variance),
          b: parseFloat(s.brightness),
        })),
      };
    });
    
    console.log(`\n=== ${file} ===`);
    console.log(`  Size: ${analysis.naturalWidth}x${analysis.naturalHeight} (AR: ${analysis.aspectRatio})`);
    console.log(`  Highest detail band: ${analysis.maxVarBand}% from top (variance: ${analysis.maxVariance})`);
    console.log(`  Top 3 detail bands: ${analysis.topBands.map(b => `${b.yPercent}% (v:${b.variance}, b:${b.brightness})`).join(', ')}`);
    
    // Print band scores for reference
    console.log(`  All bands: ${analysis.bandScores.map(s => `${s.y}%: v=${s.v.toFixed(1)}, b=${s.b.toFixed(0)}`).join(' | ')}`);
  }
  
  await browser.close();
}

analyzeImages().catch(console.error);