import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export const rS = function(size) {
    return scale(size);
};

export const rV = function(size) {
    return verticalScale(size);
};

export const rMS = function(size, factor = 0.5) {
    return moderateScale(size, factor);
};