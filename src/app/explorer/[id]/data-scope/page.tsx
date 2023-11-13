"use client"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import MainHeader from "@/components/layout/top/main-header";
import React, {useCallback} from "react";
import TabSearchSynonyms from "@/app/explorer/[id]/data-scope/tab-search-synonyms";
import TabSearchDetails from "@/app/explorer/[id]/data-scope/tab-search-details";
import {useProject} from "@/utils/useProject";
import Loading from "@/components/ui/shared/loading";
import NotFound from "@/components/ui/shared/not-found";
import Error from "@/components/ui/shared/error";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default function DataScope({params}: Props) {
    const { status, data, error } = useProject(params?.id);

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'search-synonyms';

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    const handleTabChange = (tabValue: string) => {
        router.push(pathname + '?' + createQueryString('tab', tabValue))
    };

    if (status === 'pending') {
        return <Loading />;
    }

    if (status === 'error') {
        return <Error message={error?.message ?? ""} />;
    }

    if (!data) {
        return <NotFound />;
    }



    return (
        <div className="flex flex-col items-start text-left bg-main-area flex-1 p-4">
            <div className="flex justify-between w-full">
                <MainHeader title="Explorer" description={data?.name ?? ""}/>
            </div>
            <Tabs defaultValue={currentTab} className="w-full" onValueChange={handleTabChange}>
                <TabsList className="grid w-fit grid-cols-4">
                    <TabsTrigger value="search-synonyms">Search synonyms</TabsTrigger>
                    <TabsTrigger value="search-details">Search details</TabsTrigger>
                    <TabsTrigger value="key-term-search">Key term search</TabsTrigger>
                    <TabsTrigger value="key-term-library">Key term library</TabsTrigger>
                </TabsList>
                <div className={"rounded border bg-white p-4"}>
                <TabsContent value="search-synonyms">
                    <TabSearchSynonyms project={data}/>
                </TabsContent>
                <TabsContent value="search-details">
                    <TabSearchDetails project={data}/>
                </TabsContent>
                <TabsContent value="key-term-search">

                </TabsContent>

                <TabsContent value="key-term-search">

                </TabsContent>
                </div>
            </Tabs>
        </div>

    );

}