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
    name: "AdoptionName",
    label: "Adoption Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "age",
    label: "Age",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "breed",
    label: "Breed",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "gender",
    label: "Gender",
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
    name: "rescuedDate",
    label: "Rescued Date",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: string) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
  },
  {
    name: "shelterId",
    label: "Shelter Id",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "shelterName",
    label: "Shelter Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  // {
  //   name: "AdoptionImages",
  //   label: "Images",
  //   options: {
  //     filter: false,
  //     sort: false,
  //   },
  // },
];
