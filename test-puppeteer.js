const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('crei_session', JSON.stringify({ user: "TestUser" }));
  });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  try {
    await page.goto('http://localhost:3000/legacy-apps/comprobante/index.html?v=test', { waitUntil: 'load' });
    
    // Evaluate if loadGastos ran
    const tbody = await page.$eval('#gastos-tbody', el => el.innerHTML).catch(() => 'no tbody');
    console.log('Tbody Content:', tbody.substring(0, 50));
    
    const userValue = await page.$eval('#usuario_sso', el => el.value).catch(() => 'no input');
    console.log('Final Input Value:', userValue);
  } catch(e) {
    console.error('Script Failed:', e.message);
  }
  await browser.close();
})();
