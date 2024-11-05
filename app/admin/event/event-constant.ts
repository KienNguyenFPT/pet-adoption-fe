import moment from "moment";

export const TableEventColumns = [
  {
    name: "id",
    label: "ID",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "eventName",
    label: "Event Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "eventType",
    label: "Event Type",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "description",
    label: "Description",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "eventStatus",
    label: "Status",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: string) => {
        return value == "1" ? "Active" : "Inactive";
      },
    },
  },
  {
    name: "location",
    label: "Location",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "startDate",
    label: "Start Date",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: string) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
  },
  {
    name: "endDate",
    label: "End Date",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: string) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
  },
];
