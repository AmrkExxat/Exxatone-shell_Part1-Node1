'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { createTrackedClickHandler } from '../../../../utilities/utils/pendo-tracking';

export interface MapDataPoint {
  name: string;
  value: number;
  code?: string;
  stateName?: string;
  [key: string]: any;
}

export interface MapSeries {
  name: string;
  data: MapDataPoint[];
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  nullColor?: string;
  showInLegend?: boolean;
  joinBy?: string[];
  dataLabels?: Highcharts.DataLabelsOptions;
  accessibility?: Highcharts.SeriesAccessibilityOptionsObject;
}

export interface ColorAxisConfig {
  min?: number;
  max?: number;
  type?: 'linear' | 'logarithmic';
  minColor?: string;
  maxColor?: string;
  stops?: Array<[number, string]>;
  labels?: Highcharts.ColorAxisLabelsOptions;
  title?: Highcharts.AxisTitleOptions;
}

export interface TooltipConfig {
  formatter?: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
  headerFormat?: string;
  pointFormat?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  shadow?: boolean;
  style?: Highcharts.CSSObject;
}

export interface HeatMapProps {
  series: MapSeries;
  mapData?: any;
  mapUrl?: string;

  title?: string | Highcharts.TitleOptions;
  subtitle?: string | Highcharts.SubtitleOptions;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;

  colorAxis?: ColorAxisConfig;

  tooltip?: TooltipConfig;

  mapNavigation?: {
    enabled?: boolean;
    buttonOptions?: Highcharts.MapNavigationButtonOptions;
  };

  showLegend?: boolean;
  legendPosition?: 'vertical' | 'horizontal';
  legendAlign?: 'left' | 'center' | 'right';
  legendVerticalAlign?: 'top' | 'middle' | 'bottom';
  legendOptions?: Highcharts.LegendOptions;

  enableExporting?: boolean;
  enableResponsive?: boolean;
  exportingOptions?: Highcharts.ExportingOptions;

  onPointClick?: (event: Highcharts.SeriesClickEventObject) => void;
  onMapLoad?: () => void;
  onChartLoad?: (event: Highcharts.ChartClickEventObject) => void;

  accessibility?: Highcharts.AccessibilityOptions;

  showCredits?: boolean;
  creditsOptions?: Highcharts.CreditsOptions;
  pendoEventId?: string;
  pendoEventData?:
    Record<string, any> | ((event: Highcharts.SeriesClickEventObject) => Record<string, any>);
}

const defaultSeriesData = [
  { value: 0, code: 'NJ', stateName: 'New Jersey' },
  { value: 0, code: 'RI', stateName: 'Rhode Island' },
  { value: 0, code: 'MA', stateName: 'Massachusetts' },
  { value: 0, code: 'CT', stateName: 'Connecticut' },
  { value: 0, code: 'MD', stateName: 'Maryland' },
  { value: 0, code: 'NY', stateName: 'New York' },
  { value: 0, code: 'DE', stateName: 'Delaware' },
  { value: 0, code: 'FL', stateName: 'Florida' },
  { value: 0, code: 'OH', stateName: 'Ohio' },
  { value: 0, code: 'PA', stateName: 'Pennsylvania' },
  { value: 0, code: 'IL', stateName: 'Illinois' },
  { value: 0, code: 'CA', stateName: 'California' },
  { value: 0, code: 'HI', stateName: 'Hawaii' },
  { value: 0, code: 'VA', stateName: 'Virginia' },
  { value: 0, code: 'MI', stateName: 'Michigan' },
  { value: 0, code: 'IN', stateName: 'Indiana' },
  { value: 0, code: 'NC', stateName: 'North Carolina' },
  { value: 0, code: 'GA', stateName: 'Georgia' },
  { value: 0, code: 'TN', stateName: 'Tennessee' },
  { value: 0, code: 'NH', stateName: 'New Hampshire' },
  { value: 0, code: 'SC', stateName: 'South Carolina' },
  { value: 0, code: 'LA', stateName: 'Louisiana' },
  { value: 0, code: 'KY', stateName: 'Kentucky' },
  { value: 0, code: 'WI', stateName: 'Wisconsin' },
  { value: 0, code: 'WA', stateName: 'Washington' },
  { value: 0, code: 'AL', stateName: 'Alabama' },
  { value: 0, code: 'MO', stateName: 'Missouri' },
  { value: 0, code: 'TX', stateName: 'Texas' },
  { value: 0, code: 'WV', stateName: 'West Virginia' },
  { value: 0, code: 'VT', stateName: 'Vermont' },
  { value: 0, code: 'MN', stateName: 'Minnesota' },
  { value: 0, code: 'MS', stateName: 'Mississippi' },
  { value: 0, code: 'IA', stateName: 'Iowa' },
  { value: 0, code: 'AR', stateName: 'Arkansas' },
  { value: 0, code: 'OK', stateName: 'Oklahoma' },
  { value: 0, code: 'AZ', stateName: 'Arizona' },
  { value: 0, code: 'CO', stateName: 'Colorado' },
  { value: 0, code: 'ME', stateName: 'Maine' },
  { value: 0, code: 'OR', stateName: 'Oregon' },
  { value: 0, code: 'KS', stateName: 'Kansas' },
  { value: 0, code: 'UT', stateName: 'Utah' },
  { value: 0, code: 'NE', stateName: 'Nebraska' },
  { value: 0, code: 'NV', stateName: 'Nevada' },
  { value: 0, code: 'ID', stateName: 'Idaho' },
  { value: 0, code: 'NM', stateName: 'New Mexico' },
  { value: 0, code: 'SD', stateName: 'South Dakota' },
  { value: 0, code: 'ND', stateName: 'North Dakota' },
  { value: 0, code: 'MT', stateName: 'Montana' },
  { value: 0, code: 'WY', stateName: 'Wyoming' },
  { value: 0, code: 'AK', stateName: 'Alaska' },
];

