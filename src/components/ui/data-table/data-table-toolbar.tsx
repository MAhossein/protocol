"use client"


import {Table} from "@tanstack/react-table"
import {Button} from "@/components/ui/button"
import {DataTableFacetedFilter} from "./data-table-faceted-filter"
import {DataTableViewOptions} from "@/components/ui/data-table/data-table-view-options";
import * as React from "react";
import {LucideCross} from "lucide-react";
import {FilterDefinition} from "@/components/ui/data-table/data-table";

interface DataTableToolbarProps<TData, TValue> {
    table: Table<TData>,
    columnFilterDefinitions?: FilterDefinition<TData, TValue>[],

}


// A debounced input react component

export function DataTableToolbar<TData, TValue>({
                                                    table,
                                                    columnFilterDefinitions = [],
                                                }: DataTableToolbarProps<TData, TValue>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {columnFilterDefinitions?.map((columnFilterDefinition) => (
                    columnFilterDefinition && <DataTableFacetedFilter key={(columnFilterDefinition.column.accessorKey ?? columnFilterDefinition.column.id) as string}
                                            column={table.getColumn(columnFilterDefinition.column.accessorKey)}
                                            title={columnFilterDefinition.title}
                                            options={columnFilterDefinition.options}
                    />

                ))}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <LucideCross className="ml-2 h-4 w-4"/>
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table}/>
        </div>
    )
}
