import { Button } from "@/components/ui/button";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";

export default function ButtonLoad({
    loading,
    classNames,
    name,
    icon,
    variant,
}: any) {
    return (
        <Button
            variant={variant}
            className={`${classNames}`}
            disabled={loading}
        >
            {loading ? (
                <Tailspin size="20" stroke="5" speed="0.9" color="white" />
            ) : (
             <>{icon} {name}</>
            )}
        </Button>
    );
}
