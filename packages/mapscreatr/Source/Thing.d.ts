/**
 * 
 */
interface IPreThingSettings {
    // The horizontal starting location of the Thing (by default, 0).
    x?: number;

    // The vertical starting location of the Thing (by default, 0).
    y?: number;

    // How wide the Thing is (by default, the Thing's prototype's width from
    // ObjectMaker.getFullPropertiesOf).
    width?: number;

    // How tall the Thing is (by default, the Thing's prototype's height from
    // ObjectMaker.getFullPropertiesOf).
    height?: number;

    // An optional immediate modifier instruction for where the Thing should be
    // in its GroupHoldr group (either "beginning", "end", or undefined).
    position?: string;
}

/**
 * 
 */
interface IThing {
    // The name of the Thing's constructor type, from the MapsCreatr's ObjectMakr.
    title: string;

    // An optional group for the Thing to be in, keyed by its id.
    collection?: any;

    // Whether this should skip stretching the boundaries of an area
    noBoundaryStretch?: boolean;
}