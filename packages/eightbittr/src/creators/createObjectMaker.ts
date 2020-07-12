import { ObjectMakr } from "objectmakr";

import { EightBittr } from "../EightBittr";

export const createObjectMaker = (game: EightBittr) =>
    new ObjectMakr({
        indexMap: game.objects.indexMap,
        inheritance: game.objects.inheritance,
        onMake: game.objects.onMake,
        properties: game.objects.properties,
        ...game.settings.components.objectMaker,
    });
