'use client';

import React, { useMemo, useRef, useCallback } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { HighchartsReactRefObject } from 'highcharts-react-official';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/pro-duotone-svg-icons';
import { createTrackedClickHandler } from '../../../utilities/utils/pendo-tracking';
import { getChartContainerLayout } from './chart-layout.utils';
import { useChartResizeReflow } from './useChartResizeReflow';

//reference: https://www.highcharts.com/demo/highcharts/pie-chart

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

const DEFAULT_CENTER: [string, string] = ['50%', '50%'];

declare module 'highcharts' {
  interface SeriesPieDataOptions {
    name?: string;
    y?: number;
    color?: string;
    sliced?: boolean;
    selected?: boolean;
  }
}

export interface PieChartData {
  name: string;
  y: number;
  color?: string;
  sliced?: boolean;
  selected?: boolean;
}

export interface PieChartProps {
  data?: PieChartData[] | null;
  title?: string;
  subtitle?: string;
  height?: number | string;
  width?: number | string;
  showLegend?: boolean;
  showDataLabels?: boolean;
  dataLabelsFormat?: string;
  colors?: string[];
  center?: [string | number, string | number];
  size?: string | number;
  innerSize?: string | number;
  startAngle?: number;
  endAngle?: number;
  className?: string;
  style?: React.CSSProperties;
  onPointClick?: (event: Highcharts.SeriesClickEventObject) => void;
  onLegendItemClick?: (event: Highcharts.SeriesLegendItemClickEventObject) => void;
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

const PieHighChart: React.FC<PieChartProps> = ({
  data,
  title = '',
  subtitle = '',
  height = 400,
  width = '100%',
  showLegend = true,
  showDataLabels = true,
  dataLabelsFormat = '{point.name}: {point.percentage:.1f}%',
  colors = DEFAULT_COLORS,
  center = DEFAULT_CENTER,
  size = '75%',
  innerSize = '0%',
  startAngle = 0,
  endAngle = 360,
  className = '',
  style = {},
  onPointClick,
  onLegendItemClick,
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
    () => Array.isArray(data) && data.some((item) => Number(item?.y ?? 0) > 0),
    [data]
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
        type: 'pie',
        height,
        ...(isFluidWidth ? {} : { width }),
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
      plotOptions: {
        pie: {
          cursor: trackedOnPointClick && 'pointer',
          center,
          size,
          innerSize,
          startAngle,
          endAngle,
          dataLabels: {
            enabled: showDataLabels,
            format: dataLabelsFormat,
            style: {
              fontSize: '12px',
              fontWeight: 'normal',
            },
            distance: 20,
            connectorPadding: 5,
            connectorShape: 'crookedLine',
            crookDistance: '70%',
            crop: false,
            overflow: 'justify',
          },
          showInLegend: showLegend,
          point: {
            events: {
              click: trackedOnPointClick,
            },
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: title,
          data: (data ?? []).map((item) => ({
            name: item.name,
            y: item.y,
            color: item.color,
            sliced: item.sliced,
            selected: item.selected,
            ...(item.y === 0 && { dataLabels: { enabled: false } }),
          })),
          events: {
            legendItemClick: trackedOnLegendItemClick,
          },
        },
      ],
      legend: {
        enabled: showLegend,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          fontSize: '12px',
          cursor: 'pointer',
        },
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)',
      },
      credits: {
        enabled: false,
      },
      responsive: {
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
      },
    };
    // Rebuild when data or layout/handlers change; title/legend/fonts are static in app usage.
  }, [data, trackedOnPointClick, trackedOnLegendItemClick, width, height]);

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
          className="flex h-full flex-col items-center justify-center text-gray-500"
          role="status"
          aria-live="polite"
        >
          {title ? (
            <h3
              className="mb-4 text-center text-gray-800"
              style={{ fontSize: titleFontSize, fontWeight: titleFontWeight }}
            >
              {title}
            </h3>
          ) : null}
          <div className="mb-2 flex items-center justify-center">
            <FontAwesomeIcon icon={faChartPie} className="text-[12rem] text-gray-400" />
          </div>
          <p className="text-sm font-medium">No data available</p>
          <p className="mt-1 text-xs text-gray-400">Try selecting a different timeframe</p>
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

export default PieHighChart;
