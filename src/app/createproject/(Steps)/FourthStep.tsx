import React from 'react'

import {DataTable} from "@/components/ui/data-table/data-table";
import {projectColumnsRelevanceScore, ProjectWithRelated} from "@/types/project-types";

const FourthStep = () => {
    const data = [
        {title: 'title 1', condition: 'condition 1', intervention: 'intervention 1', url: 'URL', score: '9.0'},
        {title: 'title 1', condition: 'condition 1', intervention: 'intervention 1', url: 'URL', score: '9.0'},
        {title: 'title 1', condition: 'condition 1', intervention: 'intervention 1', url: 'URL', score: '9.0'},
        {title: 'title 1', condition: 'condition 1', intervention: 'intervention 1', url: 'URL', score: '9.0'},
    ] as any as ProjectWithRelated[] //todo: change
    return (
        <div className="flex flex-col items-center justify-center space-y-10">

            <div className="flex items-center space-x-4">
                <p className="text-black text-lg font-semibold">Relevance score limit</p>
                <label htmlFor="" className='relative group'>
                    <svg className='absolute top-2 right-2 cursor-pointer' width="25" height="25" viewBox="0 0 20 20"
                         fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM10 7C9.63113 7 9.3076 7.19922 9.13318 7.50073C8.85664 7.97879 8.24491 8.14215 7.76685 7.86561C7.28879 7.58906 7.12543 6.97733 7.40197 6.49927C7.91918 5.60518 8.88833 5 10 5C11.6569 5 13 6.34315 13 8C13 9.30622 12.1652 10.4175 11 10.8293V11C11 11.5523 10.5523 12 10 12C9.44773 12 9.00001 11.5523 9.00001 11V10C9.00001 9.44772 9.44773 9 10 9C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7ZM10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15Z"
                              fill="#4A5568"/>
                    </svg>
                    <input placeholder="5.0" className="w-96 p-2 border border-gray-200 rounded-md" type="text" name=""
                           id=""/>
                    <div
                        className="absolute right-2 invisible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-8 group-hover:visible transition duration-300 ease-in-out">Your
                        tooltip text here
                    </div>
                </label>
            </div>


            <div className="w-10/12 rounded-md border bg-white">
                <div className={"flex text-xl text-black font-bold p-4"}>
                    Trails
                    <div className='flex items-center justify-center ml-2 w-10 rounded-full bg-blue-200'>
                        <span className='text-sm font-semibold text-blue-500'>156</span>
                    </div>
                </div>
                <DataTable title={"Projects"} columns={projectColumnsRelevanceScore} data={data}/>
            </div>


        </div>
    )
}

export default FourthStep