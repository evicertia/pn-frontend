import {cleanup} from '@testing-library/react';
import {FilesReportsApi} from "../../../../api/usageEstimates/FilesReports/FilesReports.api";
import {getAllReportsFile, getReportFile} from "../actions";
import {mockAuthentication} from '../../../auth/__test__/test-utils';
import {store} from '../../../store';
import {FileReport} from "../../../../models/UsageEstimation";

interface FileReportsState {
    filesReports: Array<FileReport>;
    fileReportUrl?: string;
    loading: boolean;
    error: string | number | undefined;
}

const initialState: FileReportsState = {
    filesReports: [] as Array<FileReport>,
    fileReportUrl: undefined,
    loading: false,
    error: undefined
};


const getAllActionResult: Array<FileReport> = [
    {
        paId: "026e8c72-7944-4dcd-8668-f596447fec6d",
        reportKey: "report_compressed.zip",
        reportZipKey: null,
        url: null,
        referenceMonth: "GIU-2023",
        lastModifiedDate: null,
        errorMessage: null,
        generationDate: null,
        part: null,
        status: null
    },
    {
        paId: "026e8c72-7944-4dcd-8668-f596447fec6d",
        reportKey: "report_compressed-1.zip",
        reportZipKey: null,
        url: null,
        referenceMonth: "GIU-2023",
        lastModifiedDate: null,
        errorMessage: null,
        generationDate: null,
        part: null,
        status: null
    }
];


const getActionResult: FileReport = {
    paId: "026e8c72-7944-4dcd-8668-f596447fec6d",
    reportKey: "report_compressed.zip",
    reportZipKey: null,
    url: "https://pn-platform-usage-estimates-s-estimateusagebucket-oraglfzcvjjw.s3.eu-south-1.amazonaws.com/paid_026e8c72-7944-4dcd-8668-f596447fec6d/month_GIU-2023/last/report_compressed-1.zip?X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LXNvdXRoLTEiRjBEAiAfHFIpL8FOrogtBTNiMQ2xA6k5GJRiCt2hSeboDbNVbgIgOfNxAZq3Xa531eJelXmduKAUdl9YStdjV0jUZ9WqMN8q%2FgMIWxAAGgw4MzAxOTIyNDY1NTMiDBJDN51pI3%2BacpE%2BsSrbA8nDZpHNvTtPEiqDzj%2BLQlIU9efqVkMJs0uY9k2ilpHU9XzqqccYgUgLPNOJeEzzSzJTjujhKmFX8XP5qhNdbu4wPtfIypC3gzG3CyFBnz6tfmbygDAAzXbQD9%2B0XCEkL0yAxHkNf9pbGOmsXu4DHAZ%2BfJpjgcEWh%2B353bp8kHSsQQAkXGryGRcx8iCwSPJm5uGeAok1iv4xWGYorAhR8BRf2Kew81Qmf29qRrpdSlKETPOUH1NK9tmbfxCxrXc56qQbT0qj3mUFpMXmjsB3fwCASV6BE8iEJ5KmiwRIZd6shVwjifwP%2BWCztsv4ceQQwvXO%2FK0P013sszdlGWoqhJqzaxiNA9WsD0FhwEd%2BIezeZy1hxXY1v0XDrPOqn%2FcAHUcFTfsv21ZAp9kpto8YST%2Bd9HKPt5hobzeTjNFf%2BOofNH3elMBmMGrw6xvUAdxeRd61AlBdiiFA4a%2BHV%2B6LRSCt%2BO3gMEEhDAuwdNBO3mGzTh8oUN17TljLTgYCX0rhi9ifXIeMUJwUuP%2FPgQvm4J33GaLD%2BY25LIst7VWSyj%2FhrBzaKSa1hK1Ame8576s5RTZlm6NFbGHqWMf0jin3rrZk4GX58fq6cEcDhHDu%2F2OmVmR6JqPfazT2FZ8w6KrUpQY6pgEIfejRVtwhOtcXKS0B2Xqpr5uz77iq04syH1aL19KuM4DKG424Lt%2FKKGIz3OrUYJMbeoLBdCSzyzoFdGCc7BKnG52JvGid9rmn4Ql8MBA0jtQVj6t04lbpAFcjWhI3IF7PHdRowRSKQVHphr6yRHzmzJWcq1yr1y5%2FZYhX0a59N8CjahfYnFTbDRc%2FKW9s04HbRBfEgVFPMEY4Y0NJeA1ZYDOzLCcD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230717T102030Z&X-Amz-SignedHeaders=host&X-Amz-Expires=359999&X-Amz-Credential=ASIA4CS2QL4MZ7YMCUT6%2F20230717%2Feu-south-1%2Fs3%2Faws4_request&X-Amz-Signature=4ae0ace2e72286ddbbe58c643f12cd0c1b2069bb2adb77763ace2e16d4217ed5",
    referenceMonth: "GIU-2023",
    lastModifiedDate: null,
    errorMessage: null,
    generationDate: null,
    part: null,
    status: null
};


describe("filesReportsActionsTest", () =>{
    mockAuthentication();
    afterEach(cleanup);

    it('Initial state', () => {
        const state = store.getState().fileReportsEstimateState;
        expect(state).toEqual(initialState);
    });


    it('getAllReportsFile call ', async () => {
        const apiSpy = jest.spyOn(FilesReportsApi, 'getAllReportsFile');
        apiSpy.mockResolvedValue(getAllActionResult);
        const getAllReportsFileParams = {
            paId:"12345ABCDE",
            referenceMonth: "LUG-2023"
        };
        const action = await store.dispatch(getAllReportsFile(getAllReportsFileParams));
        const payload = action.payload;
        expect(action.type).toBe('getAllReportsFile/fulfilled');
        expect(payload).toEqual(getAllActionResult);
    });

    it('getReportFile call ', async () => {
        const apiSpy = jest.spyOn(FilesReportsApi, 'getReportFile');
        apiSpy.mockResolvedValue(getActionResult);
        const getReportFileParams = {
            paId:"12345ABCDE",
            reportKey: "report_compressed.zip"
        };
        const action = await store.dispatch(getReportFile( getReportFileParams));
        const payload = action.payload;
        expect(action.type).toBe('getReportFile/fulfilled');
        expect(payload).toEqual(getActionResult);
    });
});


