import withComments from "@/components/comments/commentable";

interface MainHeaderTitleProps {
    title: string;
    description: string;
}

function MainHeaderTitleCore({ title, description }: MainHeaderTitleProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="font-light">{description}</p>
        </div>
    );
}

function MainHeaderTitle({ title, description }: MainHeaderTitleProps) {
    const WithComments = withComments(MainHeaderTitleCore, "Header", title);

    return <WithComments title={title} description={description} />;
}

export default MainHeaderTitle;