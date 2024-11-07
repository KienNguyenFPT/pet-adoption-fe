import moment from "moment";

export const TableHealthColumns = [
  {
    name: "id",
    label: "Health ID",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "petId",
    label: "Pet ID",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "petName",
    label: "Pet Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "shortDescription",
    label: "Description",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "vaccineStatus",
    label: "Vaccine Status",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: string) => {
        return value == "0"
          ? "Have not been vaccinated".toUpperCase()
          : "Have been vaccinated";
      },
    },
  },

  {
    name: "date",
    label: "Date",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: string) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
  },
];
