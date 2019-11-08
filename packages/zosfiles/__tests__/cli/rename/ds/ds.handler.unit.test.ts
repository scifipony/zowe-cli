/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { Rename, IZosFilesResponse } from "../../../../src/api";
import Handler from "../../../../src/cli/rename/ds/ds.handler";
import { ZosFilesBaseHandler } from "../../../../src/cli/ZosFilesBase.handler";

describe("DsHandler", () => {
    const defaultReturn: IZosFilesResponse = {
        success        : true,
        commandResponse: "THIS IS A TEST"
    };

    const renameDataSetSpy = jest.spyOn(Rename, "dataSet");

    beforeEach(() => {
        renameDataSetSpy.mockClear();
        renameDataSetSpy.mockImplementation(async () => defaultReturn);
    });

    it("should call Copy.dataSet", async () => {
        const handler = new Handler();

        expect(handler).toBeInstanceOf(ZosFilesBaseHandler);

        const commandParameters: any = {
            arguments: {
                beforeDataSetName: "ABCD",
                afterDataSetName: "EFGH",
            }
        };

        const dummySession = {
            user: "dummy",
            password: "dummy",
            hostname: "machine",
            port: 443,
            protocol: "https",
            type: "basic"
        };

        const response = await handler.processWithSession(commandParameters, dummySession as any);

        expect(renameDataSetSpy).toHaveBeenCalledTimes(1);
        expect(renameDataSetSpy).toHaveBeenLastCalledWith(
            dummySession,
            commandParameters.arguments.beforeDataSetName,
            commandParameters.arguments.afterDataSetName,
        );
        expect(response).toBe(defaultReturn);
    });
});
