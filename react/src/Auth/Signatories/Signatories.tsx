import { UseLayout } from "@/Actions/LayoutAction";
import { useEffect } from "react";

export default function Signatories() {
    const { setItem, setBItem } = UseLayout();
    useEffect(() => {
        setItem("Signatories");
        setBItem("");
    }, []);

    return <></>;
}
