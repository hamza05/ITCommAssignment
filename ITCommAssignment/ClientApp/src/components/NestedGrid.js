import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, usePagination, useFilters } from 'react-table';

const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
    return (
        <input
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value || undefined)}
            placeholder="Filter..."
        />
    );
};

const NestedGrid = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/nestedgrid');
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Dependency array should be empty to run only once on mount

    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Name',
                accessor: 'name',
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Value',
                accessor: 'value',
                Filter: DefaultColumnFilter,
            },
            // Add more columns as needed
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Use 'page' instead of 'state' for pagination
        state: { pageIndex, pageSize },
        gotoPage,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageCount,
        setPageSize,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useFilters,
        useSortBy,
        usePagination
    );

    return (
        <div>
            <h2>Assignment 3</h2>

            <div>
                {headerGroups.map((headerGroup) => (
                    <div key={headerGroup.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        {headerGroup.headers.map((column) => (
                            <div key={column.id} style={{ margin: '0 10px' }}>
                                {column.canFilter ? column.render('Filter') : null}
                            </div>
                        ))}
                    </div>
                ))}
                <label>
                    Show{' '}
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>{' '}
                    entries
                </label>
            </div>
            <table {...getTableProps()} style={{ width: '100%' }}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageCount}
                    </strong>{' '}
                </span>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
            </div>
        </div>
    );
};

export default NestedGrid;
