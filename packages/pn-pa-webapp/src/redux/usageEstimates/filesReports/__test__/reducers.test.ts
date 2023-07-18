import fileReportsEstimateSlice , {FileReportsState, resetFileReportUrl } from '../reducers';
import {FileReport} from "../../../../models/UsageEstimation";
import {getAllReportsFile, getReportFile} from "../actions";


const initialState: FileReportsState = {
    filesReports: [] as Array<FileReport>,
    fileReportUrl: undefined,
    loading: false,
    error: undefined
};

const fullFilledPayload: FileReportsState = {
    filesReports: [
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
    ] as Array<FileReport>,
    fileReportUrl: undefined,
    loading: false,
    error: undefined
};


const reportFileFullFilledPayload: FileReportsState = {
    filesReports: [
        {
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
        }
    ] as Array<FileReport>,
    fileReportUrl: "https://pn-platform-usage-estimates-s-estimateusagebucket-oraglfzcvjjw.s3.eu-south-1.amazonaws.com/paid_026e8c72-7944-4dcd-8668-f596447fec6d/month_GIU-2023/last/report_compressed-1.zip?X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LXNvdXRoLTEiRjBEAiAfHFIpL8FOrogtBTNiMQ2xA6k5GJRiCt2hSeboDbNVbgIgOfNxAZq3Xa531eJelXmduKAUdl9YStdjV0jUZ9WqMN8q%2FgMIWxAAGgw4MzAxOTIyNDY1NTMiDBJDN51pI3%2BacpE%2BsSrbA8nDZpHNvTtPEiqDzj%2BLQlIU9efqVkMJs0uY9k2ilpHU9XzqqccYgUgLPNOJeEzzSzJTjujhKmFX8XP5qhNdbu4wPtfIypC3gzG3CyFBnz6tfmbygDAAzXbQD9%2B0XCEkL0yAxHkNf9pbGOmsXu4DHAZ%2BfJpjgcEWh%2B353bp8kHSsQQAkXGryGRcx8iCwSPJm5uGeAok1iv4xWGYorAhR8BRf2Kew81Qmf29qRrpdSlKETPOUH1NK9tmbfxCxrXc56qQbT0qj3mUFpMXmjsB3fwCASV6BE8iEJ5KmiwRIZd6shVwjifwP%2BWCztsv4ceQQwvXO%2FK0P013sszdlGWoqhJqzaxiNA9WsD0FhwEd%2BIezeZy1hxXY1v0XDrPOqn%2FcAHUcFTfsv21ZAp9kpto8YST%2Bd9HKPt5hobzeTjNFf%2BOofNH3elMBmMGrw6xvUAdxeRd61AlBdiiFA4a%2BHV%2B6LRSCt%2BO3gMEEhDAuwdNBO3mGzTh8oUN17TljLTgYCX0rhi9ifXIeMUJwUuP%2FPgQvm4J33GaLD%2BY25LIst7VWSyj%2FhrBzaKSa1hK1Ame8576s5RTZlm6NFbGHqWMf0jin3rrZk4GX58fq6cEcDhHDu%2F2OmVmR6JqPfazT2FZ8w6KrUpQY6pgEIfejRVtwhOtcXKS0B2Xqpr5uz77iq04syH1aL19KuM4DKG424Lt%2FKKGIz3OrUYJMbeoLBdCSzyzoFdGCc7BKnG52JvGid9rmn4Ql8MBA0jtQVj6t04lbpAFcjWhI3IF7PHdRowRSKQVHphr6yRHzmzJWcq1yr1y5%2FZYhX0a59N8CjahfYnFTbDRc%2FKW9s04HbRBfEgVFPMEY4Y0NJeA1ZYDOzLCcD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230717T102030Z&X-Amz-SignedHeaders=host&X-Amz-Expires=359999&X-Amz-Credential=ASIA4CS2QL4MZ7YMCUT6%2F20230717%2Feu-south-1%2Fs3%2Faws4_request&X-Amz-Signature=4ae0ace2e72286ddbbe58c643f12cd0c1b2069bb2adb77763ace2e16d4217ed5",
    loading: false,
    error: undefined
}

describe('fileReportsEstimateSlice', () => {

    it('should handle resetDetailState', () => {
        const nextState = fileReportsEstimateSlice.reducer(initialState, resetFileReportUrl());
        expect(nextState.fileReportUrl).toBeUndefined();
        expect(nextState.error).toBeUndefined();
        expect(nextState.loading).toEqual(false);
    });


    it('should create resetDetailState action', () => {
        const action = resetFileReportUrl();
        expect(action.type).toEqual('fileReportsEstimateSlice/resetFileReportUrl');
    });


    it('handle getAllReportsFile.pending', () => {
        const getAllReportsFileParams = {
            paId:"12345ABCDE",
            referenceMonth: "LUG-2023"
        };
        const nextState = fileReportsEstimateSlice.reducer(initialState, getAllReportsFile.pending("testPending", getAllReportsFileParams));
        expect(nextState.loading).toEqual(true);
        expect(nextState.error).toBeUndefined();
    });

    it('handle getAllReportsFile.fulfilled', () => {
        const getAllReportsFileParams = {
            paId:"12345ABCDE",
            referenceMonth: "LUG-2023"
        };

        const nextState = fileReportsEstimateSlice.reducer(initialState, getAllReportsFile.fulfilled(fullFilledPayload.filesReports,"testFulfilled", getAllReportsFileParams));
        expect(nextState.loading).toEqual(false);
        expect(nextState.filesReports).toEqual(fullFilledPayload.filesReports);
    });

    it('handle getAllReportsFile.rejected', () => {
        const getAllReportsFileParams = {
            paId:"12345ABCDE",
            referenceMonth: "LUG-2023"
        };
        const nextState = fileReportsEstimateSlice.reducer(initialState, getAllReportsFile.rejected("ERROR with files reports", "testRejected", getAllReportsFileParams));

        expect(nextState.loading).toEqual(false);
        expect(nextState.filesReports).toEqual([]);
        expect(nextState.error).toEqual('ERROR with files reports');
    });

    it('handle getReportFile.pending', () => {
        const getReportFileParams = {
            paId:"12345ABCDE",
            reportKey: "report_compressed.zip"
        };
        const nextState = fileReportsEstimateSlice.reducer(initialState, getReportFile.pending("testPending", getReportFileParams));
        expect(nextState.loading).toBe(true);
        expect(nextState.fileReportUrl).toBe(undefined);
        expect(nextState.error).toBeUndefined();
    });

    it('handle getReportFile.fulfilled', () => {
        const getReportFileParams = {
            paId:"12345ABCDE",
            reportKey: "report_compressed.zip"
        };
        const nextState = fileReportsEstimateSlice.reducer(initialState, getReportFile.fulfilled(reportFileFullFilledPayload.filesReports[0],"testFulfilled", getReportFileParams));
        expect(nextState.loading).toBe(false);
        expect(nextState.fileReportUrl).toBe(reportFileFullFilledPayload.fileReportUrl);
    });

    it('handle getReportFile.rejected', () => {
        const getReportFileParams = {
            paId:"12345ABCDE",
            reportKey: "report_compressed.zip"
        };
        const nextState = fileReportsEstimateSlice.reducer(initialState, getReportFile.rejected("ERROR with file report", "testRejected", getReportFileParams));
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe('ERROR with file report');
    });

});



