import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/shadcn-io/spinner";

export default function ButtonLoad({
    variant,
    onClick,
    type,
    label,
    isPending,
    className,
    size,
}: {
    variant?:
        | "link"
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "underline"
        | null
        | undefined;
    onClick?: any;
    label: string | ReactNode;
    type?: "button" | "submit" | "reset" | undefined;
    isPending: boolean;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}) {
    return (
        <Button
            onClick={onClick}
            variant={variant}
            type={type}
            disabled={isPending}
            className={className}
            size={size}
        >
            {isPending ? <Spinner key={variant} /> : label}
        </Button>
    );
}
