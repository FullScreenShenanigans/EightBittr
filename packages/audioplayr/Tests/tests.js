var directory = "Sounds",
    fileTypes = ["mp3"],
    library = {
        "General": ["Test"],
        "Themes": ["Theme"]
    },
    ItemsHolder = new ItemsHoldr.ItemsHoldr({
        "prefix": "MyAudioPlayr::",
        "values": {
            "volume": {},
            "muted": {}
        }
    }),
    AudioPlayer, insides, sound;

describe("constructor", function () {
    it("requires library, directory, and fileTypes", function () {
        chai.expect(function () {
            new AudioPlayr.AudioPlayr({
                "directory": directory,
                "fileTypes": fileTypes,
                "ItemsHolder": ItemsHolder
            });
        }).to.throw("No library given to AudioPlayr.");

        chai.expect(function () {
            new AudioPlayr.AudioPlayr({
                "library": library,
                "fileTypes": fileTypes,
                "ItemsHolder": ItemsHolder
            });
        }).to.throw("No directory given to AudioPlayr.");

        chai.expect(function () {
            new AudioPlayr.AudioPlayr({
                "library": library,
                "directory": directory,
                "ItemsHolder": ItemsHolder
            });
        }).to.throw("No fileTypes given to AudioPlayr.");
    });

    it("ensures the internal ItemsHoldr has volume and muted", function () {
        chai.expect(function () {
            new AudioPlayr.AudioPlayr({
                "library": library,
                "directory": directory,
                "fileTypes": fileTypes
            });
        }).to.throw("No ItemsHoldr given to AudioPlayr.");
    });

    it("starts creating the library", function () {
        AudioPlayer = new AudioPlayr.AudioPlayr({
            "library": library,
            "directory": directory,
            "fileTypes": fileTypes,
            "ItemsHolder": ItemsHolder
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
    
    it("returns a playing sound", function () {
       sound = AudioPlayer.play("Test");
       chai.expect(sound.tagName).to.be.equal("AUDIO");
       chai.expect(sound.volume).to.be.equal(AudioPlayer.getVolume());
       chai.expect(sound.getAttribute("volumeReal")).to.be.equal("1");
    });
});
