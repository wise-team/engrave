import { describe } from "mocha";
import { mongoose } from "../src/app";

describe("Engrave tests", function () {

    /* This test is created only to wait for ENGRAVE app to get up and establish connection with database */

    before((done) => {
        mongoose.connection.on("open", () => {
            done();
        })
    })

    it("I'm here just to wait for database. Happy testing!", (done) => {
        done();
    })
})