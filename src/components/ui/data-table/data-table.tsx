"use client"

import {
    ColumnDef, ColumnFiltersState,
    flexRender,
    getCoreRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React, {useEffect} from "react";
import {DataTableToolbar} from "@/components/ui/data-table/data-table-toolbar";
import {DataTablePagination} from "@/components/ui/data-table/data-table-pagination";
import {defaultPage, defaultPageSize, defaultSortBy, defaultSortOrder} from "@/types/request-types";

interface DataTableProps<TData, TValue> {
    title?: string
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    defaultColumnFilters?: ColumnFiltersState,
    columnFilterDefinitions?: FilterDefinition<TData, TValue>[],
    enableRowSelection?: boolean,
    enablePagination?: boolean,
    defaultPagination?: PaginationState,
    defaultSorting?: SortingState,
    defaultRowSelection?: Record<string, boolean>,
    pageCount?: number,
    onPaginationChange?: (pagination: PaginationState) => void;
    onRowSelectionChange?: (selection: Record<string, boolean>) => void;
    onSortChange?: (sorting: SortingState) => void;
    enableSorting?: boolean,
}

export interface FilterDefinition<TData, TValue> {
    column: ColumnDef<TData, TValue>,
    title: string,
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[]
}

export function DataTable<TData, TValue>({  title,
                                             columns,
                                             data,
                                             columnFilterDefinitions = [],
                                             defaultColumnFilters = [],
                                             enableRowSelection = false,
                                             enablePagination = false,
                                             enableSorting = false,
                                             defaultPagination = { pageIndex: defaultPage, pageSize: defaultPageSize },
                                             defaultSorting = [{ id: defaultSortBy, desc: defaultSortOrder === "desc"}],
                                             defaultRowSelection = {},
                                             pageCount,
                                             onPaginationChange,
                                             onRowSelectionChange,
                                             onSortChange,

                                         }: Readonly<DataTableProps<TData, TValue>>) {
    const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)
    const [rowSelection, setRowSelection] = React.useState(defaultRowSelection)
    const [pagination, setPagination] = React.useState<PaginationState>(defaultPagination)
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        defaultColumnFilters
    )

    useEffect(() => {
        onPaginationChange?.(pagination);
    }, [pagination]);

    useEffect(() => {
        onRowSelectionChange?.(rowSelection);
    }, [rowSelection]);

    useEffect(() => {
        onSortChange?.(sorting);
    }, [sorting]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: (newSorting) => {
            setSorting(newSorting);
        },
        onRowSelectionChange: (newSelection) => {
            setRowSelection(newSelection);
        },
        onPaginationChange: (newPagination) => {
            setPagination(newPagination);
        },
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        enableRowSelection,
        enableSorting,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        pageCount,
        state: {
            sorting,
            columnFilters,
            pagination,
            rowSelection,
        },
    })

    return (
        <div className={ columnFilterDefinitions && columnFilterDefinitions.length > 0 ? "space-y-4" : ""}>
            <DataTableToolbar table={table} columnFilterDefinitions={columnFilterDefinitions}/>
            <div className="rounded-md overflow-x-auto">
            <Table>
                <TableHeader className={"bg-muted/50"}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            </div>
            {(enablePagination || enableRowSelection) && (<DataTablePagination table={table} enablePagination={enablePagination} enableRowSelection={enableRowSelection}/>)}
        </div>
    )
}
