import React from "react";

interface Status {
  totalProjects: number;
  statusData: StatusData[];
  itemName: string;
}
interface StatusData {
  name: string;
  count: number;
  color: string;
}

const StatusCard = ({ totalProjects, statusData, itemName }: Status) => {
  // Calculate the percentage of projects in each status
  const calculatePercentage = (statusCount: number) => {
    return ((statusCount / totalProjects) * 100).toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg mt-4 p-4">
      {statusData.map((status, index) => (
        <div key={index} className="mb-2">
          <div className="text-gray-600">{status.name}</div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between text-xs">
              <div>
                {status.count} {itemName}
              </div>
              <div className="text-right">
                {calculatePercentage(status.count)}%
              </div>
            </div>
            <div className="h-2 relative max-w-xl rounded-full overflow-hidden">
              <div
                className={`h-2 w-full absolute`}
                style={{
                  width: `${calculatePercentage(status.count)}%`,
                  backgroundColor: `${status.color}`,
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusCard;
