/// <reference path="../../lib/StringFilr.d.ts" />

const mocks = {
    /**
     * @param settings   Settings for the StringFilr.
     * @returns An StringFilr instance.
     */
    mockStringFilr: (settings?: StringFilr.IStringFilrSettings<any>): StringFilr.IStringFilr<any> => {
        return new StringFilr.StringFilr(settings);
    }
};
