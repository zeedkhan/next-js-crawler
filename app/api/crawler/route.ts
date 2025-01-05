import { NextRequest, NextResponse } from "next/server";
import { getBrowser } from "./browser";
import { parseMetaData } from "@/app/crawl/_component/data";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.goto(body.url, { waitUntil: "domcontentloaded" });
        const data = await page.content();
        await browser.close();
        const { title, description, image, cms, hasEmailOrPhone, hasForm } = parseMetaData(data);
        return NextResponse.json({ title, description, image, cms, hasEmailOrPhone, hasForm }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ title: "", description: "", cms: null, image: "", hasEmailOrPhone: false, hasForm: false }, { status: 500 });
    }
}