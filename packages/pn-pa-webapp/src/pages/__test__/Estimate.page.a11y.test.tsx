import { render, axe } from '../../__test__/test-utils';
import {EstimatePage} from "../Estimate.page";
import {act, RenderResult} from "@testing-library/react";
import * as React from "react";
import {EstimateStatusEnum} from "../../models/UsageEstimation";


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
          estimate: {
            totalDigitalNotif: 100,
            total890Notif: 100,
            totalAnalogNotif: 100,
          },
          billing: {
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

describe("Estimate page - Accessibility test", () => {
  it("does not have basic accessibility issues rendering the page", async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<EstimatePage />, initialState());
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});