export const buildQueryPrisma = (req) => {
  let { page, pageSize, filters } = req.query;

  try {
    filters = JSON.parse(filters);
  } catch (error) {
    filters = {};
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (typeof value === "string") {
      filters[key] = {
        contains: value,
      };
    }
  });

  const where = {
    isDeleted: false,
    ...filters,
  };

  const pageDefault = 1;
  const pageSizeDefault = 3;

  //chuyển đổi thành số
  page = Number(page);
  pageSize = Number(pageSize);

  //nếu gửi chữ
  page = Number(page) || pageDefault;
  pageSize = Number(pageSize) || pageSizeDefault;

  //nếu số âm
  if (page < 1) page = pageDefault;
  if (pageSize < 1) pageSize = pageSizeDefault;

  const index = (page - 1) * pageSize;

  return {
    where,
    page,
    pageSize,
    index,
  };
};
