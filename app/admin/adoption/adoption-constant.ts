import moment from "moment";

export const TableAdoptionColumns = [
  {
    name: "id",
    label: "ID",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "userEmail",
    label: "User Email",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "userId",
    label: "User Id",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "contactNumber",
    label: "Contact Number",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "address",
    label: "Address",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "petExperience",
    label: "Pet Experience",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "petId",
    label: "Pet Id",
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
    name: "notes",
    label: "Notes",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "adoptionReason",
    label: "Adoption Reason",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "adoptionStatus",
    label: "Adoption Status",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "applicationDate",
    label: "Application Date",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: string) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
  },
  {
    name: "approvalDate",
    label: "Approval Date",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: string) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
  },
];
