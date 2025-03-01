// (C) 2007-2024 GoodData Corporation
import React from "react";
import {
    newErrorMapping,
    IErrorDescriptors,
    IntlWrapper,
    ErrorCodes,
    ILoadingInjectedProps,
    withEntireDataView,
} from "@gooddata/sdk-ui";
import { ICoreChartProps } from "../../interfaces/index.js";
import { defaultCoreChartProps } from "../_commons/defaultProps.js";
import { IHeadlineTransformationProps } from "./HeadlineProvider.js";

/**
 * @internal
 */
interface ICoreHeadlineExtendedProps {
    headlineTransformation: React.ComponentType<IHeadlineTransformationProps>;
}

type CoreHeadlineProps = ICoreChartProps & ILoadingInjectedProps & ICoreHeadlineExtendedProps;

export class HeadlineStateless extends React.Component<CoreHeadlineProps> {
    public static defaultProps = {
        ...defaultCoreChartProps,
        config: {},
    };

    private errorMap: IErrorDescriptors;

    constructor(props: CoreHeadlineProps) {
        super(props);
        this.errorMap = newErrorMapping(props.intl);
    }

    public render(): JSX.Element {
        const { dataView, error, isLoading } = this.props;

        const ErrorComponent = this.props.ErrorComponent;
        const LoadingComponent = this.props.LoadingComponent;

        if (error) {
            const errorProps =
                this.errorMap[
                    Object.prototype.hasOwnProperty.call(this.errorMap, error)
                        ? error
                        : ErrorCodes.UNKNOWN_ERROR
                ];
            return ErrorComponent ? <ErrorComponent code={error} {...errorProps} /> : null;
        }

        // when in pageble mode (getPage present) never show loading (its handled by the component)
        if (isLoading || !dataView) {
            return LoadingComponent ? <LoadingComponent /> : null;
        }

        return this.renderVisualization();
    }

    protected renderVisualization(): JSX.Element {
        const {
            afterRender,
            drillableItems,
            locale,
            dataView,
            onDrill,
            config,
            headlineTransformation: HeadlineTransformation,
        } = this.props;

        return (
            <IntlWrapper locale={locale}>
                <HeadlineTransformation
                    dataView={dataView}
                    onAfterRender={afterRender}
                    onDrill={onDrill}
                    drillableItems={drillableItems}
                    config={config}
                />
            </IntlWrapper>
        );
    }
}

/**
 * @internal
 */
const CoreHeadline = withEntireDataView(HeadlineStateless);

/**
 * NOTE: exported to satisfy sdk-ui-ext; is internal, must not be used outside of SDK; will disapppear.
 */
export type { ICoreHeadlineExtendedProps };
export { CoreHeadline };
