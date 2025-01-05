import { Button } from "@nextui-org/button";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/modal";
import { Divider } from "@nextui-org/divider";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { CircleHelp } from "lucide-react";

export default function TutorialModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            <Button onPress={onOpen}
                className="mx-auto bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                radius="full"
            >
                Help <CircleHelp />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-center mx-auto">Crawler - Tutorial</ModalHeader>
                            <Divider className="mt-2" />

                            <ModalBody>
                                {/* Enter URL */}

                                <Accordion variant="splitted">
                                    <AccordionItem key="1" aria-label="Enter URL" title="Enter URL">
                                        <div className="flex flex-col pt-2">
                                            <p>The English or Encoding URL</p>
                                            <small className="text-red-500">Example: https://www.example.com/contact-us</small>
                                        </div>

                                    </AccordionItem>

                                    <AccordionItem key="2" aria-label="CMS" title="CMS">
                                        <p className="">The website eligible to install Google Tag Manager</p>
                                    </AccordionItem>

                                    <AccordionItem key="3" aria-label="Enhanced Conversion, GA4 UPD" title="Enhanced Conversion, GA4 UPD">
                                        <div>
                                            <p className="">The website eligible to install GTM and EC, GA4 UPD</p>
                                            <small className={`text-red-500`}>By default this will be showing false value if GTM is not supported</small>
                                        </div>
                                    </AccordionItem>

                                    <AccordionItem key="4" aria-label="Only GA4" title="Only GA4">
                                        <div>
                                            <p className="">The website only able to install GA4</p>
                                            <small className={`text-red-500`}>
                                                Some website only can install GA4, eg: Simdif and Godaddy
                                            </small>
                                        </div>
                                    </AccordionItem>

                                    <AccordionItem key="5" aria-label="Has Form" title="Has Form">
                                        <div>
                                            <p className="">Is the crawl page has form?</p>
                                            <div className="flex flex-col">
                                                <small className={`text-red-500`}>
                                                    Sometimes you may need to check it manually, some forms they are hidden for a purpose but the crawler captured them
                                                </small>
                                            </div>
                                        </div>
                                    </AccordionItem>

                                    <AccordionItem key="6" aria-label="Has Email or Phone" title="Has Email or Phone">
                                        <div>
                                            <p className="pt-2">Is the crawl page has email or phone?</p>
                                            <small className={`text-red-500`}>
                                                This working only correct structured HTML form.
                                            </small>
                                        </div>
                                    </AccordionItem>
                                </Accordion>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
