import { memo, useState } from "react";
import PropTypes from "prop-types";

const PackageCard = memo(({ pkg, type }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => setShowMore((prev) => !prev);

  // Key fields to always display
  const keyFields = ["name", "price", "duration"];
  // Secondary fields to show conditionally
  const secondaryFields = Object.keys(pkg).filter(
    (key) => !keyFields.includes(key) && key !== "id" && key !== "createdAt"
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-xs w-full transition-colors duration-200 hover:bg-gray-50 self-start">
      {/* Key Fields Section */}
      <div className="space-y-2">
        {/* Package Name */}
        <h2 className="text-gray-900 text-lg font-semibold truncate">
          {pkg.name || "Unnamed Package"}
        </h2>
        {/* Price */}
        {pkg.price != null && (
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm font-medium">Price:</span>
            <span className="text-gray-900 text-sm">
              {typeof pkg.price === "number"
                ? `${pkg.price.toLocaleString()} ${
                    type === "Umrah" ? "PKR" : "PKR"
                  }`
                : pkg.price || "N/A"}
            </span>
          </div>
        )}
        {/* Duration */}
        {pkg.duration != null && (
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm font-medium">Duration:</span>
            <span className="text-gray-900 text-sm">
              {typeof pkg.duration === "number"
                ? `${pkg.duration} days`
                : pkg.duration || "N/A"}
            </span>
          </div>
        )}
      </div>

      {/* Secondary Fields (Collapsible) */}
      {secondaryFields.length > 0 && (
        <div className="mt-3">
          {secondaryFields.slice(0, showMore ? undefined : 3).map((key) => {
            const value = pkg[key];
            if (
              value == null ||
              (Array.isArray(value) && value.length === 0) ||
              (typeof value === "object" && Object.keys(value).length === 0)
            ) {
              return null;
            }
            let displayValue;
            if (Array.isArray(value)) {
              displayValue = (
                <span title={value.join(", ")} className="truncate">
                  {value.join(", ")}
                </span>
              );
            } else if (
              typeof value === "object" &&
              (key === "makkahHotel" || key === "madinahHotel")
            ) {
              displayValue =
                value.name && value.starRating
                  ? `${value.name} (${value.starRating}★)`
                  : "N/A";
            } else if (key === "transport") {
              displayValue = value ? "Included" : "Not Included";
            } else if (typeof value === "object") {
              displayValue = JSON.stringify(value);
            } else {
              displayValue = value;
            }
            return (
              <div key={key} className="flex justify-between py-1">
                <span className="text-gray-600 text-xs capitalize truncate">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="text-gray-900 text-xs truncate">
                  {displayValue || "N/A"}
                </span>
              </div>
            );
          })}
          {secondaryFields.length > 3 && (
            <button
              onClick={toggleShowMore}
              className="text-indigo-600 text-xs font-medium hover:text-indigo-800 mt-2 focus:outline-none focus:underline"
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
});

PackageCard.displayName = "PackageCard";

PackageCard.propTypes = {
  pkg: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default PackageCard;
