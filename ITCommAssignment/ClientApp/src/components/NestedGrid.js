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
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [currentPage, setcurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(0); // Add state for total pages

    const fetchData = async (pageIndex, pageSize, filter) => {
        setLoading(true);
        try {
            const filterParam = filter ? `&filter=${filter}` : '';
            const response = await fetch(`/nestedgrid?pageIndex=${pageIndex}&pageSize=${pageSize}${filterParam}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setData(result.data);
            setTotalPages(result.totalPages); // Set total pages from response
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageSizeChange = (pageSize) => {
        fetchData(0, pageSize, '');
    };

    const handleFilterChange = (e) => {
        const filter = e.target.value;
        setFilter(filter);
        fetchData(0, pageSize, filter);
    };

    const handlePageChange = (pageIndex) => {
        if (pageIndex == 0) {
            setcurrentPage(pageIndex + 1);
        } else {
            setcurrentPage(pageIndex);
        }
        
        fetchData(pageIndex -1, pageSize, filter);
    };

    useEffect(() => {
        fetchData(0, 10, '');
    }, []);

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
        page,
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
            manualPagination: true,
        },
        useFilters,
        useSortBy,
        usePagination
    );

    useEffect(() => {
        fetchData(pageIndex, pageSize, filter);
    }, [pageIndex, pageSize, filter]);

    return (
        <div>
            <h2>Assignment 3</h2>

            <div>
                {/*{headerGroups.map((headerGroup) => (*/}
                {/*    <div key={headerGroup.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>*/}
                {/*        {headerGroup.headers.map((column) => (*/}
                {/*            <div key={column.id} style={{ margin: '0 10px' }}>*/}
                {/*                {column.canFilter ? column.render('Filter') : null}*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*))}*/}
                <label>
                    
                    <br/>Search Using Dynamic Filter
                </label>
                <input
                    value={filter}
                    onChange={handleFilterChange}
                    placeholder="Search..."
                />
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
                Show{' '}
                <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {currentPage} of {totalPages} 
                    </strong>{' '}
                </span>
                <button onClick={() => handlePageChange(0)} disabled={currentPage == 1}>
                    {'<<'}
                </button>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage == 1}>
                    {'<'}
                </button>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 > totalPages}>
                    {'>'}
                </button>
                <button onClick={() => handlePageChange(totalPages)} disabled={totalPages == currentPage }>
                    {'>>'}
                </button>
            </div>
        </div>
    );
};

export default NestedGrid;
