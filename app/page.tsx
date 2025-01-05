import { title, subtitle } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Let&apos;s&nbsp;</span>
        <span className={title({ color: "violet" })}>Crawl&nbsp;</span>
        <br />
        <span className={title()}>
          Crawl a webpage to check EC, GTM, GA4 and CMS
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Free and fast.
        </div>
      </div>


      <div className="mt-8">
        <Button
          className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
          radius="full"
        >
          <Link className="text-white" href="/crawl">
            Get Started
          </Link>
        </Button>
      </div>
    </section>
  );
}
