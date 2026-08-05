import {  surfaceClass } from "~/routes/statpage";
import SectionHeading from "./SectionHeading";
import EmptyState from "./EmptyState";
import { useEffect, useState } from "react";
import React from "react";

import { useLanguagesQuery } from "~/hooks/pages/stat-hooks";


export default React.memo(TechnologyDistributionArticle);

function LoadingSkelton(){
    return(
        <div>
            <div className="mb-2 flex items-center justify-between">
                    <span className="h-2.5 w-12 bg-gray-300 animate-pulse"> </span>
                    <span className="h-2.5 w-12 bg-gray-300 animate-pulse"> </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            
            </div>
        </div>
    )
}


function TechnologyDistributionArticle(){

    const [percents, setPercents] = useState<number[]>([]);
    const { data : languages, isLoading, isError} = useLanguagesQuery();



    useEffect(()=>{
        if(!isLoading && !isError){
            const maps = languages!.map((language)=>language.percent ?? 0);
            setPercents(maps);
        }
    },[isLoading, languages]);



    if(isLoading){
        const skeletons : ReturnType<typeof LoadingSkelton>[] = [];
        for(let i=0; i<6; ++i){
            skeletons.push(<LoadingSkelton key={i} />)
        }

        return (
        <article className={`${surfaceClass} p-7 md:p-8`}>
            <SectionHeading eyebrow="Languages" title="Technology distribution" detail="Code volume across repositories" />
            <div className="mt-8 space-y-7">
                {skeletons}
            </div>
        </article>
        )
    }


    if(isError){
        console.error("Error occurred while fetching language data for TechnologyDistributionArticle");
        return(
            <article className={`${surfaceClass} p-7 md:p-8`}>
                <SectionHeading eyebrow="Languages" title="Technology distribution" detail="Code volume across repositories" />
                <div className="mt-8 space-y-7">
                    <EmptyState text="Failed to load language data" />
                </div>
            </article>
        )
    }



    return(
    <article className={`${surfaceClass} p-7 md:p-8`}>
        <SectionHeading eyebrow="Languages" title="Technology distribution" detail="Code volume across repositories" />
        <div className="mt-8 space-y-6">
            {languages!.map((language, index) => (
                <div key={language.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{language.name}</span>
                        <span className="text-gray-400">{language.percent}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div  className={`h-full rounded-full ${language.color} transition-all duration-300 ease-out w-0`} style={{ width: `${percents[index]}%` }} />
                    </div>
                </div>
            ))}
            {!isLoading && languages!.length === 0 && <EmptyState text="No language data available" />}
        </div>
    </article>
    )
}