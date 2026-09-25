'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { createTrackedClickHandler } from '../../../utilities/utils/pendo-tracking';

export interface BasicColumnChartData {
  name: string;
  data: number[];
  color?: string;
}

export interface BasicColumnChartProps {
  categories: string[];
  series: BasicColumnChartData[];
  title?: string;
  subtitle?: string;
  height?: number | string;
  width?: number | string;
  showDataLabels?: boolean;
  colors?: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  yAxisMin?: number;
  tooltipSuffix?: string;
  borderRadius?: string;
  groupPadding?: number;
  className?: string;
  style?: React.CSSProperties;
  onPointClick?: (event: Highcharts.SeriesClickEventObject) => void;
  animation?: boolean;
  enableExporting?: boolean;
  enableResponsive?: boolean;
  showLegend?: boolean;
  legendPosition?: 'vertical' | 'horizontal';
  legendAlign?: 'left' | 'center' | 'right';
  legendVerticalAlign?: 'top' | 'middle' | 'bottom';
  titleFontSize?: string;
  titleFontWeight?: string;
  subTitleFontSize?: string;
  subTitleFontWeight?: string;
  pendoEventId?: string;
  pendoEventData?:
    Record<string, any> | ((event: Highcharts.SeriesClickEventObject) => Record<string, any>);
}

const BasicColumnChart: React.FC<BasicColumnChartProps> = ({
  categories,
  series,
  title = '',
  subtitle = '',
  height = 400,
  width = '100%',
  showDataLabels = true,
  colors = [
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
  ],
  xAxisTitle = '',
  yAxisTitle = '',
  yAxisMin = 0,
  tooltipSuffix = '',
  borderRadius = '50%',
  groupPadding = 0.1,
  className = '',
  style = {},
  onPointClick,
  animation = true,
  enableExporting = false,
  enableResponsive = true,
  showLegend = true,
  legendPosition = 'vertical',
  legendAlign = 'right',
  legendVerticalAlign = 'top',
  titleFontSize = '16px',
  titleFontWeight = 'bold',
  subTitleFontSize = '12px',
  subTitleFontWeight = 'normal',
  pendoEventId,
  pendoEventData,
}) => {
  const [options, setOptions] = useState<Highcharts.Options>({});

  // Create tracked click handler (memoized to prevent infinite loops)
  const trackedOnPointClick = useMemo(
    () => createTrackedClickHandler(onPointClick, pendoEventId, pendoEventData),
    [onPointClick, pendoEventId, pendoEventData]
  );

  useEffect(() => {
    const safeHeight = typeof height === 'number' && !isNaN(height) ? height : 400;
    const safeWidth = typeof width === 'number' && !isNaN(width) ? width : undefined;

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'column',
        height: safeHeight,
        width: safeWidth,
        animation,
        inverted: false,
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
          text: xAxisTitle || null,
        },
        gridLineWidth: 1,
        lineWidth: 0,
        labels: {
          style: {
            fontSize: '12px',
          },
        },
      },
      yAxis: {
        min: yAxisMin,
        title: {
          text: yAxisTitle,
          align: 'high',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
        },
        labels: {
          overflow: 'justify',
          style: {
            fontSize: '12px',
          },
        },
        gridLineWidth: 0,
      },
      plotOptions: {
        column: {
          borderRadius,
          dataLabels: {
            enabled: showDataLabels,
            style: {
              fontSize: '12px',
              fontWeight: 'normal',
            },
          },
          groupPadding,
          cursor: trackedOnPointClick && 'pointer',
          point: {
            events: {
              click: trackedOnPointClick,
            },
          },
        },
      },
      series: series.map((seriesItem) => ({
        type: 'column' as const,
        name: seriesItem.name,
        data: seriesItem.data,
        color: seriesItem.color,
      })),
      legend: {
        enabled: showLegend,
        layout: legendPosition,
        align: legendAlign,
        verticalAlign: legendVerticalAlign,
        x: legendPosition === 'vertical' ? -40 : undefined,
        y: legendPosition === 'vertical' ? 80 : undefined,
        floating: legendPosition === 'vertical',
        borderWidth: legendPosition === 'vertical' ? 1 : 0,
        backgroundColor:
          legendPosition === 'vertical' ? 'var(--highcharts-background-color, #ffffff)' : undefined,
        shadow: legendPosition === 'vertical',
        itemStyle: {
          fontSize: '12px',
        },
      },
      tooltip: {
        valueSuffix: tooltipSuffix,
        pointFormat: '{series.name}: <b>{point.y}</b>',
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
                    floating: false,
                    x: 0,
                    y: 0,
                    borderWidth: 0,
                    backgroundColor: undefined,
                    shadow: false,
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
    setOptions(chartOptions);
  }, [series, trackedOnPointClick]);

  return (
    <div className={className} style={style}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BasicColumnChart;