const HeatMap: React.FC<HeatMapProps> = ({
  series,
  title = 'Heat Map',
  subtitle,
  height = 500,
  width,
  className,
  style,
  colorAxis,
  tooltip,
  mapNavigation = { enabled: true },
  showLegend = true,
  legendPosition = 'horizontal',
  legendAlign = 'center',
  legendVerticalAlign = 'top',
  legendOptions,
  enableExporting = true,
  enableResponsive = true,
  exportingOptions,
  onPointClick,
  onMapLoad,
  onChartLoad,
  accessibility,
  pendoEventId,
  pendoEventData,
}) => {
  const [chartOptions, setChartOptions] = React.useState<Highcharts.Options>({});

  // Create tracked click handler (memoized to prevent infinite loops)
  const trackedOnPointClick = React.useMemo(
    () => createTrackedClickHandler(onPointClick, pendoEventId, pendoEventData),
    [onPointClick, pendoEventId, pendoEventData]
  );

  // Load Highcharts map module
  React.useEffect(() => {
    try {
      const HighchartsMap = require('highcharts/modules/map');
      if (HighchartsMap && typeof HighchartsMap === 'function') {
        HighchartsMap(Highcharts);
        console.log('Map module loaded successfully');
      }
    } catch (error) {
      console.warn('Map module could not be loaded:', error);
    }
  }, []);

  React.useEffect(() => {
    let worldMapData: any = null;

    try {
      worldMapData = require('@highcharts/map-collection/countries/us/us-all.topo.json');
    } catch (error) {
      console.warn('Map data could not be loaded:', error);
    }

    const processedSeriesData = defaultSeriesData.map((defaultPoint) => {
      const code = defaultPoint.code?.toUpperCase();
      const matchingValue = series?.data?.find(
        (point) => point.code?.toUpperCase() === code
      )?.value;

      return matchingValue !== undefined ? { ...defaultPoint, value: matchingValue } : defaultPoint;
    });

    const options: Highcharts.Options = {
      chart: {
        map: worldMapData,
        height,
        width,
        events: {
          load: onMapLoad,
          ...(onChartLoad && { chartLoad: onChartLoad }),
        },
      },
      title: typeof title === 'string' ? { text: title } : title,
      subtitle: typeof subtitle === 'string' ? { text: subtitle } : subtitle,

      plotOptions: {
        series: {
          cursor: trackedOnPointClick && 'pointer',
        },
      },

      exporting: enableExporting
        ? { sourceWidth: 600, sourceHeight: 500, ...exportingOptions }
        : { enabled: false },

      mapNavigation,
      legend: showLegend
        ? {
            layout: legendPosition,
            borderWidth: 0,
            backgroundColor: `color-mix(
          in srgb,
          var(--highcharts-background-color, white),
          transparent 15%
        )`,
            floating: true,
            align: legendAlign,
            verticalAlign: legendVerticalAlign,
            y: legendVerticalAlign === 'top' ? 25 : undefined,
            ...legendOptions,
          }
        : { enabled: false },

      colorAxis: {
        min: 1,
        type: 'linear',
        minColor: '#FFFFFF',
        maxColor: '#19198C',
        stops: colorAxis?.stops || [
          [0, '#FFFFFF'],
          [0.33, '#babadc'],
          [0.5, '#7575ba'],
          [0.67, '#4646A3'],
          [1, '#19198C'],
        ],
        ...colorAxis,
      },
      series: [
        {
          type: 'map',
          accessibility: {
            point: {
              valueDescriptionFormat: '{xDescription}, {point.value} {point.stateName}',
            },
          },
          animation: true,
          data: processedSeriesData || [],
          joinBy: series?.joinBy || ['postal-code', 'code'],
          dataLabels: {
            enabled: true,
            color: '#FFFFFF',
            format: '{point.code}',
          },
          name: series?.name,
          tooltip: tooltip
            ? tooltip
            : {
                pointFormat: '{point.code}: {point.value} {point.stateName}',
              },
          events: {
            ...(trackedOnPointClick && { click: trackedOnPointClick }),
          },
        } as any,
      ],

      accessibility: {
        enabled: true,
        ...accessibility,
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

    setChartOptions(options);
  }, [series, trackedOnPointClick]);

  return (
    <div
      className={className}
      style={{
        ...style,
      }}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        constructorType={'mapChart'}
      />
    </div>
  );
};

export default HeatMap;
