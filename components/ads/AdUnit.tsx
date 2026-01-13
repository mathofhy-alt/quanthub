import React from "react";

interface AdUnitProps {
    slotId: string;
    format?: "auto" | "fluid" | "rectangle";
    className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({ slotId, format = "auto", className }) => {
    return (
        <div className={`w-full flex flex-col items-center gap-1 my-4 ${className}`}>
            <div className="text-[10px] text-slate-600 uppercase tracking-widest">Advertisement</div>
            <div className="w-full overflow-hidden flex justify-center items-center bg-slate-900/30 border border-slate-800/50 rounded-lg min-h-[120px] p-4 text-center">
                <div className="text-xs text-slate-700 font-mono">
                    Google AdSense Slot<br />
                    <span className="text-slate-500">{slotId}</span>
                </div>
                {/* <ins className="adsbygoogle" ... /> */}
            </div>
        </div>
    );
};
