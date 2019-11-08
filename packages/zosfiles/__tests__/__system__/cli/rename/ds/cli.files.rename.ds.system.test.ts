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

import { runCliScript } from "../../../../../../../__tests__/__src__/TestUtils";
import { TestEnvironment } from "../../../../../../../__tests__/__src__/environment/TestEnvironment";
import { ITestEnvironment } from "../../../../../../../__tests__/__src__/environment/doc/response/ITestEnvironment";
import { ITestPropertiesSchema } from "../../../../../../../__tests__/__src__/properties/ITestPropertiesSchema";
import { join } from "path";
import { Session } from "@zowe/imperative";
import { Delete, List } from "../../../../..";

let TEST_ENVIRONMENT: ITestEnvironment;
let defaultSystem: ITestPropertiesSchema;
let beforeDataSetName: string;
let afterDataSetName: string;
let user: string;
let REAL_SESSION: Session;

const scriptsLocation = join(__dirname, "__scripts__", "command");
const createSequentialScript = join(scriptsLocation, "command_create_data_set_sequential.sh");
const createPartitionedScript = join(scriptsLocation, "command_create_data_set_partitioned.sh");
const renameScript = join(scriptsLocation, "command_rename_data_set.sh");

describe("Copy Dataset", () => {
    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            tempProfileTypes: ["zosmf"],
            testName: "zos_copy_data_set"
        });
        defaultSystem = TEST_ENVIRONMENT.systemTestProperties;
        REAL_SESSION = TestEnvironment.createZosmfSession(TEST_ENVIRONMENT);

        user = defaultSystem.zosmf.user.trim().toUpperCase();
        beforeDataSetName = `${user}.TEST.BEFORE.DS`;
        afterDataSetName = `${user}.TEST.AFTER.DS`;
    });
    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });

    describe("Success scenarios", () => {
        afterEach(async () => {
            await Delete.dataSet(REAL_SESSION, afterDataSetName);
        });

        describe("Sequential Data Set", () => {
            beforeEach(async () => {
                runCliScript(createSequentialScript, TEST_ENVIRONMENT, [beforeDataSetName]);
            });
            it("Should rename a data set", async () => {
                const response = runCliScript(renameScript, TEST_ENVIRONMENT, [beforeDataSetName, afterDataSetName]);
                const list1 = await List.dataSet(REAL_SESSION, beforeDataSetName);
                const list2 = await List.dataSet(REAL_SESSION, afterDataSetName);

                expect(list1.apiResponse.returnedRows).toBe(0);
                expect(list2.apiResponse.returnedRows).toBe(1);

                expect(response.stderr.toString()).toBe("");
                expect(response.status).toBe(0);
                expect(response.stdout.toString()).toMatchSnapshot();
                expect(response.stdout.toString()).toContain("Data set renamed successfully.");
            });
        });
        describe("Partitioned Data Set", () => {
            beforeEach(async () => {
                runCliScript(createPartitionedScript, TEST_ENVIRONMENT, [beforeDataSetName]);
            });
            it("Should rename a data set", async () => {
                const response = runCliScript(renameScript, TEST_ENVIRONMENT, [beforeDataSetName, afterDataSetName]);
                const list1 = await List.dataSet(REAL_SESSION, beforeDataSetName);
                const list2 = await List.dataSet(REAL_SESSION, afterDataSetName);

                expect(list1.apiResponse.returnedRows).toBe(0);
                expect(list2.apiResponse.returnedRows).toBe(1);

                expect(response.stderr.toString()).toBe("");
                expect(response.status).toBe(0);
                expect(response.stdout.toString()).toMatchSnapshot();
                expect(response.stdout.toString()).toContain("Data set renamed successfully.");
            });
        });
    });
    describe("Failure scenarios", () => {
        afterEach(async () => {
            await Delete.dataSet(REAL_SESSION, beforeDataSetName);
        });

        describe("Sequential Data Set", () => {
            beforeEach(async () => {
                runCliScript(createSequentialScript, TEST_ENVIRONMENT, [beforeDataSetName]);
            });
            it("Should throw an error if a missing data set name is selected", async () => {
                const response = runCliScript(renameScript, TEST_ENVIRONMENT, ["MISSING.DATA.SET", afterDataSetName]);

                expect(response.stderr.toString()).toBeTruthy();
                expect(response.status).toBe(1);
                expect(response.stdout.toString()).toMatchSnapshot();
                expect(response.stdout.toString()).not.toContain("Data set renamed successfully.");
            });
        });
    });
});
