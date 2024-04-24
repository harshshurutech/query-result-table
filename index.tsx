import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import useQueryResult from "./hooks/use-queryresult";
import QueryResultProvider from "./providers/QueryResultProvider";

export { MOCK_DATA } from './_mock_data';

function QueryResultTableHeader() {
    const result = useQueryResult();

    return (
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                {result.columns.map(column => {
                    return <QueryTableColumnHeading key={column} column={column} />;
                })}
            </tr>
        </thead>
    )
}

function QueryTableColumnHeading({ column }: { column: Column }) {
    return (
        <th key={column} className="px-4 py-2">{column}</th>
    );
}

type QueryResultTableRowProps = {
    values: DataValue[];
    columns: Column[];
    rowIndex: number;
};

function QueryResultTableRow({ values, columns, rowIndex }: QueryResultTableRowProps) {
    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            {values.map((value, idx) => {
                const columnName = columns[idx];
                const id = `${columnName}-${rowIndex}`;

                return (
                    <td key={id} className="px-4 py-2">
                        {value.toString()}
                    </td>
                );
            })}
        </tr>
    );
}

function QueryResultTableBody() {
    const result = useQueryResult();

    return (
        <tbody>
            {result.rows.map((values, rowIndex) => (
                <QueryResultTableRow 
                    key={rowIndex} 
                    values={values} 
                    columns={result.columns} 
                    rowIndex={rowIndex} 
                />
            ))}
        </tbody>
    );
}

function QueryResultTablePaginationControls() {
    const { currentPage, rowsPerPage, totalRows, setPage, setRowsPerPage } = useQueryResult();

    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handlePrevClick = () => {
        if (currentPage > 0) {
            setPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages - 1) {
            setPage(currentPage + 1);
        }
    };

    return (
        <div className="flex justify-between">
            <div className="flex items-center">
                <button
                    onClick={handlePrevClick}
                    disabled={currentPage === 0}
                    className={`px-2 py-1 mr-2 bg-blue-500 text-white rounded ${currentPage === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'}`}
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={handleNextClick}
                    disabled={currentPage === totalPages - 1}
                    className={`px-2 py-1 bg-blue-500 text-white rounded ${currentPage === totalPages - 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'}`}
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
            <div>
                <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded"
                >
                    {[10, 25, 50, 200].map((option) => (
                        <option key={option} value={option}>
                            {option} rows per page
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

type QueryResultTableProps = {
    result: QueryResult
}

export default function QueryResultTable({ result }: QueryResultTableProps) {
    return (
        <QueryResultProvider result={result}>
            <div className="flex flex-col gap-4">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        <QueryResultTableHeader />
                        <QueryResultTableBody />
                    </table>
                </div>
                <QueryResultTablePaginationControls />
            </div>
        </QueryResultProvider>
    );
}
