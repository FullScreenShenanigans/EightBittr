import { ObjectMakr } from "objectmakr";

import { EightBittr } from "../EightBittr";

export const createObjectMaker = (eightBitter: EightBittr) =>
    new ObjectMakr({
        indexMap: eightBitter.objects.indexMap,
        inheritance: eightBitter.objects.inheritance,
        onMake: eightBitter.objects.onMake,
        properties: eightBitter.objects.properties,
        ...eightBitter.settings.components.objectMaker,
    });
