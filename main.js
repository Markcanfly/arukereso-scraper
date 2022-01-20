const Apify = require('apify');
const cheerio = require('cheerio');
const playwright = require('playwright')

async function addPageUrls(requestQueue, baseUrl, nProducts) {
    for (let i = 0; i < nProducts; i = i + 25) {
        await requestQueue.addRequest({ url: baseUrl + '?start=' + i, userData: { label: 'list' }});
    }
}

function parsePrice(priceText) {
    const regex = /([\d]+)(,[\d]+)?/gm;
    const m = regex.exec(priceText.replaceAll(' ', ''));
    let price = 0;
    price += parseInt(m[1]);
    if (m[2]) {
        price += parseFloat('0' + m[2].replace(',', '.'));
    }
    return price;
}

Apify.main(async () => {
    const input = await Apify.getInput();
    const url = input.url.split('?')[0]; // Remove params
    var nProducts = 0;
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: url , userData: { label: 'home' }});
    const crawler = new Apify.PlaywrightCrawler({
        requestQueue,
        launchContext: {
            launchOptions: {
                headless: true,
            },
        },
        handlePageFunction: async ({ page, request }) => {
            if (request.userData.label === 'home') {
                $ = cheerio.load(await page.content());
                nProducts = parseInt($('div.category-navbar span.product-num span').text().split(' ')[0])
                await addPageUrls(requestQueue, url, nProducts);
                return;
            }
            if (request.userData.label === 'list') {
                await Apify.utils.enqueueLinks({
                    page,
                    requestQueue,
                    selector: 'div.product-box div.name a[href]',
                    transformRequestFunction: request => { request.userData.label = 'product'; return request; },
                })
                return;
            }
            if (request.userData.label === 'product') {
                $ = cheerio.load(await page.content());
                const offers = [];
                $('div[itemprop="offers"]').each((_, el) => { 
                    const e = $(el);
                    const offer = {
                        name: e.find('div.offer-name h4').text(),
                        price: parsePrice(e.find('[itemprop="price"]').text()),
                        shop: e.find('.shopname').text(),
                        url: e.find('a.jumplink-overlay').prop('href').split('&ProductType')[0]
                    }
                    offers.push(offer);
                })
                await Apify.pushData({
                    url: request.url,
                    id: $('[data-product]').data('product'),
                    name: $('div.product-details h1').text().trim(),
                    recommendedPrice: parsePrice($('div.product-details .price').text()),
                    offers: offers
                })
                return;
            }
        }
    });
    await crawler.run();
});
