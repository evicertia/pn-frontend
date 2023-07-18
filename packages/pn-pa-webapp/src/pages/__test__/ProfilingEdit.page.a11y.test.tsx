import {act, RenderResult} from "@testing-library/react";
import {axe, render} from "../../__test__/test-utils";
import {ProfilingEditPage} from "../ProfilingEdit.page";
import * as React from "react";


jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe("Profiling Edit page - Accessibility test", () => {
  it("does not have basic accessibility issues rendering the page", async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<ProfilingEditPage />);
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});