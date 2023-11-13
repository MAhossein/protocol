'use client'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
const data = [{ name: 'Page A', uv: 350, pv: 2400, amt: 1400 }, { name: 'Page B', uv: 200, pv: 200, amt: 2400 }, { name: 'Page C', uv: 50, pv: 2400, amt: 2400 }, { name: 'Page D', uv: 400, pv: 450, amt: 2400 }];


const ReactBarChart = () => {
    return (
        <BarChart width={600} height={350} data={data}>
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis />
            <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
            <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Bar dataKey="uv" fill="#8884d8" barSize={30} />
        </BarChart>
    )
}

export default ReactBarChart