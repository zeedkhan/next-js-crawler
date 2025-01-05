import { title, subtitle } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center py-8 md:py-10 h-full">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Let&apos;s&nbsp;</span>
        <span className={title({ color: "violet" })}>Crawl&nbsp;</span>
        <br />
        <span className={title()}>
          Crawl a webpage&nbsp;
        </span>
        <span className={title()}>
          check EC, GTM, GA4 and CMS
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Free and fast.
        </div>
      </div>

      <Link className="text-white " href="/crawl">
        <div>
          <div className="relative">
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spider%20Web.png" alt="Spider Web" width="250" height="250" />
            <img className="animate animate-bounce absolute top-1/2" src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spider.png" alt="Spider" width="250" height="250" />
          </div>

          <div className="mt-8 w-full flex justify-center">
            <Button
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
              radius="full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </Link>
    </section>
  );
}
