"use client";

const amounts = ["$5", "$10", "$25", "$50", "$100", "$200", "$500"];

interface AmountSelectorProps {
  selectedAmount: string;
  onAmountChange: (amount: string) => void;
}

export function AmountSelector({
  selectedAmount,
  onAmountChange,
}: AmountSelectorProps) {
  return (
    <div className="mb-8 flex w-full rounded-xl bg-black">
      {amounts.map((amount, i) => {
        const isActive = amount === selectedAmount;
        return (
          <div
            key={amount}
            onClick={() => onAmountChange(amount)}
            className={`relative flex-1 cursor-pointer py-4 text-center text-xl transition-colors ${isActive ? "z-10 rounded-xl bg-[#F0562E] text-white ring-2 ring-[#F0562E] ring-offset-2 ring-offset-[#181818]" : "text-white hover:bg-zinc-900"} ${i === 0 && !isActive ? "rounded-l-xl" : ""} ${i === amounts.length - 1 && !isActive ? "rounded-r-xl" : ""} `}
          >
            {/* Right border for inactive items, except the last one, and except if the NEXT item is active */}
            {!isActive &&
              i !== amounts.length - 1 &&
              amounts[i + 1] !== selectedAmount && (
                <div className="absolute top-0 right-0 bottom-0 w-px bg-zinc-800" />
              )}
            {amount}
          </div>
        );
      })}
    </div>
  );
}
