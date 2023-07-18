import {act, RenderResult} from "@testing-library/react";
import {axe, render} from "../../__test__/test-utils";
import {ProfilingPage} from "../Profiling.page";
import {EstimateStatusEnum} from "../../models/UsageEstimation";
import * as React from "react";


const initialState = () => ({
  preloadedState: {
    usageEstimateState: {
      historyEstimates: {
        actual: {
          status: EstimateStatusEnum.VALIDATED,
          showEdit: true,
          deadlineDate: "2023-06-08",
          referenceMonth: "MAR-2023",
          lastModifiedDate: "2023-06-08",
          profilation: {
            splitPayment: true,
            description: "ABC",
            mailAddress: "mario.rossi@gmail.com"
          }
        },
        history: {
          'number' : 0,
          size: 0,
          totalElements: 0,
          content: []
        }
      },
      pagination: {
        page: 1,
        size: 10,
      }
    },
    userState: {
      user: {
        organization: {
          id: "PA_ID_1234"
        },
        sessionToken: "",
        name: "",
        family_name: "",
        fiscal_number: "",
        email: "",
        uid: ""
      }
    }
  },
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe("Profiling page - Accessibility test", () => {
  it("does not have basic accessibility issues rendering the page", async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<ProfilingPage />, initialState());
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});