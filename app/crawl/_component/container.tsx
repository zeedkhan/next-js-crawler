"use client";

import { Card as NextCard, CardHeader, CardBody } from "@nextui-org/card";
import SearchInput from "./search-input";
import { FormEvent, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { checkSupportEC, checkSupportGA4, checkSupportGTM, fetchMetadata, MetaData, ResultProps } from "./data"
import { Image } from "@nextui-org/image"
import ResultTable from "./result";

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
        <NextCard className="h-full grid grid-cols-1 gap-4 content-center">
            {loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 flex items-center justify-center z-20">
                    <Spinner color="primary" label="Loading" labelColor="foreground" />
                </div>
            )}
            {metadata && (
                <CardHeader>
                    <figure className="w-full mx-auto">
                        {metadata.image && (
                            <div className="flex justify-center">
                                <Image
                                    alt="Website metadata crawler"
                                    src={metadata.image}
                                    width={200}
                                />
                            </div>
                        )}
                        <figcaption className="pt-8 pb-4 w-full">
                            {result.length > 0 && (
                                <ResultTable rows={result} />
                            )}
                        </figcaption>
                    </figure>
                </CardHeader>
            )}
            <CardBody className="flex justify-start items-center">
                <SearchInput loading={loading} onSubmit={onSubmit} />
            </CardBody>

        </NextCard>
    );
}