import React from "react";

const HallGrid = ({ stalls, companyStalls, bookedStalls, onStallClick }) => {
  // Get company stall numbers
  const companyStallNumbers = companyStalls.map((stall) => stall.stall_number);

  const getStallStatus = (stall) => {
    if (companyStallNumbers.includes(stall.stall_number)) {
      return "my-stall";
    }
    if (bookedStalls.includes(stall.stall_number)) {
      return "booked";
    }
    if (stall.status === "unavailable") {
      return "unavailable";
    }
    return "available";
  };

  // Function to get open sides as array
  const getOpenSidesArray = (stall) => {
    if (Array.isArray(stall.open_sides)) {
      return stall.open_sides;
    }

    // Fallback for old data structure
    if (
      stall.open_side_top ||
      stall.open_side_right ||
      stall.open_side_bottom ||
      stall.open_side_left
    ) {
      const sides = [];
      if (stall.open_side_top) sides.push("top");
      if (stall.open_side_right) sides.push("right");
      if (stall.open_side_bottom) sides.push("bottom");
      if (stall.open_side_left) sides.push("left");
      return sides;
    }

    // Default to 3 sides
    return ["top", "right", "bottom"];
  };

  // Function to get open sides count
  const getOpenSidesCount = (stall) => {
    if (stall.open_sides_count) {
      return stall.open_sides_count;
    }
    return getOpenSidesArray(stall).length;
  };

  // Function to render stall with open sides indicators
  const renderStallWithSides = (stall) => {
    const status = getStallStatus(stall);
    const statusClasses = {
      "my-stall": "bg-blue-100 border-blue-500 text-blue-700",
      booked: "bg-gray-200 border-gray-400 text-gray-500",
      unavailable: "bg-red-100 border-red-400 text-red-500",
      available: "bg-white border-gray-300 hover:bg-green-50 text-gray-800",
    };

    const openSides = getOpenSidesArray(stall);
    const openSidesCount = getOpenSidesCount(stall);

    return (
      <div className="relative group">
        {/* Stall container */}
        <div
          className={`w-16 h-16 ${statusClasses[status]} border-2 rounded flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 relative overflow-hidden`}
          onClick={() => onStallClick(stall.stall_number)}
        >
          {/* Stall number */}
          <div className="text-sm font-bold">{stall.stall_number}</div>
          <div className="text-xs text-gray-500 mt-1">{stall.scheme}</div>

          {/* Open sides indicators with arrows */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top side arrow */}
            {openSides.includes("top") && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-0 h-0 border-l-3 border-r-3 border-b-3 border-transparent border-b-blue-500"></div>
              </div>
            )}

            {/* Right side arrow */}
            {openSides.includes("right") && (
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-0 h-0 border-t-3 border-b-3 border-l-3 border-transparent border-l-blue-500"></div>
              </div>
            )}

            {/* Bottom side arrow */}
            {openSides.includes("bottom") && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-blue-500"></div>
              </div>
            )}

            {/* Left side arrow */}
            {openSides.includes("left") && (
              <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-0 h-0 border-t-3 border-b-3 border-r-3 border-transparent border-r-blue-500"></div>
              </div>
            )}
          </div>

          {/* Open sides count badge */}
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-blue-100 border border-blue-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-blue-700">
              {openSidesCount}
            </span>
          </div>

          {/* Status indicator */}
          {status === "my-stall" && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}

          {/* Premium floor indicator */}
          {stall.premium_floor && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full"></div>
          )}
        </div>

        {/* Stall info on hover */}
        <div className="absolute hidden group-hover:block z-10 bottom-full mb-2 w-56 bg-white border rounded-lg shadow-lg p-3">
          <div className="text-xs">
            <div className="font-bold mb-1 flex justify-between items-start">
              <span>Stall {stall.stall_number}</span>
              {stall.premium_floor && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Premium
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-gray-600">Hall:</div>
              <div className="font-medium">{stall.hall_number}</div>

              <div className="text-gray-600">Scheme:</div>
              <div className="font-medium">{stall.scheme}</div>

              <div className="text-gray-600">Size:</div>
              <div className="font-medium">{stall.size}</div>

              <div className="text-gray-600">Area:</div>
              <div className="font-medium">{stall.area} sqm</div>

              <div className="text-gray-600">Open Sides:</div>
              <div className="font-medium">{openSidesCount} sides</div>

              <div className="text-gray-600">Price:</div>
              <div className="font-medium text-green-600">
                ₹{parseFloat(stall.price).toLocaleString()}
              </div>
            </div>

            {/* Open sides visualization */}
            <div className="mt-2 pt-2 border-t">
              <div className="text-gray-600 mb-1">Open Sides:</div>
              <div className="flex flex-wrap gap-1">
                {["top", "right", "bottom", "left"].map((side) => (
                  <span
                    key={side}
                    className={`px-2 py-1 rounded text-xs ${
                      openSides.includes(side)
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {side.charAt(0).toUpperCase() + side.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-2 pt-2 border-t">
              <div
                className={`text-center font-medium ${
                  status === "available"
                    ? "text-green-600"
                    : status === "my-stall"
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {status === "available"
                  ? "✓ Available - Click to Book"
                  : status === "my-stall"
                  ? "✓ Your Stall"
                  : "✗ " + status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Create grid layout based on stall coordinates or sequential grouping
  const renderGrid = () => {
    // Sort stalls by x and y position if available
    const sortedStalls = [...stalls].sort((a, b) => {
      if (a.y_position !== b.y_position) {
        return a.y_position - b.y_position;
      }
      return a.x_position - b.x_position;
    });

    // Group stalls by rows (y_position)
    const rows = {};
    sortedStalls.forEach((stall) => {
      const row = stall.y_position || 1;
      if (!rows[row]) {
        rows[row] = [];
      }
      rows[row].push(stall);
    });

    // Sort rows and columns
    const sortedRows = Object.keys(rows)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((row) =>
        rows[row].sort((a, b) => (a.x_position || 0) - (b.x_position || 0))
      );

    return (
      <div className="space-y-2">
        {sortedRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2">
            {row.map((stall) => (
              <div key={stall.id} className="group">
                {renderStallWithSides(stall)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      {/* Grid with aisle lines */}
      <div className="relative">
        {/* Aisle markers */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-300 border-dashed border-yellow-400 transform -translate-y-1/2"></div>
        <div className="absolute left-1/4 right-1/4 top-0 bottom-0 w-0.5 bg-yellow-300 border-dashed border-yellow-400"></div>

        {/* Stalls grid */}
        <div className="relative z-10">{renderGrid()}</div>
      </div>
    </div>
  );
};

export default HallGrid;
