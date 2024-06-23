// import React, { useEffect, useState, useMemo } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";

// function formatDate(dateString) {
//   let date = new Date(dateString);
//   return `${String(date.getDate()).padStart(2, "0")}-${
//     [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ][date.getMonth()]
//   }-${String(date.getFullYear()).slice(-2)}`;
// }

// const Table = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("/api/getData");
//         const result = await response.json();
//         setData(result);
//       } catch (error) {
//         console.error("Error fetching data:", error.message);
//       }
//     };

//     fetchData();
//   }, []);

//   const columns = useMemo(
//     () => [
//       {
//         header: "ID",
//         accessorKey: "id",
//       },
//       {
//         header: "Name",
//         accessorKey: "name",
//       },
//       {
//         header: "Category",
//         accessorKey: "category",
//         filterVariant: "multi-select",
//       },
//       {
//         header: "Subcategory",
//         accessorKey: "subcategory",
//         filterVariant: "multi-select",
//       },
//       {
//         header: "CreatedAt",
//         id: "createdAt",
//         filterVariant: "date-range",
//         accessorFn: (originalRow) => new Date(originalRow.createdAt), //convert to date for sorting and filtering
//         Cell: ({ cell }) => formatDate(cell.getValue()), // convert back to string for display
//       },
//       {
//         header: "UpdatedAt",
//         id: "updatedAt",
//         filterVariant: "date-range",
//         accessorFn: (originalRow) => new Date(originalRow.updatedAt), //convert to date for sorting and filtering
//         Cell: ({ cell }) => formatDate(cell.getValue()), // convert back to string for display
//       },
//       {
//         header: "Price",
//         accessorKey: "price",
//         filterVariant: "range-slider",
//         filterFn: "betweenInclusive",
//         muiFilterSliderProps: {
//           marks: true,
//           min: 11,
//           max: 200,
//         },
//       },
//       {
//         header: "Sale price",
//         accessorKey: "sale_price",
//         filterVariant: "range-slider",
//         filterFn: "betweenInclusive",
//         muiFilterSliderProps: {
//           marks: true,
//           min: 0,
//           max: 100,
//         },
//       },
//     ],
//     []
//   );

//   const table = useMaterialReactTable({
//     data,
//     columns,
//     enableFacetedValues: true,
//     initialState: { showColumnFilters: true },
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default Table;

import React, { useState, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

function formatDate(dateString) {
  let date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}-${
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][date.getMonth()]
  }-${String(date.getFullYear()).slice(-2)}`;
}

const Table = () => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isError, isRefetching, isLoading, refetch } = useQuery({
    queryKey: [
      "table-data",
      columnFilters,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      const fetchURL = new URL(
        "/api/getData", // Adjust this to your actual data endpoint
        process.env.NODE_ENV === "production"
          ? "https://your-production-url.com" // Replace with your production URL
          : "http://localhost:3000" // Replace with your local development URL
      );

      // Add query parameters based on the current state
      fetchURL.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      fetchURL.searchParams.set("size", `${pagination.pageSize}`);
      fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
      fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      console.log("fetchURL.href -> ", fetchURL.href);

      const response = await fetch(fetchURL.href);
      const json = await response.json();

      return json;
    },
  });

  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Category",
        accessorKey: "category",
        filterVariant: "multi-select",
      },
      {
        header: "Subcategory",
        accessorKey: "subcategory",
        filterVariant: "multi-select",
      },
      {
        header: "CreatedAt",
        id: "createdAt",
        filterVariant: "date-range",
        accessorFn: (originalRow) => new Date(originalRow.createdAt),
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        header: "UpdatedAt",
        id: "updatedAt",
        filterVariant: "date-range",
        accessorFn: (originalRow) => new Date(originalRow.updatedAt),
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        header: "Price",
        accessorKey: "price",
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        muiFilterSliderProps: {
          marks: true,
          min: 11,
          max: 200,
        },
      },
      {
        header: "Sale price",
        accessorKey: "sale_price",
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        muiFilterSliderProps: {
          marks: true,
          min: 0,
          max: 100,
        },
      },
    ],
    []
  );

  console.log("data -> ", data);

  const totalItems = data?.totalItem ?? 0; // total number of items from the response
  const rowCount = totalItems;
  const tableData = data?.data ?? [];

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableFacetedValues: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

const TableWithQueryProvider = () => (
  <QueryClientProvider client={queryClient}>
    <Table />
  </QueryClientProvider>
);

export default TableWithQueryProvider;
