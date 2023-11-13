import React from 'react'

import { DataTable } from "@/components/ui/data-table/data-table";
import {projectColumnsRelevanceScore, ProjectWithRelated} from "@/types/project-types";

const Summary = () => {
    const data = [
        { title: 'title 1', condition: 'condition 1', intervention: 'intervention 1', url: 'URL', score: '9.0' },
        { title: 'title 1', condition: 'condition 1', intervention: 'intervention 1', url: 'URL', score: '9.0' },
        { title: 'title 1', condition: 'condition 1', intervention: 'intervention 1', url: 'URL', score: '9.0' },
        { title: 'title 1', condition: 'condition 1', intervention: 'intervention 1', url: 'URL', score: '9.0' },
    ] as any as ProjectWithRelated[] //todo: change
    return (
            <div className="flex flex-col items-center justify-center space-y-10">

                <div className="w-10/12 rounded-md border bg-white">
                    <div className={"flex text-xl text-black font-bold p-4"}>
                        Trails
                        <div className='flex items-center justify-center ml-2 w-10 rounded-full bg-blue-200'>
                            <span className='text-sm font-semibold text-blue-500'>156</span>
                        </div>
                    </div>
                    <DataTable title={"Projects"} columns={projectColumnsRelevanceScore} data={data} />
                </div>

            </div>
    )
}

export default Summary