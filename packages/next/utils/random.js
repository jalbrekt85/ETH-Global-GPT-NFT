const random = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};

export default random;