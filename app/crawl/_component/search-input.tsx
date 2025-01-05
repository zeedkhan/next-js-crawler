"use client";

import { Input } from "@nextui-org/input";
import { FormEvent } from "react";
import { Form } from "@nextui-org/form";
import { Button } from "@nextui-org/button";
import { isUrlValid } from "./data";
import TutorialModal from "./tutorial-modal";
import { Bug } from "lucide-react";
import { Card } from "@nextui-org/card";

type SearchInputProps = {
    loading: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

const SearchInput = ({ loading, onSubmit }: SearchInputProps) => {
    const validateInput = (url: string) => !isUrlValid(url) ? "Please enter a valid url" : true;
    return (
        <Card className="z-0 w-full h-full max-w-md min-h-40 p-4 shadow border-gray-100 dark:border-gray-500 border bg-white dark:bg-[#0e1111]" >
            <Form className="h-full flex flex-col items-center justify-evenly" validationBehavior="native" onSubmit={onSubmit} id="crawl-form">
                <Input
                    validate={validateInput}
                    isRequired
                    type="url"
                    className="mt-0"
                    labelPlacement="inside"
                    label="Website URL"
                    name="url"
                    errorMessage="Please enter a valid url"
                    placeholder="https://www.example.com/contact-us"
                />
                <div className="w-full flex justify-evenly items-center">
                    <Button
                        type="submit"
                        disabled={loading}
                        radius="full"
                        className=" shadow-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium text-sm text-center "
                        endContent={<Bug size={20} />}
                    >
                        Crawl
                    </Button>
                    <TutorialModal />
                </div>
            </Form>
        </Card>
    )
};


export default SearchInput;


