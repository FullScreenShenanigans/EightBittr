import * as React from "react";

import { ClassNames } from "./Bootstrapping/ClassNames";
import { Styles } from "./Bootstrapping/Styles";
import { AbsoluteSizeSchema } from "./Sizing";

export interface VisualContextType {
    classNames: ClassNames;
    containerSize: AbsoluteSizeSchema;
    styles: Styles;
}

export const VisualContext = React.createContext<VisualContextType>({} as any);

export const useVisualContext = () => React.useContext(VisualContext);
