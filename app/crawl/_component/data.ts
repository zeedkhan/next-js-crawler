import { parse } from 'node-html-parser';

type CMSList = Record<string, number>;

export type MetaData = {
    title: string,
    description: string,
    image: string,
    cms: string | null,
    hasForm: boolean,
    hasEmailOrPhone: boolean
}

export type ResultProps = {
    cms: string,
    gtm: string,
    ec: string,
    only_ga4: string,
    hasForm: boolean,
    hasEmailOrPhone: boolean
} & MetaData

export type SupportStatus = "Supported" | "Not Supported" | "Need to manually check";

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
};


const helperCheck = (a: string, b: string) => {
    return a.toLowerCase().includes(b.toLowerCase());
}

const emailRegex = /email|อีเมล/i;
const phoneRegex = /tel|phone|เบอร์|โทรศัพท์/i;

const checkPhoneOrEmail = (input: HTMLElement) => {
    const inName = input.getAttribute("name") || "";
    const inType = input.getAttribute("type") || "";
    const inId = input.getAttribute("id") || "";
    const inPlaceHolder = input.getAttribute("placeholder") || "";

    // Check for email
    const isEmail =
        helperCheck(inName, "email") ||
        helperCheck(inType, "email") ||
        helperCheck(inId, "email") ||
        emailRegex.test(inPlaceHolder);

    // Check for phone
    const isPhone =
        helperCheck(inName, "tel") ||
        helperCheck(inType, "tel") ||
        helperCheck(inId, "tel") ||
        helperCheck(inName, "phone") ||
        helperCheck(inType, "phone") ||
        helperCheck(inId, "phone") ||
        phoneRegex.test(inPlaceHolder);

    return { isEmail, isPhone };
};


/* Parse string HTML to DOM and doing detection */
export const parseMetaData = (data: string): MetaData => {
    const doc = parse(data);
    const tags = Array.from(doc.querySelectorAll('meta, script')).map((meta) => meta.outerHTML.replace(/\s+/g, " ").trim() || "");
    const forms = Array.from(doc.querySelectorAll('form'));

    /* 
    *   We need to ensure the form has: Email field, or Phone field.
        Step to check form fields

        1. Get all form elements
        2: Traverse and checking it's [name], [type], [id], [placeholder]
    */

    let FormHasEmailOrPhone = false;

    forms.forEach((form) => {
        const inputs = Array.from(form.querySelectorAll("input:not([type='hidden'])"));
        inputs.forEach((input) => {
            const { isEmail, isPhone } = checkPhoneOrEmail(input as unknown as HTMLElement);
            if (isEmail || isPhone) {
                FormHasEmailOrPhone = true;
            }
        })
    });

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

    return {
        title, description, image, cms,
        hasForm: forms.length > 0,
        hasEmailOrPhone: FormHasEmailOrPhone
    };
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
        const { title, description, image, cms, hasForm, hasEmailOrPhone } = await response.json();
        return { title, description, image, cms, hasForm, hasEmailOrPhone };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return { title: "", description: "", cms: null, image: "", hasEmailOrPhone: false, hasForm: false };
    }
};

export function isHttps(string: string) {
    try {
        const newUrl = new URL(string);
        return newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
};

export const checkSupportGTM = (cms: string | null): SupportStatus => {
    if (!cms) {
        return "Need to manually check";
    }
    if (CMS_SUPPORT_GTM.includes(cms)) {
        return "Supported";
    };
    return "Not Supported";
};

export const checkSupportEC = (cms: string | null, url: string): boolean => {
    if (!cms) return false;
    if (CMS_NOT_SUPPORT_ENHANCE_CONVERISON.includes(cms) || !isHttps(url)) return false
    return true;
}

export const checkSupportGA4 = (cms: string | null): SupportStatus => {
    if (!cms) {
        return "Need to manually check";
    }
    if (CMS_SUPPORT_GA4_ONLY.includes(cms)) {
        return "Supported";
    };
    return "Not Supported";
}