export const convertTitleToId = (title: string) => title.replaceAll(/\W+/g, "-").toLowerCase();
