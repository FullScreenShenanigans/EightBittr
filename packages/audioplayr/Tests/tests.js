var directory = "Sounds",
    fileTypes = ["mp3"],
    library = {
        "General": ["Test"],
        "Themes": ["Theme"]
    },
    statistics = {
        "prefix": "MyAudioPlayr::",
        "values": {
            "volume": {},
            "muted": {}
        }
    },
    AudioPlayer, insides;

describe("constructor", function () {
    it("requires library, directory, and fileTypes", function () {
        chai.expect(function () {
            new AudioPlayr({
                "directory": directory,
                "fileTypes": fileTypes,
                "statistics": statistics
            });
        }).to.throw("No library given to AudioPlayr.");

        chai.expect(function () {
            new AudioPlayr({
                "library": library,
                "fileTypes": fileTypes,
                "statistics": statistics
            });
        }).to.throw("No directory given to AudioPlayr.");

        chai.expect(function () {
            new AudioPlayr({
                "library": library,
                "directory": directory,
                "statistics": statistics
            });
        }).to.throw("No fileTypes given to AudioPlayr.");
    });

    it("ensures the internal StatsHoldr has volume and muted", function () {
        chai.expect(function () {
            new AudioPlayr({
                "library": library,
                "directory": directory,
                "fileTypes": fileTypes
            });
        }).to.throw("No statistics with values given to AudioPlayr.");
        chai.expect(function () {
            new AudioPlayr({
                "library": library,
                "directory": directory,
                "fileTypes": fileTypes,
                "statistics": {
                    "values": {}
                }
            });
        }).to.throw("Statistics given to AudioPlayr must include volume and muted.");
    });

    it("starts creating the library", function () {
        AudioPlayer = new AudioPlayr({
            "library": library,
            "directory": directory,
            "fileTypes": fileTypes,
            "statistics": statistics
        });

        insides = AudioPlayer.getLibrary();

        chai.expect(Object.keys(insides)).to.be.length(4);
        chai.expect(insides.Theme.tagName).to.be.equal("AUDIO");
        chai.expect(insides.Test.tagName).to.be.equal("AUDIO");
    });
});

describe("play", function () {
    it("throws an error for invalid requests", function () {
        chai.expect(function () {
            AudioPlayer.play("nope")
        }).to.throw("Unknown name given to AudioPlayr.play: 'nope'.");
    });
});