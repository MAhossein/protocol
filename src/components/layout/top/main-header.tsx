import {MessageCircle} from "lucide-react";
import CommentButton from "@/components/layout/top/comment-button";
import MainHeaderTitle from "@/components/layout/top/main-header-title";

interface MainHeaderProps {
    title: string;
    description: string;
}



export default function MainHeader ({ title, description }: MainHeaderProps)  {
    return (
        <div className="flex justify-between p-5 w-full">
            <MainHeaderTitle title={title} description={description}/>
            <div>
                <CommentButton/>
            </div>
        </div>
    );
};
