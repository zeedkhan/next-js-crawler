"use client";

import { Input } from "@nextui-org/input";
import { FormEvent } from "react";
import { Form } from "@nextui-org/form";
import { Button } from "@nextui-org/button";
import { isUrlValid } from "./data";

type SearchInputProps = {
    loading: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

const SearchInput = ({ loading, onSubmit }: SearchInputProps) => {
    const validateInput = (url: string) => !isUrlValid(url) ? "Please enter a valid url" : true;
    return (
        <Form className="z-0 w-full max-w-xs grid grid-cols-1 gap-4" validationBehavior="native" onSubmit={onSubmit}>
            <Input
                validate={validateInput}
                isRequired
                type="url"
                labelPlacement="outside"
                label="Website URL"
                name="url"
                errorMessage="Please enter a valid url"
                placeholder="Enter your website url"
            />

            <Button type="submit" disabled={loading} variant="bordered" className="w-3/4 mx-auto">
                Submit
            </Button>
        </Form>
    )
};


export default SearchInput;


