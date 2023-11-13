import React from 'react'

import Recharts from "../(Graphs)/Recharts";
import ReactBarChart from "../(Graphs)/ReactBarChart";

const ThirdStep = () => {
    return (
        <>
            <div className="flex space-x-4 ml-64">
                <p className="p-1 px-4 text-md font-semibold text-blue-700 bg-blue-200 rounded-full">Total number of trails: 2765 blue light</p>
                <p className="p-1 px-4 text-md font-semibold text-green-700 bg-green-200 rounded-full">Total number of trails: 2765 green light</p>
            </div>
            <div className="flex space-x-10 mt-4 items-center justify-center">
                <div>
                    <div className="">
                        <Recharts />
                        {/* <RechartsNew /> */}
                    </div>
                    <div className="flex items-center justify-center mt-12 space-x-2">
                        <p className="text-sm font-semibold">Cut-off year</p>
                        <input placeholder="2010" className="bg-white p-1.5 border border-black rounded-md placeholder:text-sm" type="text" name="" id="" />
                        <button className="border border-black rounded-md p-1.5">Apply</button>
                    </div>
                </div>
                <div>
                    <div className="">
                        <ReactBarChart />
                        {/* <ReactPloty /> */}
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <p className="text-sm font-semibold">Cut-off phase</p>
                        <input placeholder="Phase 0" className="bg-white p-1.5 border border-black rounded-md placeholder:text-sm" type="text" name="" id="" />
                        <button className="border border-black rounded-md p-1.5">Apply</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ThirdStep