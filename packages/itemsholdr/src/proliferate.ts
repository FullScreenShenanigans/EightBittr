/**
 * Proliferates all members of the donor to the recipient recursively, as
 * a deep copy.
 *
 * @param recipient   An object receiving the donor's members.
 * @param donor   An object whose members are copied to recipient.
 * @param noOverride   Whether recipient properties may be overriden (by default, false).
 * @returns The recipient, which should have the donor proliferated onto it.
 */
export const proliferate = (recipient: any, donor: any, noOverride?: boolean): any => {
    // For each attribute of the donor:
    for (const i in donor) {
        if (!donor.hasOwnProperty(i)) {
            continue;
        }

        // If noOverride, don't override already existing properties
        if (noOverride && recipient.hasOwnProperty(i)) {
            continue;
        }

        // If it's an object, recurse on a new version of it
        const setting: any = donor[i];
        if (typeof setting === "object") {
            if (!recipient.hasOwnProperty(i)) {
                recipient[i] = new setting.constructor();
            }

            proliferate(recipient[i], setting, noOverride);
        } else {
            // Regular primitives are easy to copy otherwise
            recipient[i] = setting;
        }
    }

    return recipient;
};
