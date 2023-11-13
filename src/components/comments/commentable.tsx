import React, {FC, useState, MouseEvent, useContext} from 'react';
import {CommentContext} from "@/context/comment-context";
import {clsx} from "clsx";
import {Popover, PopoverContent} from "@/components/ui/popover";
import PopoverComment from "@/components/comments/popover-comment";
import { usePathname } from 'next/navigation';
import {PopoverAnchor} from "@radix-ui/react-popover";
import {ProjectContext} from "@/context/project-context";

interface WithCommentsProps {
    [key: string]: any;
}

function withComments<T extends object>(WrappedComponent: React.ComponentType<T>, componentId: string, page: string) {
    const WithComments: FC<WithCommentsProps> = (props) : React.ReactNode  => {
        const {commentEnabled} = useContext(CommentContext);
        const currentPage = usePathname();
        const {project} = useContext(ProjectContext);

        const [isHovered, setIsHovered] = useState<boolean>(false);

        const [popoverOpen, setPopoverOpen] = useState(false);

        const handleComment = () => {
            if (!commentEnabled || popoverOpen) return;
            setPopoverOpen(!popoverOpen);

        };

        const handleClick = (e: MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            handleComment();
        };

        const handleMouseOver = () => {
            if (!commentEnabled) return;
            setIsHovered(true);
        };

        const handleMouseOut = () => {
            if (!commentEnabled) return;
            setIsHovered(false);
        };

        function onOpenChange(open: boolean) {
            setPopoverOpen(open)
        }


        return (
            <div
                className={clsx({
                    'hoverable': isHovered && commentEnabled
                })}

                // style={wrapperStyles}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onClick={handleClick}
            >
                <WrappedComponent {...props as T} />

                <Popover open={popoverOpen && commentEnabled} onOpenChange={onOpenChange}>
                    <PopoverAnchor />
                    <PopoverContent >
                        <PopoverComment componentId={componentId} pagePath={currentPage} projectId={project?.id} page={page}/>
                    </PopoverContent>
                </Popover>
            </div>
        );
    }

    return WithComments;
}

export default withComments;