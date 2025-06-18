import { loopUntilNumber } from "@/services/utils";

test("check loop", () => {
  expect(loopUntilNumber([1, 2, 3, 4], 2)).toEqual([1, 2]);
});
