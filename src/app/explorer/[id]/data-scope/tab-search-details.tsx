"use client"
import React, {useContext, useEffect} from "react";
import {Textarea} from "@/components/ui/textarea";
import {ProjectWithRelated} from "@/types/project-types";
import {DataTable} from "@/components/ui/data-table/data-table";
import {ColumnDef} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

interface Props {
    project: ProjectWithRelated;
}

export default function TabSearchDetails( {project}: Props) {



    return (
        <div className={"h-full"}>
            <p className='mr-24 font-semibold text-md text-lg py-8'>Project description</p>

            <div className="h-[300px] border-gray-100 rounded-md overflow-y-auto overflow-x-clip">
                <Textarea className="w-full h-full" value={project.description}/>

            </div>


            <div className="border-2 border-gray-100 rounded-md overflow-y-auto overflow-x-clip mt-6">
                <div className={"text-xl font-bold p-4"}>Summary</div>

                <div className="flex justify-between m-4">
                    <Table>
                        <TableHeader className={"bg-muted/50"}>
                            <TableRow>
                                <TableHead/>
                                <TableHead>Condition</TableHead>
                                <TableHead>Intervention</TableHead>
                                <TableHead>Intersection</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className={"h-12"}>
                                <TableCell>Phase</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>2</TableCell>
                            </TableRow>
                            <TableRow className={"h-12"}>
                                <TableCell>Year limit</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>2</TableCell>
                            </TableRow>
                            <TableRow className={"h-12"}>
                                <TableCell>Relevance score limit</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>2</TableCell>
                            </TableRow>
                            <TableRow className={"h-12"}>
                                <TableCell>Number of trials</TableCell>
                                <TableCell>193</TableCell>
                                <TableCell>46</TableCell>
                                <TableCell>11</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}