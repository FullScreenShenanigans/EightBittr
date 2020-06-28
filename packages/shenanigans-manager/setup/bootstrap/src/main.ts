{{ #shenanigans.game }}
import { create{{ shenanigans.name }}Interface } from "./index";

const container = document.getElementById("game")!;

create{{ shenanigans.name }}Interface(container)
    .catch((error: Error): void => {
        console.error("An error happened while trying to instantiate {{ shenanigans.name }}!");
        console.error(error);
    });
{{ /shenanigans.game }}
