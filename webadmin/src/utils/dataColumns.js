export const ITEM_COLUMNS = [
  { field: "_id", title: "ID" },
  { field: "name", title: "Name" },
  {
    field: "thumbnail",
    title: "Thumbnail",
    render: (rowData) => (
      <img
        src={rowData.thumbnail}
        alt="item"
        style={{ width: 60, height: 60, borderRadius: "50%" }}
      />
    ),
  },
  { field: "type", title: "Type" },
  { field: "price", title: "Price" },
  {
    field: "sale",
    title: "Sale",
    render: (rowData) => <p>{rowData.sale}%</p>,
  },
  {
    field: "saleExpiresTime",
    title: "Sale Expire Time",
    render: (rowData) => (
      <p>{new Date(rowData.saleExpiresTime).toGMTString()}</p>
    ),
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
  {
    field: "code",
    title: "Code",
    render: (rowData) => (
      <a
        style={{ fontWeight: "500" }}
        href={`/giftcode/${rowData._id}`}
        target="_blank"
        rel="noreferrer"
      >
        {rowData.code}
      </a>
    ),
  },
  { field: "type", title: "Type" },
  { field: "isUsed", title: "Is Used" },
  {
    field: "expiresTime",
    title: "Expire Time",
    render: (rowData) => <p>{new Date(rowData.expiresTime).toGMTString()}</p>,
  },
];

export const ROLLUP_COLUMNS = [
  { field: "_id", title: "ID" },
  {
    field: "day",
    title: "Day",
    render: (rowData) => (
      <a
        style={{ fontWeight: "500" }}
        href={`/rollup/${rowData.day}`}
        target="_blank"
        rel="noreferrer"
      >
        {rowData.day}
      </a>
    ),
  },
  { field: "coin", title: "Coin" },
  {
    field: "thumbnail",
    title: "Thumbnail",
    render: (rowData) => (
      <img
        src={rowData.thumbnail}
        alt="thumbnail"
        style={{ width: 50, borderRadius: "50%" }}
      />
    ),
  },
];

export const BLOG_COLUMNS = [
  { field: "_id", title: "ID" },
  { field: "title", title: "Title" },
  { field: "content", title: "Content" },
  {
    field: "thumbnail",
    title: "Thumbnail",
    render: (rowData) => (
      <img
        src={rowData.thumbnail}
        alt="blog"
        style={{ width: 50, borderRadius: "50%" }}
      />
    ),
  },
  {
    field: "name",
    title: "Writer",
  },
];
