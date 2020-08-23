function hello() {
  return 1 + 1;
}

describe("hello", () => {
  it("run", () => {
    expect(hello()).toBe(2);
  });
});
