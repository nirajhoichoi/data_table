import { NextResponse } from "next/server";
import { db } from "../db/connect";

export const GET = async (req) => {
  const url = new URL(req.url);
  const urlSearchParams = url.searchParams;

  console.log("urlSearchParams -> ", urlSearchParams);

  const start = parseInt(urlSearchParams.get("start") || "0", 10);
  const size = parseInt(urlSearchParams.get("size") || "10", 10);
  const filters = JSON.parse(urlSearchParams.get("filters") || "[]");
  const globalFilter = urlSearchParams.get("globalFilter") || "";
  const sorting = JSON.parse(urlSearchParams.get("sorting") || "[]");

  // Construct MongoDB query object
  let query = {};

  // Apply global filter
  if (globalFilter) {
    query = {
      $or: [
        { name: { $regex: globalFilter, $options: "i" } },
        { category: { $regex: globalFilter, $options: "i" } },
        { subcategory: { $regex: globalFilter, $options: "i" } },
        // Add other fields you want to search globally
      ],
    };
  }

  // Apply individual filters
  filters.forEach((filter) => {
    if (filter.id && filter.value.length > 0) {
      console.log(
        "filter.id -> ",
        filter.id,
        " filter.value -> ",
        filter.value
      );

      if (filter.id === "createdAt" || filter.id === "updatedAt") {
        const [startDate, endDate] = filter.value;
        if (startDate && endDate) {
          query[filter.id] = {
            $gte: new Date(startDate).toJSON(),
            $lte: new Date(endDate).toJSON(),
          };
        }
      } else if (filter.id === "price" || filter.id === "sale_price") {
        const [initPrice, finalPrice] = filter.value;
        if (initPrice && finalPrice) {
          query[filter.id] = {
            $gte: initPrice,
            $lte: finalPrice,
          };
        }
      } else if (filter.id === "id") {
        // Handle specific filter for ID (assuming ID is a number)
        query[filter.id] = parseInt(filter.value, 10);
      } else if (filter.id === "name") {
        // Handle specific filter for name
        query[filter.id] = { $regex: filter.value, $options: "i" };
      } else {
        // For multi-select filters
        if (filter.id === "category" || filter.id === "subcategory")
          query[filter.id] = { $in: filter.value };
        else query[filter.id] = filter.value;
      }
    }
  });

  // Construct MongoDB sort object
  let sort = {};
  sorting.forEach((sortField) => {
    sort[sortField.id] = sortField.desc ? -1 : 1;
  });

  try {
    const collection = db.collection("data");
    const totalItems = (await collection.find().toArray()).length;

    const posts = await collection
      .find(query)
      .sort(sort)
      .skip(start)
      .limit(size)
      .toArray();

    console.log("query -> ", query);

    return NextResponse.json({ data: posts, totalItem: totalItems });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
};
