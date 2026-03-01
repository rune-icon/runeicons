import React from "react";

const Bento = () => {
  return (
    <section className="w-full h-screen">
      <div className="mx-auto grid w-full h-full grid-cols-1 gap-4 lg:grid-cols-12 my-6">
        <div className="grid grid-cols-1 gap-4 lg:col-span-3 lg:h-full lg:grid-rows-[6fr_4fr]">
          <div className="h-[220px] rounded-3xl border bg-white lg:h-full" />
          <div className="h-[220px] rounded-3xl border bg-white lg:h-full" />
        </div>

        <div className="min-h-[460px] rounded-3xl border bg-white lg:col-span-4" />

        <div className="grid grid-cols-1 gap-4 lg:col-span-5 lg:h-full lg:grid-rows-[4fr_6fr]">
          <div className="h-[220px] rounded-3xl border bg-white lg:h-full" />
          <div className="h-[220px] rounded-3xl border bg-white lg:h-full" />
        </div>
      </div>
    </section>
  );
};

export default Bento;
