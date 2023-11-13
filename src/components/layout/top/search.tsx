import { SearchIcon} from "lucide-react";
import {DebouncedInput} from "@/components/ui/debounced-input";
import withComments from "@/components/comments/commentable";
import {cn} from "@/utils/utils";



function Search ({ setSearchTerm, className, ...props }:
                     {setSearchTerm: (searchTerm: string) => void, className?: string}
)  {
    function handleChange(value: string | number) {
        setSearchTerm(value as string);
    }
    return (
        <div className="search-box">
            <SearchIcon className={"search-icon"}/>
            <DebouncedInput {...props} value={""} type="text" placeholder="Search" className={cn("w-full", className)} onChange={handleChange}/>
        </div>
    );
}

export default Search;