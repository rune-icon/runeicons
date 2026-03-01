import React from "react";
import { Input } from "../ui/input";

const Search = () => {
  return (
    <div className="h-screen grid grid-cols-2 py-6">
      <div className="h-full flex justify-end">
        <div className="w-full flex flex-col justify-end gap-4">
          <div className="w-86.5 text-5xl font-medium">
            <span>Search & </span>
            <span className="text-blue-700">Discover Icons</span>
          </div>
          <div className=" text-xl leading-6">
            Quickly find the perfect icon using smart search <br /> filters, and
            organized categories.
          </div>
        </div>
      </div>
      <div className="">
        <div
          className=" h-full w-full bg-cover bg-center flex justify-center items-center rounded-2xl"
          style={{ backgroundImage: "url('/landing/search/search-bg.png')" }}
        >
          <div className="w-md">
            <Input />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
