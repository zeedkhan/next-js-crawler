import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
const chromiumFile = 'https://github.com/Sparticuz/chromium/releases/download/v126.0.0/chromium-v126.0.0-pack.tar';

async function getBrowser() {
    return await puppeteer.launch({
        args: isLocal ? puppeteer.defaultArgs() : chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(chromiumFile),
        headless: chromium.headless,
    });
}

export {
    getBrowser
}