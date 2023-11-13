"use client"

import React from "react";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {ProjectWithRelated} from "@/types/project-types";
import withComments from "@/components/comments/commentable";

interface Props {
    project: ProjectWithRelated;
}

export default function TabSearchSynonyms( {project}: Props) {
    const SearchSynonymsKind = () => {
        return <div className='flex space-x-10'>
            <label className="flex items-center">
                <input type="radio" className="form-radio w-4 h-4 mr-2" name="searchSynonymsKind"/>
                <span className='text-md'>
                            Condition
                        </span>
            </label>
            <label className="flex items-center">
                <Input type="radio" className="form-radio w-4 h-4 mr-2" name="searchSynonymsKind"/>
                <span className='text-md'>
                            Intervention
                        </span>
            </label>
            <label className="flex items-center">
                <Input type="radio" className="form-radio w-4 h-4 mr-2" name="searchSynonymsKind"/>
                <span className='text-md'>
                            Condition and intervention
                        </span>
            </label>
        </div>;
    }

    const SearchSynonymsKindCommentable = withComments(SearchSynonymsKind, 'Search Synonyms Kind', "Data scope");
    return (
        <div>
            <div className='flex m-4'>
                <SearchSynonymsKindCommentable/>
            </div>
            <Separator/>
            <p className='mr-24 font-semibold text-md text-lg py-8'>Searched synonyms</p>

            <div className="h-[300px] border-2 border-gray-100 rounded-md overflow-y-auto overflow-x-clip">
                <div className="flex justify-between m-4">
                    <div className="grid grid-cols-2 space-x-2 w-full">
                        <div
                            className=" flex items-center justify-between border border-gray-100 m-4 p-2 rounded-md">
                            Item 1
                            <button
                                className={`transform transition-transform duration-300 rotate-180`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-arrow-down" viewBox="0 0 16 16"> <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" /> </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <p className='mr-24 font-semibold text-md text-lg py-8'>Excluded synonyms</p>

            <div className="h-[300px] border-2 border-gray-100 rounded-md overflow-y-auto overflow-x-clip">
                <div className="flex justify-between m-4">
                    <div className="grid grid-cols-2 space-x-2 w-full">
                        <div
                            className=" flex items-center justify-between border border-gray-100 m-4 p-2 rounded-md">
                            Item 1
                            <button
                                className={`transform transition-transform duration-300 rotate-180`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-arrow-down" viewBox="0 0 16 16"> <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" /> </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}