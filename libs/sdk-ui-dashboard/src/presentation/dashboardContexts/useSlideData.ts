// (C) 2022-2025 GoodData Corporation

import { useDashboardCustomizationsContext } from "./DashboardCustomizationsContext.js";
import { ILayoutItemPath, RenderMode } from "../../types.js";

type LayoutElementType = "root" | "nested" | "section" | "item" | "leaf-item";

export const DEFAULT_SLIDE_WIDTH = 1920;
export const DEFAULT_SLIDE_HEIGHT = 1080;

export function useSlideData(renderMode: RenderMode | undefined) {
    const { slideConfig } = useDashboardCustomizationsContext();

    if (renderMode !== "export") {
        return undefined;
    }

    return {
        slideWidth: slideConfig?.width ?? DEFAULT_SLIDE_WIDTH,
        slideHeight: slideConfig?.height ?? DEFAULT_SLIDE_HEIGHT,
    };
}

export function useSlideSizeStyle(
    renderMode: RenderMode | undefined,
    type: LayoutElementType,
    parentLayoutPath?: ILayoutItemPath,
) {
    const data = useSlideData(renderMode);

    if (!data) {
        return {};
    }

    if (type === "root") {
        return {
            width: `${data.slideWidth}px`,
        };
    }

    if (type === "section") {
        return {
            height: `${data.slideHeight}px`,
            ...(parentLayoutPath && parentLayoutPath.length > 0
                ? {
                      gridTemplateRows: "max-content",
                  }
                : {}),
        };
    }

    return {
        height: "100%",
    };
}
