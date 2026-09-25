'use client';

import React, { useMemo, useRef, useCallback } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { HighchartsReactRefObject } from 'highcharts-react-official';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/pro-duotone-svg-icons';
import { createTrackedClickHandler } from '../../../utilities/utils/pendo-tracking';
import { getChartContainerLayout } from './chart-layout.utils';
import { useChartResizeReflow } from './useChartResizeReflow';

//reference: https://www.highcharts.com/demo/highcharts/combo-dual-axes

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

declare module 'highcharts' {
  interface SeriesColumnDataOptions {
    name?: string;
    y?: number;
    color?: string;
    drilldown?: string;
  }

  interface SeriesLineDataOptions {
    name?: string;
    y?: number;
    color?: string;
  }
}

export interface ComboChartData {
  name: string;
  y: number;
  color?: string;
  drilldown?: string;
}

export interface ComboChartSeries {
  name: string;
  data: ComboChartData[];
  color?: string;
  type: 'column' | 'line';
  yAxis?: number;
  stack?: string;
  marker?: {
    enabled?: boolean;
    radius?: number;
  };
  lineWidth?: number;
  dashStyle?:
    | 'Solid'
    | 'ShortDash'
    | 'ShortDot'
    | 'ShortDashDot'
    | 'ShortDashDotDot'
    | 'Dot'
    | 'Dash'
    | 'LongDash'
    | 'DashDot'
    | 'LongDashDot'
    | 'LongDashDotDot';
  fillOpacity?: number;
}

const DEFAULT_DRILLDOWN_DATA: Record<string, ComboChartData[]> = {};

export interface ComboChartProps {
  series?: ComboChartSeries[];
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
  yAxisSecondaryTitle?: string;
  className?: string;
  style?: React.CSSProperties;
  onPointClick?: (event: Highcharts.SeriesClickEventObject) => void;
  onLegendItemClick?: (event: Highcharts.SeriesLegendItemClickEventObject) => void;
  enableDrilldown?: boolean;
  drilldownData?: Record<string, ComboChartData[]>;
  animation?: boolean;
  enableExporting?: boolean;
  enableResponsive?: boolean;
  tooltipShared?: boolean;
  tooltipCrosshairs?: boolean;
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

const ComboChart: React.FC<ComboChartProps> = ({
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
  yAxisSecondaryTitle = '',
  className = '',
  style = {},
  onPointClick,
  onLegendItemClick,
  enableDrilldown = false,
  drilldownData = DEFAULT_DRILLDOWN_DATA,
  animation = true,
  enableExporting = false,
  enableResponsive = true,
  tooltipShared = true,
  tooltipCrosshairs = true,
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

  const hasData = useMemo(
    () =>
      Array.isArray(series) &&
      series.length > 0 &&
      series.some((seriesItem) => Array.isArray(seriesItem?.data) && seriesItem.data.length > 0),
    [series]
  );

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
        type: categories ? 'category' : 'linear',
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
        crosshair: tooltipCrosshairs,
      },
      yAxis: [
        {
          // Primary y-axis (left)
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
        {
          // Secondary y-axis (right)
          title: {
            text: yAxisSecondaryTitle,
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
          opposite: true,
        },
      ],
      plotOptions: {
        column: {
          cursor: trackedOnPointClick && 'pointer',
          dataLabels: {
            enabled: showDataLabels,
            format: dataLabelsFormat,
            style: {
              fontSize: '12px',
              fontWeight: 'normal',
            },
          },
          showInLegend: showLegend,
          point: {
            events: {
              click: trackedOnPointClick,
            },
          },
        },
        line: {
          dataLabels: {
            enabled: showDataLabels,
            format: dataLabelsFormat,
            style: {
              fontSize: '12px',
              fontWeight: 'normal',
            },
          },
          showInLegend: showLegend,
          point: {
            events: {
              click: trackedOnPointClick,
            },
          },
        },
      },
      series: series
        ? series.map((seriesItem) => {
            const baseSeries = {
              name: seriesItem.name,
              data: seriesItem.data.map((item) => ({
                name: item.name,
                y: item.y,
                color: item.color,
                drilldown: item.drilldown,
              })),
              color: seriesItem.color,
              yAxis: seriesItem.yAxis || 0,
              stack: seriesItem.stack,
              events: {
                legendItemClick: trackedOnLegendItemClick,
              },
            };

            if (seriesItem.type === 'column') {
              return {
                ...baseSeries,
                type: 'column' as const,
              };
            } else {
              return {
                ...baseSeries,
                type: 'line' as const,
                marker: seriesItem.marker,
                lineWidth: seriesItem.lineWidth,
                dashStyle: seriesItem.dashStyle,
                fillOpacity: seriesItem.fillOpacity,
              };
            }
          })
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
        shared: tooltipShared,
        pointFormat: tooltipShared
          ? '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
          : '{series.name}: <b>{point.y}</b>',
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: enableExporting,
      },
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
                },
              },
            ],
          }
        : undefined,
    };
    // Rebuild when data or layout/handlers change; title/legend/fonts are static in app usage.
  }, [series, categories, trackedOnPointClick, trackedOnLegendItemClick, width, height]);

  useChartResizeReflow(containerRef, reflowChart, { enabled: isFluidWidth, active: hasData });

  if (!hasData) {
    const emptyLayout = getChartContainerLayout({
      width,
      height,
      className,
      style,
      useMinHeight: false,
    });
    return (
      <div ref={containerRef} className={emptyLayout.className} style={emptyLayout.style}>
        <div
          className="flex h-full flex-col items-center justify-center p-4 text-gray-500"
          role="status"
          aria-live="polite"
        >
          {title ? (
            <h4
              className="mb-2 text-center text-gray-700"
              style={{
                fontSize: titleFontSize,
                fontWeight: titleFontWeight,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {title}
            </h4>
          ) : null}
          <div className="mt-4 mb-2 flex items-center justify-center">
            <FontAwesomeIcon icon={faChartColumn} className="text-[12rem] text-gray-400" />
          </div>
          <p className="text-sm font-medium">No data available</p>
          <p className="mt-1 text-xs text-gray-400">Try selecting different filters</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={containerClassName} style={containerStyle}>
      <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ComboChart;
