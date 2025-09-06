import { Status, StatusIndicator, StatusLabel } from "./shadcn-io/status";

export default function StatusBar({
    status,
    inverted,
}: {
    status: boolean | number;
    inverted?: boolean;
}) {
    const active = (
        <Status variant={"outline"} status="online" className="border-green-500">
            <StatusIndicator />
            <StatusLabel className="text-green-500">Active</StatusLabel>
        </Status>
    );
    const inActive = (
        <Status variant={"outline"} className="border-red-500" status="offline">
            <StatusIndicator />
            <StatusLabel className="text-red-500">Inactive</StatusLabel>
        </Status>
    );

    if (inverted) {
        if (status == 0 || status == true) {
            return active;
        }

        return inActive;
    } else {
        if (status == 1 || status == true) {
            return active;
        }

        return inActive;
    }
}
