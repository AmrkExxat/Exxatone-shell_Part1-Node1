'use client';

import React, { useMemo, useRef, useCallback } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { HighchartsReactRefObject } from 'highcharts-react-official';
import { createTrackedClickHandler } from '../../../utilities/utils/pendo-tracking';
import { getChartContainerLayout } from './chart-layout.utils';
import { useChartResizeReflow } from './useChartResizeReflow';

//reference: https://www.highcharts.com/demo/highcharts/column-stacked

const DEFAULT_COLORS = [
  '#7cb5ec',
  '#434348',
  '#90ed7d',
  '#f7a35c',
  '#8085e9',
  '#f15c80',
  '#e4d354',
  '#2b908f',
  '#f45b5b',
  '#91e8e1',
];

const DEFAULT_STACK_LABELS = {
  enabled: false,
  format: '{total}',
  style: {
    fontSize: '12px',
    fontWeight: 'bold' as const,
  },
};

const DEFAULT_TOOLTIP = {
  enabled: true,
  headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
  pointFormat:
    '<span style="color:{point.color}">●</span> <b>{series.name}</b>: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>',
};

declare module 'highcharts' {
  interface SeriesColumnDataOptions {
    name?: string;
    y?: number;
    color?: string;
    drilldown?: string;
  }
}

export interface StackedColumnData {
  name: string;
  y: number;
  color?: string;
  drilldown?: string;
}

export interface StackedColumnSeries {
  name: string;
  data: StackedColumnData[];
  color?: string;
  stack?: string;
  yAxis?: number;
}

const DEFAULT_DRILLDOWN_DATA: Record<string, StackedColumnData[]> = {};

export interface StackedColumnChartProps {
  series?: StackedColumnSeries[];
  categories?: string[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  width?: number | string;
  showLegend?: boolean;
  showDataLabels?: boolean;
  dataLabelsFormat?: string;
  colors?: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  className?: string;
  style?: React.CSSProperties;
  onPointClick?: (event: Highcharts.SeriesClickEventObject) => void;
  onLegendItemClick?: (event: Highcharts.SeriesLegendItemClickEventObject) => void;
  enableDrilldown?: boolean;
  drilldownData?: Record<string, StackedColumnData[]>;
  animation?: boolean;
  enableExporting?: boolean;
  enableResponsive?: boolean;
  stackLabels?: {
    enabled?: boolean;
    format?: string;
    style?: Highcharts.CSSObject;
  };
  tooltip?: {
    enabled?: boolean;
    formatter?: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
    headerFormat?: string;
    pointFormat?: string;
  };
  titleFontSize?: string;
  titleFontWeight?: string;
  subTitleFontSize?: string;
  subTitleFontWeight?: string;
  pendoEventId?: string;
  pendoEventData?:
    Record<string, any> | ((event: Highcharts.SeriesClickEventObject) => Record<string, any>);
  pendoLegendEventId?: string;
  pendoLegendEventData?:
    | Record<string, any>
    | ((event: Highcharts.SeriesLegendItemClickEventObject) => Record<string, any>);
}

const StackedColumnChart: React.FC<StackedColumnChartProps> = ({
  series,
  categories,
  title = '',
  subtitle = '',
  height = 400,
  width = '100%',
  showLegend = true,
  showDataLabels = false,
  dataLabelsFormat = '{point.y}',
  colors = DEFAULT_COLORS,
  xAxisTitle = '',
  yAxisTitle = '',
  className = '',
  style = {},
  onPointClick,
  onLegendItemClick,
  enableDrilldown = false,
  drilldownData = DEFAULT_DRILLDOWN_DATA,
  animation = true,
  enableExporting = false,
  enableResponsive = true,
  stackLabels = DEFAULT_STACK_LABELS,
  tooltip = DEFAULT_TOOLTIP,
  titleFontSize = '16px',
  titleFontWeight = 'bold',
  subTitleFontSize = '12px',
  subTitleFontWeight = 'normal',
  pendoEventId,
  pendoEventData,
  pendoLegendEventId,
  pendoLegendEventData,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HighchartsReactRefObject>(null);

  const {
    isFluidWidth,
    className: containerClassName,
    style: containerStyle,
  } = getChartContainerLayout({ width, height, className, style });

  const reflowChart = useCallback(() => {
    chartRef.current?.chart?.reflow();
  }, []);

  // Create tracked click handlers (memoized to prevent infinite loops)
  const trackedOnPointClick = useMemo(
    () => createTrackedClickHandler(onPointClick, pendoEventId, pendoEventData),
    [onPointClick, pendoEventId, pendoEventData]
  );
  const trackedOnLegendItemClick = useMemo(
    () => createTrackedClickHandler(onLegendItemClick, pendoLegendEventId, pendoLegendEventData),
    [onLegendItemClick, pendoLegendEventId, pendoLegendEventData]
  );

  const options = useMemo((): Highcharts.Options => {
    return {
      chart: {
        type: 'column',
        height,
        ...(isFluidWidth ? {} : { width }),
        animation,
        style: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      },
      title: {
        text: title,
        style: {
          fontSize: titleFontSize,
          fontWeight: titleFontWeight,
        },
      },
      subtitle: {
        text: subtitle,
        style: {
          fontSize: subTitleFontSize,
          fontWeight: subTitleFontWeight,
        },
      },
      colors,
      xAxis: {
        categories,
        title: {
          text: xAxisTitle,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
        },
        labels: {
          style: {
            fontSize: '12px',
          },
        },
      },
      yAxis: {
        title: {
          text: yAxisTitle,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
        },
        labels: {
          style: {
            fontSize: '12px',
          },
        },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: showDataLabels,
            format: dataLabelsFormat,
            style: {
              fontSize: '12px',
              fontWeight: 'normal',
            },
          },
          cursor: trackedOnPointClick && 'pointer',
          showInLegend: showLegend,
          point: {
            events: {
              click: trackedOnPointClick,
            },
          },
        },
      },
      series: series
        ? series.map((seriesItem) => ({
            type: 'column',
            name: seriesItem.name,
            data: seriesItem.data.map((item) => ({
              name: item.name,
              y: item.y,
              color: item.color,
              drilldown: item.drilldown,
            })),
            color: seriesItem.color,
            stack: seriesItem.stack,
            yAxis: seriesItem.yAxis,
            events: {
              legendItemClick: trackedOnLegendItemClick,
            },
          }))
        : [],
      legend: {
        enabled: showLegend,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          fontSize: '12px',
        },
      },
      tooltip: {
        enabled: tooltip.enabled,
        headerFormat: tooltip.headerFormat,
        pointFormat: tooltip.pointFormat,
        formatter: tooltip.formatter,
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: enableExporting,
      },
      drilldown: enableDrilldown
        ? {
            series: Object.entries(drilldownData).map(([key, drilldownSeries]) => ({
              type: 'column',
              name: key,
              id: key,
              data: drilldownSeries.map((item) => ({
                name: item.name,
                y: item.y,
                color: item.color,
              })),
            })),
          }
        : undefined,
      responsive: enableResponsive
        ? {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                  },
                  xAxis: {
                    labels: {
                      rotation: -45,
                    },
                  },
                },
              },
            ],
          }
        : undefined,
    };
    // Rebuild when data or layout/handlers change; title/legend/fonts are static in app usage.
  }, [series, categories, trackedOnPointClick, trackedOnLegendItemClick, width, height]);

  useChartResizeReflow(containerRef, reflowChart, { enabled: isFluidWidth });

  return (
    <div ref={containerRef} className={containerClassName} style={containerStyle}>
      <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StackedColumnChart;
