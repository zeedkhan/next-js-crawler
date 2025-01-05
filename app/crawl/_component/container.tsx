"use client";

import { Button } from "@nextui-org/button";
import { Card as NextCard, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import SearchInput from "./search-input";
import { FormEvent, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { fetchMetadata, MetaData } from "./data"

import { Image } from "@nextui-org/image"

export default function Card() {
    const [loading, setLoading] = useState(false);
    const [metadata, setMetadata] = useState<MetaData | null>(null);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        await fetchMetadata(formData.url as string).then((data) => {
            setMetadata(data);
            setLoading(false);
        });
    };


    return (
        <NextCard className="h-full grid grid-cols-1 gap-4 content-center">
            {metadata && (
                <CardHeader className="my-4">
                    <figure className="w-full mx-auto">
                        {metadata.image && (
                            <div className="flex justify-center">
                                <Image
                                    alt="Website metadata crawler"
                                    src={metadata.image}
                                    width={400}
                                />
                            </div>
                        )}
                        <figcaption className="text-center text-2xl font-bold">Metadata Crawler</figcaption>
                    </figure>
                </CardHeader>
            )}
            <CardBody className="flex justify-start items-center">
                <SearchInput loading={loading} onSubmit={onSubmit} />
            </CardBody>
            {loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 flex items-center justify-center z-20">
                    <Spinner color="primary" label="Loading" labelColor="foreground" />
                </div>
            )}
        </NextCard>
    );
}