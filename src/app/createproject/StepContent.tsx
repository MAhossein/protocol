import { ChangeEvent, useState } from "react";

import { FirstStep, SecondStep, ThirdStep, FourthStep, Summary } from './(Steps)'
import {ProjectCreation} from "@/types/project-types";

interface StepContentProps {
    subStep: number;
    currentStep: number;
    projectId: string | undefined;
    userId: string;
    projectBody: ProjectCreation;
    handleInputChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
}

const StepContent: React.FC<StepContentProps> = ({   subStep,
                                                     currentStep,
                                                     handleInputChange,
                                                     projectBody,
                                                     projectId,
                                                     userId,
                                                 }) => {
    switch (currentStep) {
        case 1:
            return <FirstStep projectBody={projectBody} handleInputChange={handleInputChange} />;
        case 2:
            switch (subStep) {
                case 1:
                    return <SecondStep projectId={projectId} userId={userId} />;
                case 2:
                    return <ThirdStep />;
                case 3:
                    return <FourthStep />;
                default:
                    return null;
            }
        case 3:
            switch (subStep) {
                case 1:
                    return <SecondStep projectId={projectId} userId={userId} />;
                case 2:
                    return <ThirdStep />;
                case 3:
                    return <FourthStep />;
                default:
                    return null;
            }
        case 4:
            return <Summary />
        default:
            return null;
    }
}

export default StepContent;