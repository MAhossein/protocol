import {MessageCircle, MessageSquarePlusIcon} from "lucide-react";
import {useContext} from "react";
import {CommentContext} from "@/context/comment-context";
import {Button} from "@/components/ui/button";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchReplies, fetchUnreadCount} from "@/services/comments-service";
import {usePathname} from "next/navigation";
import {CommentsQueryParams} from "@/types/comment-types";
import {defaultApiQueryParams} from "@/types/request-types";
import {useProject} from "@/utils/useProject";

export default function CommentButton() {
    const queryClient = useQueryClient();

    const { commentEnabled, toggleCommentEnabled } = useContext(CommentContext);
    const { status, data, error } = useProject();

    const buttonClass = ` ${commentEnabled ? 'bg-accent-focus' : 'bg-white hover:bg-secondary/80'}`;
    const currentPage = usePathname();
    const queryParams: CommentsQueryParams = {...defaultApiQueryParams};
    queryParams.pagePath = currentPage;
    if (data?.id != undefined) {
        queryParams.projectId = data!.id;
    }
    const unreadComments = useQuery({
        queryKey: ['comment-unread', queryParams],
        queryFn: () => fetchUnreadCount(queryParams),
    })


    function handleClick() {
        if (toggleCommentEnabled) {
            toggleCommentEnabled();
        }
        queryClient.invalidateQueries({queryKey: ['comment-unread', queryParams]})
    }

    return (
        <Button variant={"outline"} className={buttonClass + " relative"}
                onClick={handleClick}>
            {commentEnabled ? <MessageSquarePlusIcon /> : <MessageCircle />}
            {unreadComments.data && unreadComments.data.count > 0 &&
                <span className="absolute top-0 right-0 -mt-2 -mr-2 flex h-6 w-6 rounded-full bg-red-500 items-center text-center align-middle justify-items-center">
        <span className="px-1 py-1 w-full align-baseline font-bold text-white text-xs">{unreadComments.data.count}</span>
      </span>

        }
        </Button>
    );
}