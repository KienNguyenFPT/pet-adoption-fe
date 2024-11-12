import moment from "moment";

export const TableDonationColumns = [
  {
    name: "money",
    label: "Amount",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "shelterId",
    label: "shelter Id",
    options: {
      filter: true,
      sort: true,
    },
  },

  {
    name: "shelterAddress",
    label: "Shelter Address",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "transactionId",
    label: "Transaction Id",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "paymentStatus",
    label: "Payment Status",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "date",
    label: "Payment Date",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: string) => {
        return moment(value).format("DD/MM/YYYY HH:mm:ss");
      },
    },
  },
];
