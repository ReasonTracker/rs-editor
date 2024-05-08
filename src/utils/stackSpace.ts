
export interface Stacked {
    top: number
    bottom: number
    center: number
}

export function stackSpace(gutter: number = 0) {
    let notFirst = false;
    let position = 0;
    return (value: number, gap: number = 0) => {
        if (notFirst) position += gutter;
        position += gap;
        const result = { top: position, center: position + (value / 2), bottom: position + value };
        notFirst = true;
        position = result.bottom;

        return result;
    }
}

export function scaleStacked(stack: Stacked, scale: number): Stacked {
    const oldHalfWidth = stack.bottom - stack.center;
    const newHalfWidth = oldHalfWidth * scale;
    return {
        top: stack.center - newHalfWidth,
        center: stack.center,
        bottom: stack.center + newHalfWidth,
    };
}

export function sizeStacked(stack: Stacked, size: number): Stacked {
    const newHalfWidth = size / 2;
    return {
        top: stack.center - newHalfWidth,
        center: stack.center,
        bottom: stack.center + newHalfWidth,
    };
}

