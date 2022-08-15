import { createContext } from "preact";
import { useContext } from "preact/hooks";

import { ClassNames } from "./Bootstrapping/ClassNames";
import { Styles } from "./Bootstrapping/Styles";
import { AbsoluteSizeSchema } from "./Sizing";

export interface VisualContextType {
    classNames: ClassNames;
    containerSize: AbsoluteSizeSchema;
    styles: Styles;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const VisualContext = createContext<VisualContextType>({} as any);

export const useVisualContext = () => useContext(VisualContext);
