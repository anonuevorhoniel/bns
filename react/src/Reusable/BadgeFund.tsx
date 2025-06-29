import { Badge } from "@/components/ui/badge";

export function BadgeFund(fund: any) {
    console.log(`fund is ${fund}`);

    switch (fund) {
        case "NNC":
            return <Badge variant={"success"}>{fund}</Badge>;
        case "LOCAL":
            return <Badge variant={"warning"}>{fund}</Badge>;
        case "BOTH":
            return <Badge variant={"destructive"}>{fund}</Badge>;
        default:
            return <Badge variant={"outline"}>{fund || "Unknown"}</Badge>;
    }
}
