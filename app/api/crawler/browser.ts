const CHROMIUM_PATH = 'https://storage.googleapis.com/cralwer-files/chromium-v126.0.0-pack.tar';

async function getBrowser() {
    if (process.env.VERCEL_ENV === "production") {
      const chromium = await import("@sparticuz/chromium-min").then(
        (mod) => mod.default
      );
  
      const puppeteerCore = await import("puppeteer-core").then(
        (mod) => mod.default
      );
  
      const executablePath = await chromium.executablePath(CHROMIUM_PATH);
  
      const browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
      return browser;
    } else {
      const puppeteer = await import("puppeteer").then((mod) => mod.default);
  
      const browser = await puppeteer.launch();
      return browser;
    }
  }

export {
    getBrowser
}