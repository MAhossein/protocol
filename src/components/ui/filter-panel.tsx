import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import React, { useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {IdName} from "@/types/request-types";

export interface FilterDefinition {
    accessorKey: string;
    name: string;
    type: "string" | "number" | "date" | "boolean" | "select";
    getFilterValues?: () => Promise<IdName[]>;
}

export interface FilterSelection {
    name: string;
    value: string | number | Date | boolean;
}

interface FilterPanelProps {
    filters: FilterDefinition[];
    currentFilterSelection: FilterSelection[];
    onFilterSelectionChange: (filterSelection: FilterSelection[]) => void;
}
export default function FilterPanel({ filters, currentFilterSelection, onFilterSelectionChange }: FilterPanelProps) {
    const [filterSelection, setFilterSelection] = useState<FilterSelection[]>(currentFilterSelection);
    const [selectOptions, setSelectOptions] = useState<{[key: string]: IdName[]}>({});

    useEffect(() => {
        onFilterSelectionChange?.(filterSelection);
        console.log(filterSelection);
    }, [filterSelection]);

    // Fetch filter values for select inputs
    useEffect(() => {
        const fetchSelectOptions = async () => {
            const newSelectOptions: {[key: string]: IdName[]} = {};
            for (const filter of filters) {
                if(filter.type === 'select' && filter.getFilterValues) {
                    newSelectOptions[filter.accessorKey] = await filter.getFilterValues();
                }
            }
            setSelectOptions(newSelectOptions);
        }
        fetchSelectOptions();
    }, [filters]);

    function onFilterChange(filterName: string, filterValue: string) {
        console.log(filterName, filterValue);
        const newFilterSelection = filterSelection.filter((filter) => filter.name !== filterName);
        if (filterValue !== "" && filterValue !== "DEFAULT") {
            newFilterSelection.push({ name: filterName, value: filterValue });
        }
        setFilterSelection(newFilterSelection);
    }

    return (
        <div className="filter-panel">
            <Sheet modal={false}>
                <SheetTrigger>Filters</SheetTrigger>
                <SheetContent className={"w-[240px]"}>
                    <SheetTitle>Filter</SheetTitle>
                    {filters.map((filter) => {
                        return filter.type === "select" ? (
                            <div className={"flex flex-col"} key={filter.name}>
                                <label className={"text-sm text-gray-500"}>{filter.name}</label>
                                <Select onValueChange={(value) => onFilterChange(filter.accessorKey, value)}>
                                    <SelectTrigger placeholder={"All"} className={"border border-input"} defaultValue={"DEFAULT"} name={filter.name}>
                                        <SelectValue placeholder="Select...">
                                            {/*{*/}
                                            {/*    (filterSelection.find(f => f.name === filter.accessorKey)?.name) as string || "DEFAULT"*/}
                                            {/*}*/}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"DEFAULT"}>
                                            All
                                        </SelectItem>
                                        {selectOptions[filter.accessorKey]?.map((value) => (
                                            <SelectItem key={value.id} value={value.id}>
                                                {value.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div></div>
                        );
                    })}
                </SheetContent>
            </Sheet>
        </div>
    );
}