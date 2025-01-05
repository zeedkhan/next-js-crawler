import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    getKeyValue
} from "@nextui-org/table";
import { ResultProps } from "./data";
import { CircleCheckBig, CircleX, TriangleAlert } from "lucide-react";


const columns = [
    {
        key: "cms", label: "CMS",
    },
    {
        key: "gtm", label: "GTM",
    },
    {
        key: "ec", label: "Enhanced Conversion, GA4 UPD",
    },
    {
        key: "only_ga4", label: "GA4 Only",
    },
    {
        key: "hasForm", label: "Has Form",
    },
    {
        key: "hasEmailOrPhone", label: "Has Email or Phone",
    }
];


function StatusIcon({ value }: { value: string }) {
    if (value === "Supported") {
        return <CircleCheckBig className="text-green-500" />
    }
    if (value === "Not Supported") {
        return <CircleX className="text-red-500" />
    }
    if (value === "Need to manually check") {
        return <TriangleAlert className="text-yellow-500" />
    }
    return null;
}

export default function ResultTable({ rows }: { rows: ResultProps[] }) {
    return (
        <Table aria-label="Crawling result">
            <TableHeader>
                {columns.map((column) =>
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
            </TableHeader>
            <TableBody>
                {rows.map((row, idx) =>
                    <TableRow key={idx}>
                        {(columnKey) => (
                            <TableCell>
                                <div className="flex items-center space-x-4">
                                    <p>{getKeyValue(row, columnKey) as string}</p>
                                    {columnKey !== "hasForm" && columnKey !== "hasEmailOrPhone" ? (
                                        <StatusIcon value={getKeyValue(row, columnKey) as string} />
                                    ) : (
                                        getKeyValue(row, columnKey) ? <CircleCheckBig className="text-green-500" /> : <CircleX className="text-red-500" />
                                    )}

                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}