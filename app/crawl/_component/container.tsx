"use client";

import { Card as NextCard, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import SearchInput from "./search-input";
import { FormEvent, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { checkSupportEC, checkSupportGA4, checkSupportGTM, fetchMetadata, MetaData, ResultProps } from "./data"
import { Image } from "@nextui-org/image"
import ResultTable from "./result";
import { title } from "@/components/primitives";

export default function Card() {
    const [loading, setLoading] = useState(false);
    const [metadata, setMetadata] = useState<MetaData | null>(null);
    const [result, setResult] = useState<ResultProps[]>([]);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMetadata(null);
        setResult([]);
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        await fetchMetadata(formData.url as string).then((data) => {
            setMetadata(data);
            setLoading(false);
            const status = checkSupportGTM(data.cms);
            const obj = {
                cms: data.cms as string,
                gtm: status,
                ec: checkSupportEC(data.cms, formData.url as string) ? "Supported" : "Not Supported",
                only_ga4: checkSupportGA4(data.cms),
            }
            setResult([{ ...data, ...obj }]);
            if (window.dataLayer) {
                window.dataLayer.push({ event: "submit_crawl" });
            }
        });
    };


    return (
        <NextCard className="py-24 h-full grid grid-cols-1 gap-4 content-evenly">
            {loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 flex items-center justify-center z-20">
                    <Spinner color="primary" label="Loading" labelColor="foreground" />
                </div>
            )}
            <CardHeader>
                {metadata ? (
                    <div className="w-full mx-auto">
                        {metadata.image && (
                            <div className="flex justify-center">
                                <Image
                                    alt="Website metadata crawler"
                                    src={metadata.image}
                                    width={500}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full font-semibold text-center">
                        <div>
                            <h2 className={title({ color: "violet" })}>Precheck a webpage </h2>
                            <span className="text-4xl">😀</span>
                        </div>
                        <small>By enter your URL below!</small>
                    </div>

                )}
            </CardHeader>
            <CardBody >
                <div className="pt-8 pb-4 h-fit w-full">
                    {result.length > 0 ? (
                        <ResultTable rows={result} />
                    ) : (
                        <div className="relative flex justify-center">
                            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spider%20Web.png" alt="Spider Web" width="250" height="250" />
                            <img className="absolute top-4" src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spider.png" alt="Spider" width="250" height="250" />
                        </div>
                    )}
                </div>
            </CardBody>

            <CardFooter >
                <div className="w-full h-full flex items-center justify-center">
                    <SearchInput loading={loading} onSubmit={onSubmit} />
                </div>
            </CardFooter>

        </NextCard>
    );
}