'use client'
import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
const data = [{ name: 'Page A', uv: 0, pv: 2400, amt: 1400 }, { name: 'Page B', uv: 200, pv: 200, amt: 2400 }, { name: 'Page C', uv: 50, pv: 2400, amt: 2400 }, { name: 'Page D', uv: 400, pv: 450, amt: 2400 }];


const Recharts = () => {
    return (
        <LineChart width={400} height={300} data={data}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" /> */}
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
        </LineChart>
    )
}

export default Recharts