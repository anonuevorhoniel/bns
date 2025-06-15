import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

export default function LoadingScreen() {
    return (
        <div className="absolute bottom-0 right-0 w-full h-full bg-gray-400/50 rounded-lg mt-10 z-500 flex justify-center items-center">
            <div className="mr-3">
                <Ring2
                    size="25"
                    stroke="5"
                    strokeLength="0.25"
                    bgOpacity="0.1"
                    speed="0.8"
                    color="blue"
                />
            </div>
            <p className="text-blue-700">Loading</p>
        </div>
    );
}
