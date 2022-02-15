const generateKruskals = () => {
  let [start, end] = getStartAndEnd();
  wallifyItAll();
  kruskals(grid, animatorRef);
  animatorRef.current.pushOneToOpenQueue(() => resetStartAndEnd(start, end));
  animatorRef.current.closeOpenQueue(true);
};
