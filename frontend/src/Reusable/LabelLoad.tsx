import { UseScholarShow } from "@/Actions/ScholarAction";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

export default function LabelLoad({ value }: any) {
    const { scholarData } = UseScholarShow();

    if (scholarData == "loading") {
        return (
            <Ring2
                size="20"
                stroke="5"
                strokeLength="0.25"
                bgOpacity="0.1"
                speed="0.8"
                color="blue"
            />
        );
    } else if (!value) {
        return null;
    }

    return value;
}
