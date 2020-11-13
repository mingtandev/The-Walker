export const ITEM_COLUMNS = [
  { field: "_id", title: "ID" },
  { field: "name", title: "Name" },
  {
    field: "thumbnail",
    title: "Thumbnail",
    render: (rowData) => (
      <img
        src={"http://" + rowData.thumbnail}
        style={{ width: 50, borderRadius: "50%" }}
      />
    ),
  },
  { field: "type", title: "Type" },
  { field: "price", title: "Price" },
  {
    field: "sale",
    title: "Sale",
  },
  {
    field: "saleExpiresTime",
    title: "Sale Expire Time",
  },
];

export const USER_COLUMNS = [
  { field: "_id", title: "ID" },
  { field: "name", title: "Name" },
  { field: "slugName", title: "Slug Name" },
  { field: "email", title: "Email" },
  {
    field: "cash",
    title: "Cash",
  },
  {
    field: "roles",
    title: "Role",
  },
  {
    field: "isVerified",
    title: "Is Verified",
  },
];

export const GIFTCODE_COLUMNS = [
  { field: "_id", title: "ID" },
  { field: "type", title: "Type" },
  { field: "code", title: "Code" },
  { field: "items", title: "Items" },
  { field: "isUsed", title: "Is Used" },
  { field: "items", title: "Items" },
  { field: "expiresTime", title: "Expire Time" },
];

export const ROLLUP_COLUMNS = [
  { field: "_id", title: "ID" },
  { field: "day", title: "Day" },
  { field: "coin", title: "Coin" },
  { field: "item", title: "Item(s)" },
  {
    field: "thumbnail",
    title: "Thumbnail",
    render: (rowData) => (
      <img
        src={"http://" + rowData.thumbnail}
        style={{ width: 50, borderRadius: "50%" }}
      />
    ),
  },
];

export const BLOG_COLUMNS = [
  { field: "id", title: "No." },
  { field: "_id", title: "ID" },
  { field: "title", title: "Title" },
  { field: "content", title: "Content" },
  {
    field: "thumbnail",
    title: "Thumbnail",
    render: (rowData) => (
      <img
        src={"http://" + rowData.thumbnail}
        style={{ width: 50, borderRadius: "50%" }}
      />
    ),
  },
  {
    field: "writer",
    title: "Writer",
  },
];
