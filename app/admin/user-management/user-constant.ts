import moment from "moment";

export const TableUserColumns = [
  {
    name: "id",
    label: "ID",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "emailAddress",
    label: "Email Address",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "fullName",
    label: "fullName",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "role",
    label: "Role",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: number) => {
        return value == 0 ? "Admin" : value == 2 ? "Staff" : "User";
      },
    },
  },
];
