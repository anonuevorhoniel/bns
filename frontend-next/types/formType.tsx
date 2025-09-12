import { UseFormReturn } from "react-hook-form";

export type formType = {
    form: UseFormReturn;
    handleSubmit: any;
    isPending: boolean;
};
