import { parse } from 'node-html-parser';

type CMSList = Record<string, number>;

export type MetaData = {
    title: string,
    description: string,
    image: string,
    cms: string | null
}

export const cmsList = {
    lnwshop: ["lnwshop", "lnw shop", "lnw"],
    wordpress: ["wordpress", "elementor", "wp-content", "wp-includes", "wp-json"],
    shopify: ["shopify"],
    magento: ["magento"],
    drupal: ["drupal"],
    joomla: ["joomla"],
    wix: ["wix"],
    duda: ["duda"],
    simdif: ["simdif", "simdif website builder"],
    godaddy: ["godaddy"],
    weebly: ["weebly"],
    makewebeasy: ["makewebeasy", "make web easy", "makeweb easy", "makeweb", "makewebstatic"],
    squarespace: ["squarespace", "assets.squarespace", "squarespace.com", "squarespace-cdn"]
}

// Use for checking the CMS that support enhanced conversion installation.
export const CMS_NOT_SUPPORT_ENHANCE_CONVERISON = ["simdif", "godaddy", "weebly", "squarespace"];
export const CMS_SUPPORT_GTM = ["lnwshop", "wordpress", "shopify", "magento", "drupal", "joomla", "wix", "duda", "makewebeasy"];
export const CMS_SUPPORT_GA4_ONLY = ["squarespace", "simdif"];

/* Get max score of detection */
const getMaxCMS = (cmsList: CMSList): { key: string; value: number } | null => {
    const entries = Object.entries(cmsList);
    if (entries.length === 0) {
        return null;
    }
    // Find the max entry
    return entries.reduce(
        (max, [key, value]) => (value > max.value ? { key, value } : max),
        { key: "", value: -Infinity }
    );
}

/* Parse string HTML to DOM and doing detection */
export const parseMetaData = (data: string): MetaData => {
    const doc = parse(data);
    const tags = Array.from(doc.querySelectorAll('meta, script')).map((meta) => meta.outerHTML.replace(/\s+/g, " ").trim() || "");
    const obj: CMSList = {};
    for (const tag of tags) {
        for (const [cms, names] of Object.entries(cmsList)) {
            if (names.some((n) => tag.toLowerCase().includes(n))) {
                if (!obj[cms]) {
                    obj[cms] = 0;
                }
                obj[cms] += 1;
            }
        }
    };

    const cms = getMaxCMS(obj)?.key || null;
    const title = doc.querySelector('meta[property="og:title"]')?.getAttribute("content") || '';
    const description = doc.querySelector('meta[property="og:description"]')?.getAttribute("content") || '';
    const image = doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || '';

    return { title, description, image, cms };
};

export const isUrlValid = (url: string) => {
    const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/g);
    if (res == null)
        return false;
    else
        return true;
}

export const fetchMetadata = async (url: string): Promise<MetaData> => {
    try {
        const response = await fetch("/api/crawler", {
            method: "POST",
            body: JSON.stringify({ url: url.trim() }),
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });
        const { title, description, image, cms } = await response.json();
        return { title, description, image, cms };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return { title: "", description: "", cms: null, image: "" };
    }
};