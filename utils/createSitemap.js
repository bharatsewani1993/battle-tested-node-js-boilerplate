const path = require('path');
const fs = require('fs');
const { pages } = require('../objects/page.objects');
const { success, failure } = require('../objects/return.objects');


const createSitemap = () => {
    const pagesObj = pages().pages;
    const domain = 'https://dubninja.com';
    const filePath = path.join('public', 'sitemap.xml');

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    Object.entries(pagesObj).forEach(([pageName, pagePath]) => {
        const url = `${domain}/${pagePath}`;
        xml += `  <url>\n`;
        xml += `    <loc>${url}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n`; // You can adjust this value as per your requirement
        xml += `    <changefreq>monthly</changefreq>\n`; // You can adjust this value as per your requirement
        xml += `    <priority>0.8</priority>\n`; // You can adjust this value as per your requirement
        xml += `  </url>\n`;
    });

    xml += '</urlset>';

    // Write XML content to the file
    fs.writeFileSync(filePath, xml, 'utf8');

    const successObj = success();
    return successObj;
}

module.exports = {
    createSitemap
}