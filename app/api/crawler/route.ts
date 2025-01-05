import { NextRequest, NextResponse } from "next/server";
import { getBrowser } from "./browser";
import { parseMetaData } from "@/app/crawl/_component/data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.goto(body.url, { waitUntil: "domcontentloaded" });
        const data = await page.content();
        await browser.close();

        const { title, description, image, cms } = parseMetaData(data);

        // const res = await axios.get(body.url, {
        //     headers: {
        //         'Content-Type': 'text/html',
        //         "Access-Control-Allow-Origin": "*",
        //     },
        // });
        // if (res.status === 200) {
        //     return NextResponse.json({ data: res.data }, { status: 200 });
        // }
        // console.log(data);

        return NextResponse.json({ title, description, image, cms }, { status: 200 });
        // return NextResponse.json({ error: "Failed to crawl" }, { status: 500 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ title: "", description: "", cms: null, image: "" }, { status: 500 });
    }
}