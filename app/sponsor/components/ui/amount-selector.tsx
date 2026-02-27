"use client";

const amounts = [5, 10, 25, 50, 100, 200, 500];

interface AmountSelectorProps {
  selectedAmount: number;
  onAmountChange: (amount: number) => void;
}

export function AmountSelector({
  selectedAmount,
  onAmountChange,
}: AmountSelectorProps) {
  return (
    <div className="mb-8 grid w-full grid-cols-2 gap-3 sm:flex sm:gap-0 sm:rounded-xl sm:bg-black">
      {amounts.map((amount, i) => {
        const isActive = amount === selectedAmount;
        const isLast = i === amounts.length - 1;
        return (
          <div
            key={amount}
            onClick={() => onAmountChange(amount)}
            className={`relative cursor-pointer py-4 text-center text-xl transition-colors ${isLast ? "col-span-2 sm:col-span-1" : ""} sm:flex-1 ${
              isActive
                ? "z-10 rounded-xl bg-[#F0562E] text-white ring-2 ring-[#F0562E] ring-offset-2 ring-offset-[#181818]"
                : "rounded-xl bg-black text-white hover:bg-zinc-900 sm:rounded-none sm:bg-transparent"
            } ${i === 0 && !isActive ? "sm:rounded-l-xl" : ""} ${isLast && !isActive ? "sm:rounded-r-xl" : ""} `}
          >
            {/* Right border for inactive items, except the last one, and except if the NEXT item is active */}
            {!isActive && !isLast && amounts[i + 1] !== selectedAmount && (
              <div className="absolute top-0 right-0 bottom-0 hidden w-px bg-zinc-800 sm:block" />
            )}
            ${amount}
          </div>
        );
      })}
    </div>
  );
}
