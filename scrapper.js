const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function getDescriptionValue(instagramPostUrl) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(instagramPostUrl);
    const html = await page.content();

    // Utilitza Cheerio per carregar el contingut HTML
    const $ = cheerio.load(html);

    // Busca el valor de la etiqueta meta amb name="description"
    const descriptionValue = $('meta[name="description"]').attr('content');

    if (descriptionValue) {
      return descriptionValue;
    } else {
      throw new Error('No s\'ha pogut trobar el valor de la etiqueta meta "description"');
    }
    await browser.close();
  } catch (error) {
    throw new Error('S\'ha produït un error:', error);
  }
}
