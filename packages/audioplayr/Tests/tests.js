var directory = "Sounds",
    fileTypes = ["mp3"],
    library = {
        "General": ["Test"],
        "Themes": ["Theme"]
    };

describe("constructor", function () {
    it("requires library, directory, and fileTypes", function () {
        chai.expect(function () {
            new AudioPlayr({
                "directory": directory,
                "fileTypes": fileTypes
            });
        }).to.throw("No library given to AudioPlayr.");

        chai.expect(function () {
            new AudioPlayr({
                "library": library,
                "fileTypes": fileTypes
            });
        }).to.throw("No directory given to AudioPlayr.");

        chai.expect(function () {
            new AudioPlayr({
                "library": library,
                "directory": directory
            });
        }).to.throw("No fileTypes given to AudioPlayr.");
    });
});