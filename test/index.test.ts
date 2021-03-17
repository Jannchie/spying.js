import { Spy } from "../src/index";
test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});
test("Init Spy", async () => {
  await new Spy().start();
});
